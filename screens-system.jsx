// screens-system.jsx — Sync queue, LWW conflict screen, More drawer

const { useState: useStateS } = React;

// ─────────────────────────────────────────────────────────────
// SYNC QUEUE — fila de itens pendentes
// ─────────────────────────────────────────────────────────────
function ScreenSyncQueue({ conn, queueLen, queue, navigate, syncProgress, onForceSync }) {
  const queuedTitle = queueLen === 0 ? 'Tudo sincronizado' : `${queueLen} ${queueLen === 1 ? 'item pendente' : 'itens pendentes'}`;

  return (
    <>
      <AppBar large title={<>Fila de <em>sincronização</em></>} eyebrow="Cache local · 1–3 meses"
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />

      <div className="screen-body">
        <div style={{ padding: '0 16px 14px' }}>
          <div className="card" style={{
            background: conn === 'offline' ? 'var(--st-warning-bg)' :
                       conn === 'syncing'  ? 'var(--st-info-bg)' :
                       'var(--st-success-bg)',
            border: 0, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {conn === 'offline' && <I.CloudOff size={20} stroke="var(--st-warning)" sw={2}/>}
              {conn === 'syncing' && <I.Refresh size={20} stroke="var(--st-info)" sw={2} style={{ animation: 'spin 1.4s linear infinite' }}/>}
              {conn === 'online'  && <I.Cloud size={20} stroke="var(--st-success)" sw={2}/>}
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                              color: conn === 'offline' ? 'var(--st-warning)' :
                                     conn === 'syncing' ? 'var(--st-info)' : 'var(--st-success)' }}>
                {conn === 'offline' ? 'Sem conexão' : conn === 'syncing' ? 'Sincronizando' : 'Online'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 24, marginTop: 8,
                          color: 'var(--ink-1)' }}>
              {queuedTitle}
            </div>
            {conn === 'syncing' && (
              <>
                <div style={{ marginTop: 14, height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--st-info)',
                                width: (syncProgress * 100) + '%', transition: 'width .4s' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12,
                              color: 'var(--st-info)', marginTop: 6 }}>
                  <span>{Math.round(syncProgress * 100)}%</span>
                  <span>{Math.max(0, queueLen - Math.floor(syncProgress * queueLen))} restantes</span>
                </div>
              </>
            )}
            {conn === 'offline' && queueLen > 0 && (
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.5 }}>
                Itens serão enviados automaticamente quando a rede voltar. Pode trabalhar normalmente.
              </div>
            )}
          </div>
        </div>

        <div className="section-title">
          Fila ({queueLen})
          {conn === 'online' && queueLen > 0 && (
            <a onClick={onForceSync}>Sincronizar agora</a>
          )}
        </div>

        {queueLen === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--ink-3)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--olive-100)',
                          color: 'var(--olive-700)', display: 'inline-flex', alignItems: 'center',
                          justifyContent: 'center', marginBottom: 12 }}>
              <I.Check size={26} sw={2.4}/>
            </div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 20, color: 'var(--ink-1)' }}>Tudo em dia</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Última sync: 10/05 13:42</div>
          </div>
        ) : (
          <div className="card-stack">
            {queue.map((q, i) => {
              const Ic = q.kind === 'OS' ? I.Wrench : q.kind === 'Abastec.' ? I.Fuel : I.Camera;
              const isProcessing = conn === 'syncing' && i < Math.floor(syncProgress * queue.length);
              return (
                <div key={q.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center',
                              opacity: isProcessing ? 0.5 : 1 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12,
                                background: 'var(--olive-100)', color: 'var(--olive-700)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Ic size={20}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 700,
                                     color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{q.kind}</span>
                      <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>· {q.size}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{q.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{q.sub} · enfileirado {q.ts}</div>
                  </div>
                  {isProcessing
                    ? <I.Refresh size={18} stroke="var(--st-info)" sw={2} style={{ animation: 'spin 1.4s linear infinite' }}/>
                    : <I.Clock size={16} stroke="var(--ink-3)" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Conflict alert (LWW) */}
        <div className="section-title">Divergência detectada</div>
        <div style={{ padding: '0 16px' }}>
          <div className="card tappable attn" onClick={() => navigate('conflict')}
               style={{ borderColor: 'var(--st-danger)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--st-danger-bg)',
                          color: 'var(--st-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.Warning size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>OS-3115 · gerente alterou no servidor</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Política: Last-Write-Wins · revisar antes de aplicar</div>
            </div>
            <Badge status="danger">Resolver</Badge>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// CONFLICT — Last-Write-Wins resolution
// ─────────────────────────────────────────────────────────────
function ScreenConflict({ conn, queueLen, navigate, onResolve }) {
  const [choice, setChoice] = useStateS(null); // 'server' | 'local'

  const local = {
    by: 'Aderbal de Souza (você)',
    when: '10/05 11:42 · offline',
    hrsDia: 8.7, hrsNot: 5.0, obs: 'Solo úmido na ponta sul.', talhao: 'MV-04',
  };
  const server = {
    by: 'João Marcos (gerente)',
    when: '10/05 13:18 · servidor',
    hrsDia: 8.0, hrsNot: 4.0, obs: 'Ajuste de horas: jornada máxima excedida.', talhao: 'MV-04',
  };

  return (
    <>
      <AppBar title="Resolver divergência" eyebrow="OS-3115 · LWW"
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />
      <div className="screen-body">
        <div style={{ padding: '4px 16px 14px' }}>
          <div style={{ padding: 14, background: 'var(--st-danger-bg)', borderRadius: 12,
                        color: 'var(--clay-900)', display: 'flex', gap: 10 }}>
            <I.Warning size={18} sw={2.2} stroke="var(--st-danger)" />
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              <b>Mesma OS editada nas duas pontas.</b> Last-Write-Wins venceu pelo servidor (13:18 &gt; 11:42), mas você pode revisar e reabrir antes de aceitar.
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ConflictOption
            title="Versão do servidor"
            subtitle={server.by + ' · ' + server.when}
            data={server} winner
            selected={choice === 'server'} onSelect={() => setChoice('server')} />
          <ConflictOption
            title="Sua versão local"
            subtitle={local.by + ' · ' + local.when}
            data={local}
            selected={choice === 'local'} onSelect={() => setChoice('local')} />
        </div>

        <div style={{ padding: '20px 16px 4px' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
            <I.Spark size={12} sw={2} stroke="var(--olive-500)"/> "Manter local" reabrirá a OS para o gerente como contestada, com auditoria.
          </div>
        </div>
      </div>

      <div className="btn-bar">
        <button className="btn outline" style={{ flex: '0 0 auto' }} onClick={() => navigate(-1)}>Depois</button>
        <button className="btn primary" disabled={!choice} onClick={() => { onResolve(choice); navigate('sync-queue'); }}>
          {choice === 'server' ? 'Aceitar servidor' : choice === 'local' ? 'Manter local + contestar' : 'Selecione uma versão'}
        </button>
      </div>
    </>
  );
}

function ConflictOption({ title, subtitle, data, winner, selected, onSelect }) {
  return (
    <div onClick={onSelect} className="card tappable" style={{
      border: '2px solid ' + (selected ? 'var(--olive-700)' : 'var(--line)'),
      background: selected ? 'var(--olive-50)' : 'var(--bg-elev)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%',
                         border: '2px solid ' + (selected ? 'var(--olive-700)' : 'var(--ink-4)'),
                         display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selected && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--olive-700)' }}/>}
          </span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{subtitle}</div>
          </div>
        </div>
        {winner && <Badge status="success">LWW</Badge>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        <Metric small label="Hrs/Diar" v={data.hrsDia + ' h'} />
        <Metric small label="HNot" v={data.hrsNot + ' h'} />
        <Metric small label="Talhão" v={data.talhao} />
      </div>
      <div style={{ marginTop: 10, fontFamily: 'var(--f-mono)', fontSize: 11,
                    background: 'var(--bg-sunk)', padding: 8, borderRadius: 8, color: 'var(--ink-2)' }}>
        “{data.obs}”
      </div>
    </div>
  );
}
function Metric({ label, v, small }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: 'var(--ink-3)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: small ? 16 : 18, fontWeight: 500, marginTop: 2 }}>{v}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MORE DRAWER
// ─────────────────────────────────────────────────────────────
function ScreenMore({ conn, queueLen, navigate, fazenda, onLogout, onOpenSync }) {
  const fazendaObj = AGM_DATA.FAZENDAS.find(f => f.id === fazenda);
  return (
    <>
      <AppBar large title={<>Mais</>} eyebrow="Cadastros · perfil · sync"
              conn={conn} queueLen={queueLen} />
      <div className="screen-body">
        {/* Profile card */}
        <div style={{ padding: '0 16px 14px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--olive-700)', color: '#FBF7EC',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--f-serif)', fontSize: 24 }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--f-serif)' }}>Aderbal de Souza</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Tratorista · {fazendaObj?.nome}</div>
            </div>
            <button className="iconbtn" onClick={onLogout}>
              <I.Logout size={20}/>
            </button>
          </div>
        </div>

        <div className="section-title">Sistema</div>
        <DrawerRow icon={I.Cloud} label="Sincronização"
                   sub={conn === 'offline' ? `${queueLen} itens na fila` : 'Tudo sincronizado'}
                   right={<Badge status={conn === 'offline' ? 'warning' : 'success'}>
                     {conn === 'offline' ? 'Offline' : 'Online'}</Badge>}
                   onClick={onOpenSync} />
        <DrawerRow icon={I.Refresh} label="Conflitos pendentes" sub="1 OS aguardando revisão"
                   right={<Badge status="danger">1</Badge>}
                   onClick={() => navigate('conflict')} />

        <div className="section-title">Cadastros mestres</div>
        <DrawerRow icon={I.Tractor} label="Máquinas" sub="142 cadastradas · 5 fazendas"
                   onClick={() => navigate('cad-maquinas')} />
        <DrawerRow icon={I.User} label="Funcionários" sub="CPF mascarado · LGPD"
                   onClick={() => navigate('cad-funcionarios')} />
        <DrawerRow icon={I.Map} label="Fazendas e talhões" sub="5 · 17.660 ha" />
        <DrawerRow icon={I.Sheaf} label="Serviços" sub="6 ativos" />

        <div className="section-title">Outros</div>
        <DrawerRow icon={I.Doc} label="Relatórios" sub="Excel · PDF · share nativo"
                   onClick={() => navigate('relatorios')} />
        <DrawerRow icon={I.Cog} label="Configurações" sub="Tema, push, idioma" />

        <div style={{ padding: '24px 16px 16px', fontSize: 11, color: 'var(--ink-4)', textAlign: 'center',
                      letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--f-mono)' }}>
          Agromed AGM v0.4.2 · build 1283
        </div>
      </div>
    </>
  );
}

function DrawerRow({ icon: Ic, label, sub, right, onClick }) {
  return (
    <div className="select-row" onClick={onClick} style={{ margin: '0 16px 8px', height: 64 }}>
      <div className="ico"><Ic size={18}/></div>
      <div className="text">
        <div className="val" style={{ fontSize: 15 }}>{label}</div>
        <div className="lbl" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>{sub}</div>
      </div>
      {right || <I.Back size={18} stroke="var(--ink-3)" style={{ transform: 'rotate(180deg)' }} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CADASTROS — Máquinas (read-only para operador)
// ─────────────────────────────────────────────────────────────
function ScreenCadMaquinas({ conn, queueLen, navigate }) {
  return (
    <>
      <AppBar title="Máquinas" eyebrow="Cadastro · somente leitura"
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />
      <div className="screen-body">
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ position: 'relative' }}>
            <I.Search size={18} stroke="var(--ink-3)" style={{ position: 'absolute', left: 14, top: 17 }}/>
            <input className="input" placeholder="Buscar TR-04, JD 6135J…"
                   style={{ paddingLeft: 42, fontSize: 15 }}/>
          </div>
        </div>

        <div className="card-stack">
          {AGM_DATA.MAQUINAS.map(m => (
            <div key={m.id} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12,
                            background: m.status === 'manut' ? 'var(--st-danger-bg)' : 'var(--olive-100)',
                            color: m.status === 'manut' ? 'var(--st-danger)' : 'var(--olive-700)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0 }}>
                {m.tipo === 'Implem.' ? <I.Cog size={20}/> :
                 m.tipo === 'Pulver.' ? <I.Drop size={20}/> :
                 <I.Tractor size={20}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, fontWeight: 700,
                                 color: 'var(--ink-2)' }}>{m.id}</span>
                  <Badge status={m.status} kind="maq"/>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{m.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                  {m.hor > 0 ? `${m.hor.toFixed(1)} h` : 'Sem horímetro'}
                  {m.oleo_em != null && (m.oleo_em < 0
                    ? <> · <span style={{ color: 'var(--st-danger)', fontWeight: 600 }}>óleo vencido {Math.abs(m.oleo_em)}h</span></>
                    : m.oleo_em < 50
                    ? <> · <span style={{ color: 'var(--st-warning)', fontWeight: 600 }}>óleo em {m.oleo_em}h</span></>
                    : <> · óleo em {m.oleo_em}h</>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// REPORTS — filters + export share
// ─────────────────────────────────────────────────────────────
function ScreenRelatorios({ conn, queueLen, navigate }) {
  return (
    <>
      <AppBar large title={<>Relatórios</>} eyebrow="Exportar Excel · PDF"
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />
      <div className="screen-body">
        <div className="section-title">Modelos</div>
        <div className="card-stack">
          {[
            { t: 'Folha mensal de OS',     s: 'Operadores × horas · maio',     ico: I.Doc },
            { t: 'Consumo de diesel',      s: 'Por máquina · 30 dias',          ico: I.Fuel },
            { t: 'Manutenções preventivas', s: 'Vencidas e próximas',           ico: I.Wrench },
            { t: 'Custo por talhão',       s: 'Hrs + insumos + abastec.',      ico: I.Map },
          ].map(r => {
            const Ic = r.ico;
            return (
              <div key={r.t} className="card tappable" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--olive-100)',
                              color: 'var(--olive-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ic size={20}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{r.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.s}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 700,
                                 padding: '4px 8px', borderRadius: 6, background: 'var(--bg-sunk)',
                                 color: 'var(--ink-2)', letterSpacing: '0.06em' }}>XLS</span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, fontWeight: 700,
                                 padding: '4px 8px', borderRadius: 6, background: 'var(--bg-sunk)',
                                 color: 'var(--ink-2)', letterSpacing: '0.06em' }}>PDF</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="section-title">Filtros</div>
        <div style={{ padding: '0 16px' }}>
          <div className="card" style={{ padding: 0 }}>
            <ReviewRowR label="Período"  value="01/05/2026 – 10/05/2026" />
            <ReviewRowR label="Fazenda"  value="Mata Verde (MV)" />
            <ReviewRowR label="Operador" value="Todos" />
            <ReviewRowR label="Serviço"  value="Todos" last />
          </div>
        </div>
      </div>
      <div className="btn-bar">
        <button className="btn primary full">
          <I.Doc size={18}/> Exportar e compartilhar
        </button>
      </div>
    </>
  );
}
function ReviewRowR({ label, value, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                  borderBottom: last ? 0 : '1px solid var(--line)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
      <I.Calendar size={18} stroke="var(--ink-3)" />
    </div>
  );
}

Object.assign(window, {
  ScreenSyncQueue, ScreenConflict, ScreenMore, ScreenCadMaquinas, ScreenRelatorios,
});
