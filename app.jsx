// app.jsx — main router + state + tweaks panel

const { useState: useS, useEffect: useE, useMemo: useM } = React;

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "connection": "online",
  "showOSContestada": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULS);

  // ───── Connection state (driven by tweaks) ─────
  // possible: 'online' | 'offline' | 'syncing'
  const conn = tweaks.connection;

  // ───── Navigation stack ─────
  const [stack, setStack] = useS([{ name: 'login', params: {} }]);
  const top = stack[stack.length - 1];

  const navigate = (name, params = {}) => {
    if (name === -1) {
      setStack(s => s.length > 1 ? s.slice(0, -1) : s);
      return;
    }
    setStack(s => [...s, { name, params }]);
  };
  const replaceTop = (name, params = {}) => {
    setStack(s => [...s.slice(0, -1), { name, params }]);
  };
  const resetTo = (name, params = {}) => setStack([{ name, params }]);

  // ───── Active farm ─────
  const [fazenda, setFazenda] = useS('MV');

  // ───── Current OS (mutable) ─────
  const [currentOS, setCurrentOS] = useS({ ...AGM_DATA.OS_LIST[0] });
  const updateOS = (patch) => setCurrentOS(prev => ({ ...prev, ...patch }));
  const closeOS = (patch) => setCurrentOS(prev => ({ ...prev, ...patch, status: 'concluida', hrAtu: patch.hrFim || prev.hrAtu }));

  // ───── Sync queue (depends on conn) ─────
  const [queue, setQueue] = useS([...AGM_DATA.SYNC_QUEUE_INITIAL]);
  const [syncProgress, setSyncProgress] = useS(0);

  // Auto-sync effect: when connection becomes 'syncing', drain the queue gradually
  useE(() => {
    if (conn !== 'syncing') {
      setSyncProgress(0);
      return;
    }
    if (queue.length === 0) return;
    let p = 0;
    const tick = setInterval(() => {
      p += 0.10;
      setSyncProgress(p);
      if (p >= 1) {
        clearInterval(tick);
        setQueue([]);
        setSyncProgress(0);
        // bounce back to online via the tweak
        setTweak('connection', 'online');
      }
    }, 350);
    return () => clearInterval(tick);
  }, [conn]);

  const queueLen = conn === 'syncing'
    ? Math.max(0, queue.length - Math.floor(syncProgress * queue.length))
    : queue.length;

  const onForceSync = () => setTweak('connection', 'syncing');
  const onOpenSync = () => navigate('sync-queue');

  // ───── Render screen ─────
  const screenProps = {
    conn, queueLen, queue, syncProgress, navigate, fazenda,
    currentOS, onUpdateOS: updateOS, onCloseOS: closeOS,
    onOpenSync, onForceSync,
  };

  // Hide chrome on certain screens
  const noChrome = ['login', 'farm-select', 'os-success', 'fuel-success'];

  return (
    <div className="desk">
      <Device dark={top.name === 'login'} hideStatusBar={top.name === 'login'}>
        {top.name === 'login' && (
          <ScreenLogin onLogin={() => navigate('farm-select')} />
        )}
        {top.name === 'farm-select' && (
          <ScreenFarmSelect conn={conn} queueLen={queueLen}
            onPick={(id) => { setFazenda(id); resetTo('dash'); }} />
        )}
        {top.name === 'dash' && <ScreenDashboard {...screenProps} />}
        {top.name === 'os-list' && <ScreenOSList {...screenProps} />}
        {top.name === 'os-wizard' && (
          <ScreenOSWizard {...screenProps} onCommit={(d) => {
            // Push a new sync-queue item if offline
            if (conn === 'offline') {
              setQueue(q => [...q, {
                id: 'q' + (q.length + 5), kind: 'OS',
                label: 'Abertura ' + (currentOS.id || 'OS-NOVA'),
                sub: `${d.maquina} · ${AGM_DATA.SERVICOS.find(s => s.id === d.servico)?.nome} · ${d.talhao}`,
                ts: '10/05 ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                size: '3.6 KB',
              }]);
            }
          }} />
        )}
        {top.name === 'os-detail' && (
          <ScreenOSDetail {...screenProps} osId={top.params.osId} />
        )}
        {top.name === 'os-closing' && <ScreenOSClosing {...screenProps} />}
        {top.name === 'os-success' && <ScreenOSSuccess navigate={resetTo} conn={conn} />}

        {top.name === 'fuel-form' && (
          <ScreenFuelForm {...screenProps} onCommit={(d) => {
            if (conn === 'offline') {
              setQueue(q => [...q, {
                id: 'q' + (q.length + 5), kind: 'Abastec.',
                label: 'Abastecimento AB-NOVO',
                sub: `${d.maquina} · ${d.litros} L · ${d.bomba}`,
                ts: '10/05 ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                size: '1.2 KB',
              }]);
            }
          }} />
        )}
        {top.name === 'fuel-success' && <ScreenFuelSuccess navigate={resetTo} conn={conn} />}
        {top.name === 'fuel-list' && <ScreenFuelList {...screenProps} />}
        {top.name === 'fuel-balance' && <ScreenFuelBalance {...screenProps} />}

        {top.name === 'sync-queue' && <ScreenSyncQueue {...screenProps} />}
        {top.name === 'conflict' && <ScreenConflict {...screenProps}
          onResolve={(c) => { /* no-op for prototype */ }} />}

        {top.name === 'more' && <ScreenMore {...screenProps}
          onLogout={() => resetTo('login')} />}
        {top.name === 'cad-maquinas' && <ScreenCadMaquinas {...screenProps} />}
        {top.name === 'relatorios' && <ScreenRelatorios {...screenProps} />}

        {top.name === 'buy' && <ScreenBuyStub {...screenProps} />}

        {/* Bottom tabs (hidden on auth + success + wizard mid-flow) */}
        {!noChrome.includes(top.name) && top.name !== 'os-wizard' &&
         top.name !== 'os-closing' && top.name !== 'os-detail' &&
         top.name !== 'fuel-form' && top.name !== 'conflict' && (
          <BottomTabs active={tabFromScreen(top.name)} onChange={(t) => {
            const map = { dash: 'dash', os: 'os-list', fuel: 'fuel-list',
                          buy: 'buy', more: 'more' };
            resetTo(map[t]);
          }} />
        )}
      </Device>

      {/* Caption under device */}
      <div className="device-caption">
        <span>Agromed AGM · Operador Aderbal</span>
      </div>

      <AGMTweaks tweaks={tweaks} setTweak={setTweak} navigate={navigate} resetTo={resetTo} />
    </div>
  );
}

