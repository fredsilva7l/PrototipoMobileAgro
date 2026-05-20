// screens-auth.jsx — Login, Farm select, Dashboard

const { useState: useStateA, useEffect: useEffectA } = React;

// ─────────────────────────────────────────────────────────────
// Login screen
// ─────────────────────────────────────────────────────────────
function ScreenLogin({ onLogin }) {
  const [user, setUser] = useStateA('aderbal.souza');
  const [pwd, setPwd] = useStateA('••••••••');
  const [showPwd, setShowPwd] = useStateA(false);
  const [keep, setKeep] = useStateA(true);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                  background: 'linear-gradient(180deg, #2D341B 0%, #3F4D26 50%, #2A241C 100%)' }}>
      <StatusBar dark />
      <div style={{ flex: 1, padding: '20px 24px 0', color: 'var(--ink-on-dark)',
                    display: 'flex', flexDirection: 'column' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: '#FBF7EC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 32 32" width={26} height={26} fill="none">
              <path d="M8 22C8 14 14 8 22 8c0 8-6 14-14 14Z" fill="#3F4D26"/>
              <path d="M9 22c4-1 9-5 12-12" stroke="#9A4A2A" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="1.6" fill="#9A4A2A"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 22, lineHeight: 1 }}>Agromed</div>
            <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.08em' }}>AGM · GESTÃO AGRÍCOLA</div>
          </div>
        </div>

        {/* Hero */}
        <div style={{ marginTop: 80 }}>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 38, lineHeight: 1.05, fontWeight: 400 }}>
            Bom dia,<br/>
            <em style={{ color: '#DEE5C8', fontStyle: 'italic' }}>Aderbal.</em>
          </div>
          <div style={{ fontSize: 14, opacity: 0.65, marginTop: 10, lineHeight: 1.5 }}>
            Tudo certo para registrar a OS de hoje. Esta versão funciona offline.
          </div>
        </div>

        {/* Form */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          <div style={inpDark()}>
            <I.User size={18} sw={1.8} />
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="Usuário"
                   style={inpDarkInner} />
          </div>
          <div style={inpDark()}>
            <I.Lock size={18} sw={1.8} />
            <input value={pwd} onChange={e => setPwd(e.target.value)} type={showPwd ? 'text' : 'password'}
                   placeholder="Senha" style={inpDarkInner} />
            <button onClick={() => setShowPwd(!showPwd)} style={iconLink}>
              <I.Eye size={18} sw={1.8} />
            </button>
          </div>

          {/* Keep me logged in */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px',
                          fontSize: 13, color: 'var(--ink-on-dark-2)', cursor: 'pointer' }}>
            <span onClick={() => setKeep(!keep)}
                  style={{ width: 20, height: 20, borderRadius: 6, border: '1.5px solid #BFB29A',
                          background: keep ? '#9A4A2A' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {keep && <I.Check size={14} sw={3} stroke="#FBF7EC" />}
            </span>
            Permanecer conectado neste aparelho
          </label>

          <button className="btn primary full" style={{ background: '#9A4A2A', marginTop: 8 }}
                  onClick={onLogin}>
            Entrar
            <I.Back size={18} style={{ transform: 'rotate(180deg)' }} sw={2.2}/>
          </button>

          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-on-dark-2)', marginTop: 4 }}>
            v0.4.2 · sincronizado em 10/05 às 06:32
          </div>
        </div>
      </div>
      <div className="gesturebar dark"><div className="pill" /></div>
    </div>
  );
}
const inpDark = () => ({
  display: 'flex', alignItems: 'center', gap: 10,
  height: 56, padding: '0 16px',
  background: 'rgba(255,255,255,0.08)',
  border: '1.5px solid rgba(255,255,255,0.14)',
  borderRadius: 14,
  color: '#DEE5C8',
});
const inpDarkInner = {
  flex: 1, background: 'transparent', border: 0, outline: 0,
  color: '#FBF7EC', fontFamily: 'var(--f-sans)', fontSize: 16, padding: 0,
};
const iconLink = { background: 'transparent', border: 0, color: '#BFB29A', cursor: 'pointer', padding: 4 };

// ─────────────────────────────────────────────────────────────
// Farm select
// ─────────────────────────────────────────────────────────────
function ScreenFarmSelect({ onPick, conn, queueLen }) {
  return (
    <>
      <AppBar large title={<>Selecione a <em>fazenda</em></>} eyebrow="Acesso multi-unidade"
              conn={conn} queueLen={queueLen} />
      <div className="screen-body">
        <div style={{ padding: '0 16px 12px', fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
          Apontamentos serão registrados na fazenda ativa. Você pode trocar a qualquer momento em <b style={{ color: 'var(--ink-2)' }}>Mais → Perfil</b>.
        </div>
        <div className="card-stack">
          {AGM_DATA.FAZENDAS.map(f => (
            <div key={f.id} className="card tappable" onClick={() => onPick(f.id)}
                 style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14,
                            background: 'var(--olive-100)', color: 'var(--olive-700)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700,
                            letterSpacing: '0.04em' }}>
                {f.id}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--f-serif)' }}>{f.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                  {f.cidade} · {f.hectares.toLocaleString('pt-BR')} ha · {f.op} OS hoje
                </div>
              </div>
              <I.Back size={20} stroke="var(--ink-3)" style={{ transform: 'rotate(180deg)' }} />
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 16px', fontSize: 12, color: 'var(--ink-3)' }}>
          5 fazendas em Mato Grosso · cache local de 1 a 3 meses
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Operator dashboard
// ─────────────────────────────────────────────────────────────
function ScreenDashboard({ conn, queueLen, fazenda, navigate, currentOS, onOpenSync }) {
  const fazendaObj = AGM_DATA.FAZENDAS.find(f => f.id === fazenda);
  const today = new Date();
  const dateLabel = today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <>
      <div className="appbar" style={{ paddingTop: 4 }}>
        <BrandMark size={32} />
        <div style={{ flex: 1, marginLeft: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {fazendaObj?.nome} · {fazenda}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--f-serif)' }}>Aderbal de Souza</div>
        </div>
        <ConnChip state={conn} queueLen={queueLen} />
        <button className="iconbtn" aria-label="Notificações" style={{ position: 'relative' }}>
          <I.Bell size={22} />
          <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                         borderRadius: 4, background: 'var(--clay-500)', border: '2px solid var(--bg-app)' }} />
        </button>
      </div>

      <div className="screen-body">
        <OfflineBanner conn={conn} queueLen={queueLen} syncProgress={0.42} onTap={onOpenSync} />

        {/* Greeting */}
        <div style={{ padding: '4px 16px 18px' }}>
          <h1 style={{ fontFamily: 'var(--f-serif)', fontWeight: 400, fontSize: 30,
                       margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Bom dia, <em style={{ color: 'var(--olive-700)', fontStyle: 'italic' }}>Aderbal</em>.
          </h1>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6,
                        textTransform: 'capitalize' }}>
            {dateLabel}
          </div>
        </div>

        {/* Continue OS card */}
        <div style={{ padding: '0 16px' }}>
          <div className="card tappable" onClick={() => navigate('os-detail', { osId: 'OS-3127' })}
               style={{ background: 'linear-gradient(135deg, #3F4D26 0%, #2D341B 100%)',
                       color: 'var(--ink-on-dark)', border: 0, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <I.Play size={14} sw={2.4} fill="currentColor" />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  OS em execução
                </span>
              </div>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, opacity: 0.7 }}>OS-3127</span>
            </div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 26, lineHeight: 1.1, fontWeight: 400 }}>
              {currentOS.servico}<br/>
              <span style={{ opacity: 0.7 }}>{currentOS.maquinaNome}</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <Stat label="Talhão" value={currentOS.talhao} dark />
              <Stat label="Horímetro" value={currentOS.hrAtu.toFixed(1)} dark />
              <Stat label="Horas hoje" value={currentOS.hrsDia + ' h'} dark />
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>Toque para registrar horas e encerrar</span>
              <I.Back size={18} style={{ transform: 'rotate(180deg)' }} stroke="#DEE5C8" />
            </div>
          </div>
        </div>

        {/* Quick actions grid */}
        <div className="section-title">Ações rápidas</div>
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <QuickAction label="Abastecer agora" sub="Bomba AGM-01" icon={I.Fuel}
                       color="clay" onClick={() => navigate('fuel-form')} />
          <QuickAction label="Nova OS" sub="Wizard 4 passos" icon={I.Plus}
                       color="olive" onClick={() => navigate('os-wizard')} />
          <QuickAction label="Minhas OS" sub="5 ativas" icon={I.Wrench}
                       color="sand" onClick={() => navigate('os-list')} />
          <QuickAction label="Saldo bombas" sub="AGM · Agrium" icon={I.Drop}
                       color="info" onClick={() => navigate('fuel-balance')} />
        </div>

        {/* Today list */}
        <div className="section-title">
          Minhas OS de hoje
          <a onClick={() => navigate('os-list')}>Ver todas</a>
        </div>
        <div className="card-stack">
          <OSCardCompact os={AGM_DATA.OS_LIST[0]} onClick={() => navigate('os-detail', { osId: AGM_DATA.OS_LIST[0].id })} />
          <OSCardCompact os={AGM_DATA.OS_LIST[1]} onClick={() => navigate('os-detail', { osId: AGM_DATA.OS_LIST[1].id })} />
        </div>

        {/* Maintenance alert */}
        <div className="section-title">Atenção</div>
        <div className="card-stack">
          <div className="card attn" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--st-warning-bg)',
                          color: 'var(--st-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.Warning size={20} sw={2}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Troca de óleo TR-04 em 22 h</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Próxima janela: 11/05 manhã</div>
            </div>
            <Badge status="warning">Atenção</Badge>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, dark }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    opacity: dark ? 0.55 : 0.6,
                    color: dark ? 'var(--ink-on-dark-2)' : 'var(--ink-3)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 18, fontWeight: 500, marginTop: 2,
                    color: dark ? 'var(--ink-on-dark)' : 'var(--ink-1)',
                    fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function QuickAction({ label, sub, icon: Ic, color, onClick }) {
  const colors = {
    olive: { bg: 'var(--olive-100)', fg: 'var(--olive-700)' },
    clay:  { bg: 'var(--clay-50)',   fg: 'var(--clay-700)' },
    sand:  { bg: 'var(--sand-100)',  fg: 'var(--sand-700)' },
    info:  { bg: 'var(--st-info-bg)',fg: 'var(--st-info)' },
  }[color] || { bg: 'var(--olive-100)', fg: 'var(--olive-700)' };
  return (
    <button onClick={onClick} className="card tappable" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      gap: 18, padding: 14, textAlign: 'left', cursor: 'pointer',
      background: 'var(--bg-elev)', border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)', minHeight: 110,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.bg, color: colors.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Ic size={20} sw={2} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)', lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{sub}</div>
      </div>
    </button>
  );
}

function OSCardCompact({ os, onClick }) {
  return (
    <div className="card tappable os-card" onClick={onClick}>
      <div className="head">
        <span className="id">{os.id}</span>
        <Badge status={os.status} />
      </div>
      <div className="machine">
        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--olive-100)', color: 'var(--olive-700)',
                       display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I.Tractor size={16} sw={1.8}/>
        </span>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {os.maquinaNome}
        </span>
      </div>
      <div className="service">{os.servico} · talhão {os.talhao}</div>
      <div className="meta">
        <span><b>{os.data}</b></span>
        <span>{os.hrsDia + os.hrsNot}h registradas</span>
        <span>Hor. {os.hrAtu?.toFixed(1) ?? '—'}</span>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenLogin, ScreenFarmSelect, ScreenDashboard, OSCardCompact });