function tabFromScreen(name) {
  if (name === 'dash') return 'dash';
  if (name.startsWith('os')) return 'os';
  if (name.startsWith('fuel')) return 'fuel';
  if (name === 'buy') return 'buy';
  if (name === 'more' || name.startsWith('cad-') || name === 'relatorios' ||
      name === 'sync-queue' || name === 'conflict') return 'more';
  return 'dash';
}

// ─────────────────────────────────────────────────────────────
// Stub: Compras (out of operator focus)
// ─────────────────────────────────────────────────────────────
function ScreenBuyStub({ conn, queueLen }) {
  return (
    <>
      <AppBar large title={<>Compras</>} eyebrow="Comprador · multi-fazenda"
              conn={conn} queueLen={queueLen} />
      <div className="screen-body">
        <div style={{ padding: '0 16px 14px' }}>
          <div className="card" style={{ padding: 18, background: 'var(--sand-100)',
                                          border: '1px solid var(--sand-200)' }}>
            <Badge status="warning">Fora deste protótipo</Badge>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 22, marginTop: 10 }}>
              Foco atual: <em style={{ color: 'var(--clay-700)' }}>Operador de campo</em>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.55 }}>
              O ciclo de Ordens de Compra (Rascunho → Aprovada → Aguardar → Pago) está mapeado no PRD e ficará pronto na próxima entrega — wizard de OC, comparação de cotações e marcação de pagamento read-only.
            </div>
          </div>
        </div>

        <div className="section-title">Prévia</div>
        <div className="card-stack">
          {[
            { id: 'OC-1042', forn: 'Casa do Trator MT', val: 'R$ 18.420,00', stat: 'aprovada', venc: '14/05' },
            { id: 'OC-1039', forn: 'Diesel Sul Ltda',   val: 'R$ 92.150,00', stat: 'aguardando', venc: '20/05' },
            { id: 'OC-1031', forn: 'Stara Distribuidora', val: 'R$ 7.580,00', stat: 'pago', venc: 'Pago 09/05' },
          ].map(o => (
            <div key={o.id} className="card os-card" style={{ opacity: 0.7 }}>
              <div className="head">
                <span className="id">{o.id}</span>
                <Badge status={o.stat === 'aprovada' ? 'success' : o.stat === 'pago' ? 'olive' : 'warning'}>
                  {o.stat === 'aprovada' ? 'Aprovada' : o.stat === 'pago' ? 'Pago' : 'Aguardando'}
                </Badge>
              </div>
              <div className="machine">{o.forn}</div>
              <div className="meta">
                <span><b>{o.val}</b></span>
                <span>{o.venc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Tweaks panel
// ─────────────────────────────────────────────────────────────
function AGMTweaks({ tweaks, setTweak, navigate, resetTo }) {
  return (
    <TweaksPanel>
      <TweakSection title="Estado de conexão">
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'online',  label: 'Online',  color: '#4F7A3F' },
            { id: 'offline', label: 'Offline', color: '#A77321' },
            { id: 'syncing', label: 'Sync',    color: '#3E5F7A' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setTweak('connection', opt.id)}
                    style={{
                      flex: 1, height: 38, borderRadius: 10,
                      background: tweaks.connection === opt.id ? opt.color : 'transparent',
                      color: tweaks.connection === opt.id ? '#FBF7EC' : '#1F1A14',
                      border: '1.5px solid ' + (tweaks.connection === opt.id ? opt.color : 'rgba(40,30,18,0.18)'),
                      fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#7A6E5E', lineHeight: 1.45 }}>
          <b>Online:</b> tudo verde · <b>Offline:</b> banner + fila persistente · <b>Sync:</b> drena a fila com progresso
        </div>
      </TweakSection>

      <TweakSection title="Navegar para…">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <TweakLink label="Login" onClick={() => resetTo('login')} />
          <TweakLink label="Dashboard operador" onClick={() => resetTo('dash')} />
          <TweakLink label="Wizard nova OS" onClick={() => resetTo('dash') || setTimeout(() => navigate('os-wizard'), 0)} />
          <TweakLink label="Encerramento OS" onClick={() => resetTo('os-closing')} />
          <TweakLink label="Abastecimento" onClick={() => resetTo('fuel-form')} />
          <TweakLink label="Fila de sync" onClick={() => resetTo('sync-queue')} />
          <TweakLink label="Conflito LWW" onClick={() => resetTo('conflict')} />
        </div>
      </TweakSection>

      <TweakSection title="Sobre">
        <div style={{ fontSize: 12, color: '#4A3F33', lineHeight: 1.55 }}>
          Protótipo navegável focado no fluxo do operador: OS Interna fim-a-fim + Abastecimento + estados offline. Visual rústico-tech com paleta de terra (verde-oliva, marrom queimado, off-white).
        </div>
      </TweakSection>
    </TweaksPanel>
  );
}

function TweakLink({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      height: 36, padding: '0 12px', borderRadius: 9,
      background: 'rgba(40,30,18,0.05)',
      border: '1px solid rgba(40,30,18,0.10)',
      color: '#1F1A14',
      fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 500,
      textAlign: 'left', cursor: 'pointer',
    }}>
      → {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Mount
// ─────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
