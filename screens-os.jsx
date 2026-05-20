// screens-os.jsx — OS Interna list, wizard, detail/execution, closing

const { useState: useStateOS, useMemo: useMemoOS } = React;

// ─────────────────────────────────────────────────────────────
// OS LIST
// ─────────────────────────────────────────────────────────────
function ScreenOSList({ conn, queueLen, navigate, onOpenSync }) {
  const [filter, setFilter] = useStateOS('todas'); // todas | execucao | aprovada | concluida
  const [filterOpen, setFilterOpen] = useStateOS(false);

  const list = AGM_DATA.OS_LIST.filter(os =>
    filter === 'todas' ? true : os.status === filter);

  return (
    <>
      <AppBar large title={<>Ordens de <em>Serviço</em></>} eyebrow="OS Interna · Aderbal"
              conn={conn} queueLen={queueLen}
              action={<button className="iconbtn" onClick={() => setFilterOpen(true)}><I.Filter size={20}/></button>} />
      <div className="screen-body">
        <OfflineBanner conn={conn} queueLen={queueLen} onTap={onOpenSync} />

        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'todas',     label: 'Todas',        n: AGM_DATA.OS_LIST.length },
            { id: 'execucao',  label: 'Em execução',  n: AGM_DATA.OS_LIST.filter(o => o.status === 'execucao').length },
            { id: 'aprovada',  label: 'Aprovadas',    n: AGM_DATA.OS_LIST.filter(o => o.status === 'aprovada').length },
            { id: 'concluida', label: 'Concluídas',   n: AGM_DATA.OS_LIST.filter(o => o.status === 'concluida').length },
          ].map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)}
                    style={chipBtn(filter === c.id)}>
              {c.label} <span style={{ opacity: 0.7, marginLeft: 4 }}>{c.n}</span>
            </button>
          ))}
        </div>

        <div className="card-stack">
          {list.map(os => (
            <OSCardCompact key={os.id} os={os}
                           onClick={() => navigate('os-detail', { osId: os.id })} />
          ))}
          {list.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-3)' }}>
              Nenhuma OS neste filtro.
            </div>
          )}
        </div>
      </div>

      <FAB icon={I.Plus} extended label="Nova OS" onClick={() => navigate('os-wizard')} />

      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filtrar OS">
        <div style={{ padding: '4px 20px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-3)',
                        textTransform: 'uppercase', marginBottom: 10 }}>Status</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(AGM_DATA.STATUS_OS).map(([k, v]) => (
              <button key={k} style={chipBtn(false)}>{v.label}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink-3)',
                        textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>Período</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Hoje', 'Esta semana', 'Maio', 'Tudo'].map(p => (
              <button key={p} style={chipBtn(p === 'Hoje')}>{p}</button>
            ))}
          </div>
          <button className="btn primary full" style={{ marginTop: 24 }}
                  onClick={() => setFilterOpen(false)}>Aplicar filtros</button>
        </div>
      </BottomSheet>
    </>
  );
}

const chipBtn = (active) => ({
  padding: '8px 14px', borderRadius: 100,
  background: active ? 'var(--olive-700)' : 'var(--bg-elev)',
  color: active ? '#FBF7EC' : 'var(--ink-2)',
  border: '1px solid ' + (active ? 'var(--olive-700)' : 'var(--line-strong)'),
  fontFamily: 'var(--f-sans)', fontSize: 13, fontWeight: 600,
  cursor: 'pointer',
});

// ─────────────────────────────────────────────────────────────
// OS WIZARD — 4 passos (Quem/Onde → Serviço → Hor. inicial → Confirmação)
// ─────────────────────────────────────────────────────────────
function ScreenOSWizard({ conn, queueLen, navigate, onCommit, onOpenSync }) {
  const [step, setStep] = useStateOS(0);
  const [d, setD] = useStateOS({
    fazenda: 'MV', operador: 'op1', maquina: '', implemento: '',
    servico: '', talhao: '', hrIni: '', data: '10/05/2026',
    chuva: false,
  });
  const [pickerOpen, setPickerOpen] = useStateOS(null); // 'maquina' | 'implemento' | 'servico' | 'talhao'

  const update = (patch) => setD(prev => ({ ...prev, ...patch }));

  const stepValid = [
    d.fazenda && d.operador && d.maquina && d.implemento,
    d.servico && d.talhao,
    d.chuva || (d.hrIni && parseFloat(d.hrIni) > 0),
    true,
  ];

  const next = () => {
    if (step < 3) setStep(step + 1);
    else { onCommit(d); navigate('os-success'); }
  };
  const back = () => step > 0 ? setStep(step - 1) : navigate(-1);

  // Talhao validation per fazenda
  const tRange = AGM_DATA.TALHOES_RANGES[d.fazenda] || [1, 50];
  const validTalhao = (t) => {
    const m = String(t).match(/(\d+)/);
    if (!m) return false;
    const n = parseInt(m[1]);
    return n >= tRange[0] && n <= tRange[1];
  };

  return (
    <>
      <AppBar title={`Nova OS — Passo ${step + 1} de 4`} eyebrow="OS Interna"
              conn={conn} queueLen={queueLen} onBack={back} />

      <div className="stepper">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={'step' + (i === step ? ' active' : i < step ? ' done' : '')} />
        ))}
      </div>
      <div className="stepper-meta">
        <span>{['Quem & Onde','Serviço & Talhão','Horímetro inicial','Revisão'][step]}</span>
        <span>{step + 1}/4</span>
      </div>

      <div className="screen-body" style={{ paddingTop: 8 }}>
        {step === 0 && (
          <>
            <SelectRow label="Fazenda" value={AGM_DATA.FAZENDAS.find(f => f.id === d.fazenda)?.nome}
                       sub={d.fazenda} icon={I.Map} onClick={() => setPickerOpen('fazenda')} />
            <div style={{ height: 12 }} />
            <SelectRow label="Operador" value={AGM_DATA.OPERADORES.find(o => o.id === d.operador)?.nome}
                       sub={AGM_DATA.OPERADORES.find(o => o.id === d.operador)?.funcao}
                       icon={I.User} onClick={() => setPickerOpen('operador')} />
            <div style={{ height: 12 }} />
            <SelectRow label="Máquina" value={d.maquina ? AGM_DATA.MAQUINAS.find(m => m.id === d.maquina)?.nome : ''}
                       sub={d.maquina || 'Selecione'} icon={I.Tractor}
                       onClick={() => setPickerOpen('maquina')}
                       placeholder="Selecione a máquina" />
            <div style={{ height: 12 }} />
            <SelectRow label="Implemento" value={d.implemento ? AGM_DATA.MAQUINAS.find(m => m.id === d.implemento)?.nome : ''}
                       sub={d.implemento || (d.maquina ? 'Selecione' : 'Escolha máquina antes')}
                       icon={I.Cog} onClick={() => d.maquina && setPickerOpen('implemento')}
                       disabled={!d.maquina} />
            <div style={{ padding: '14px 16px', fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              <I.Spark size={12} sw={2} stroke="var(--olive-500)" /> Cascata obrigatória: Fazenda → Operador → Máquina → Implemento.
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <SelectRow label="Serviço" value={d.servico ? AGM_DATA.SERVICOS.find(s => s.id === d.servico)?.nome : ''}
                       sub={d.servico || 'Selecione o serviço'}
                       icon={I.Wheat} onClick={() => setPickerOpen('servico')} />
            <div style={{ height: 12 }} />
            <div className="field">
              <label className="field-label">Talhão</label>
              <input className={'input' + (d.talhao && !validTalhao(d.talhao) ? ' error' : '')}
                     placeholder={`MV-${tRange[0]} a MV-${tRange[1]}`}
                     value={d.talhao} onChange={e => update({ talhao: e.target.value.toUpperCase() })} />
              {d.talhao && !validTalhao(d.talhao) && (
                <div className="field-error">
                  <I.Warning size={14} /> Talhão fora do intervalo da fazenda {d.fazenda} ({tRange[0]}–{tRange[1]}).
                </div>
              )}
              {(!d.talhao || validTalhao(d.talhao)) && (
                <div className="field-help">Validação por fazenda: {d.fazenda} aceita talhões {tRange[0]} a {tRange[1]}.</div>
              )}
            </div>
            <div style={{ height: 12 }} />
            <div className="field">
              <label className="field-label">Data</label>
              <input className="input" value={d.data} onChange={e => update({ data: e.target.value })} />
            </div>

            <div className="divider" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 16px',
                             cursor: 'pointer' }}
                   onClick={() => update({ chuva: !d.chuva })}>
              <span style={{ width: 22, height: 22, borderRadius: 6,
                             border: '1.5px solid var(--line-strong)',
                             background: d.chuva ? 'var(--clay-500)' : 'transparent',
                             display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {d.chuva && <I.Check size={14} sw={3} stroke="#FBF7EC" />}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Dia parado por chuva (&gt;30mm)</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Registra zero horas com motivo, validado pelo supervisor.</div>
              </div>
            </label>
          </>
        )}

        {step === 2 && (
          <HrIniStep d={d} update={update} />
        )}

        {step === 3 && (
          <ReviewStep d={d} setStep={setStep} />
        )}
      </div>

      <div className="btn-bar">
        <button className="btn outline" style={{ flex: '0 0 auto' }} onClick={back}>
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </button>
        <button className="btn primary" disabled={!stepValid[step]} onClick={next}>
          {step === 3 ? 'Confirmar e abrir OS' : 'Continuar'}
          {step !== 3 && <I.Back size={16} style={{ transform: 'rotate(180deg)' }}/>}
        </button>
      </div>

      {/* Pickers */}
      <PickerSheet
        open={pickerOpen === 'fazenda'} onClose={() => setPickerOpen(null)} title="Fazenda"
        items={AGM_DATA.FAZENDAS.map(f => ({ id: f.id, h: f.nome, s: f.id + ' · ' + f.cidade }))}
        onPick={id => { update({ fazenda: id, talhao: '' }); setPickerOpen(null); }}
        active={d.fazenda} />
      <PickerSheet
        open={pickerOpen === 'operador'} onClose={() => setPickerOpen(null)} title="Operador"
        items={AGM_DATA.OPERADORES.map(o => ({ id: o.id, h: o.nome, s: o.funcao + ' · CPF ' + o.cpf }))}
        onPick={id => { update({ operador: id }); setPickerOpen(null); }}
        active={d.operador} />
      <PickerSheet
        open={pickerOpen === 'maquina'} onClose={() => setPickerOpen(null)} title="Máquina"
        items={AGM_DATA.MAQUINAS.filter(m => m.tipo !== 'Implem.').map(m => ({
          id: m.id, h: `${m.id} · ${m.nome}`,
          s: m.status === 'manut' ? 'Em manutenção — indisponível' : `Horímetro ${m.hor.toFixed(1)} h`,
          disabled: m.status === 'manut',
        }))}
        onPick={id => { update({ maquina: id, implemento: '' }); setPickerOpen(null); }}
        active={d.maquina} />
      <PickerSheet
        open={pickerOpen === 'implemento'} onClose={() => setPickerOpen(null)} title="Implemento"
        items={AGM_DATA.MAQUINAS.filter(m => m.tipo === 'Implem.').map(m => ({
          id: m.id, h: `${m.id} · ${m.nome}`, s: 'Compatível com ' + d.maquina,
        }))}
        onPick={id => { update({ implemento: id }); setPickerOpen(null); }}
        active={d.implemento} />
      <PickerSheet
        open={pickerOpen === 'servico'} onClose={() => setPickerOpen(null)} title="Serviço"
        items={AGM_DATA.SERVICOS.map(s => ({ id: s.id, h: s.nome, s: 'Código ' + s.id }))}
        onPick={id => { update({ servico: id }); setPickerOpen(null); }}
        active={d.servico} />
    </>
  );
}

// Picker bottom sheet
function PickerSheet({ open, onClose, title, items, onPick, active }) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      {items.map(it => (
        <div key={it.id} className={'sheet-row' + (it.disabled ? ' disabled' : '')}
             onClick={() => !it.disabled && onPick(it.id)}>
          <div className="ico">{String(it.id).slice(0, 4)}</div>
          <div className="text">
            <div className="h">{it.h}</div>
            <div className="s">{it.s}</div>
          </div>
          {it.id === active && <I.Check size={20} stroke="var(--olive-700)" sw={2.4} />}
        </div>
      ))}
    </BottomSheet>
  );
}

function SelectRow({ label, value, sub, icon: Ic, onClick, disabled, placeholder }) {
  return (
    <div className={'select-row' + (disabled ? ' disabled' : '')} onClick={onClick} style={{ margin: '0 16px' }}>
      <div className="ico"><Ic size={18}/></div>
      <div className="text">
        <div className="lbl">{label}</div>
        <div className={'val' + (!value ? ' empty' : '')}>{value || placeholder || sub}</div>
      </div>
      <I.Back size={18} stroke="var(--ink-3)" style={{ transform: 'rotate(180deg)' }} />
    </div>
  );
}

// Step 3 — Horímetro inicial (numpad)
function HrIniStep({ d, update }) {
  const maquinaObj = AGM_DATA.MAQUINAS.find(m => m.id === d.maquina);
  const lastHor = maquinaObj?.hor ?? 0;
  const value = d.hrIni || '';
  const valNum = parseFloat(value || '0');
  const tooLow = value && valNum < lastHor;

  const press = (k) => {
    if (k === 'back') return update({ hrIni: value.slice(0, -1) });
    if (k === '.' && value.includes('.')) return;
    update({ hrIni: value + k });
  };

  return (
    <>
      <div style={{ padding: '4px 16px 0' }}>
        <div className="field-label">Horímetro inicial · {d.maquina || '—'}</div>
        <div className="numpad-display" style={{ background: tooLow ? 'var(--st-danger-bg)' : 'var(--bg-elev)',
                                                 border: '1.5px solid ' + (tooLow ? 'var(--st-danger)' : 'var(--line-strong)'),
                                                 borderRadius: 'var(--r-md)', marginTop: 8 }}>
          {value || <span style={{ color: 'var(--ink-4)' }}>0,0</span>}
          <span style={{ fontSize: 22, color: 'var(--ink-3)', marginLeft: 6 }}>h</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}>
          <span style={{ color: 'var(--ink-3)' }}>Último horímetro registrado:</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>{lastHor.toFixed(1)} h</span>
        </div>
        {tooLow && (
          <div className="field-error" style={{ marginTop: 8 }}>
            <I.Warning size={14} /> Horímetro não pode retroceder. Mínimo {lastHor.toFixed(1)} h.
          </div>
        )}
      </div>

      <div style={{ height: 18 }} />
      <div className="numpad">
        {['1','2','3','4','5','6','7','8','9','.','0','back'].map(k => (
          <button key={k} className={k === 'back' ? 'action' : ''} onClick={() => press(k)}>
            {k === 'back' ? '⌫' : k === '.' ? ',' : k}
          </button>
        ))}
      </div>
      <div style={{ padding: '12px 16px 0', fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
        <I.Spark size={12} sw={2} stroke="var(--olive-500)"/> RN02 — campo nunca aceita valor menor que o último registrado.
      </div>
    </>
  );
}

// Step 4 — Revisão
function ReviewStep({ d, setStep }) {
  const maq = AGM_DATA.MAQUINAS.find(m => m.id === d.maquina);
  const imp = AGM_DATA.MAQUINAS.find(m => m.id === d.implemento);
  const srv = AGM_DATA.SERVICOS.find(s => s.id === d.servico);
  const op = AGM_DATA.OPERADORES.find(o => o.id === d.operador);
  return (
    <div style={{ padding: '0 16px' }}>
      <div className="card" style={{ padding: 0 }}>
        <ReviewRow label="Fazenda"   value={`${AGM_DATA.FAZENDAS.find(f => f.id === d.fazenda)?.nome} (${d.fazenda})`} onEdit={() => setStep(0)} />
        <ReviewRow label="Operador"  value={op?.nome} onEdit={() => setStep(0)} />
        <ReviewRow label="Máquina"   value={`${d.maquina} · ${maq?.nome}`} onEdit={() => setStep(0)} />
        <ReviewRow label="Implemento" value={`${d.implemento} · ${imp?.nome}`} onEdit={() => setStep(0)} />
        <ReviewRow label="Serviço"   value={srv?.nome} onEdit={() => setStep(1)} />
        <ReviewRow label="Talhão"    value={d.talhao} onEdit={() => setStep(1)} />
        <ReviewRow label="Data"      value={d.data} onEdit={() => setStep(1)} />
        <ReviewRow label="Hor. inicial" value={d.chuva ? 'Sem registro (chuva >30mm)' : (d.hrIni + ' h')} onEdit={() => setStep(2)} last />
      </div>
      <div style={{ marginTop: 14, padding: 14, background: 'var(--olive-50)', borderRadius: 12,
                    border: '1px solid var(--olive-200)', fontSize: 13, color: 'var(--olive-900)',
                    display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <I.Spark size={16} sw={2} stroke="var(--olive-700)" />
        <div>
          OS será emitida com auto-save local a cada campo. Encerramento exige horímetro final + assinatura.
        </div>
      </div>
    </div>
  );
}
function ReviewRow({ label, value, onEdit, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
                  borderBottom: last ? 0 : '1px solid var(--line)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
      <button onClick={onEdit} style={{ background: 'transparent', border: 0, color: 'var(--olive-700)',
                                        fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Editar</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OS DETAIL / EXECUTION
// ─────────────────────────────────────────────────────────────
function ScreenOSDetail({ conn, queueLen, navigate, osId, currentOS, onUpdateOS, onOpenSync }) {
  const [tab, setTab] = useStateOS('execucao');
  const os = osId === 'OS-3127' ? currentOS : AGM_DATA.OS_LIST.find(o => o.id === osId);
  if (!os) return null;

  const isCurrent = os.id === 'OS-3127';
  const editable = isCurrent && os.status === 'execucao';

  return (
    <>
      <AppBar title={os.id} eyebrow={`OS Interna · ${os.fazenda}`}
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />
      <div className="screen-body">
        <OfflineBanner conn={conn} queueLen={queueLen} onTap={onOpenSync} />

        {/* Hero */}
        <div style={{ padding: '0 16px 16px' }}>
          <div className="card" style={{ background: 'var(--bg-elev)', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Badge status={os.status} />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                {os.data} · talhão {os.talhao}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 400,
                          marginTop: 12, lineHeight: 1.15 }}>
              {os.servico} <span style={{ color: 'var(--ink-3)' }}>·</span> {os.maquinaNome}
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 16 }}>
              <Stat label="Hor. inicial" value={os.hrIni?.toFixed(1) ?? '—'} />
              <Stat label="Hor. atual"   value={os.hrAtu?.toFixed(1) ?? '—'} />
              <Stat label="Total"        value={(os.hrsDia + os.hrsNot).toFixed(1) + ' h'} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={tab === 'execucao' ? 'active' : ''} onClick={() => setTab('execucao')}>Execução</button>
          <button className={tab === 'insumos' ? 'active' : ''}  onClick={() => setTab('insumos')}>Insumos</button>
          <button className={tab === 'historico' ? 'active' : ''} onClick={() => setTab('historico')}>Histórico</button>
        </div>

        {tab === 'execucao' && (
          <>
            <div style={{ padding: '0 16px 4px', fontSize: 12, color: 'var(--ink-3)' }}>
              Auto-save local a cada campo · {conn === 'offline' ? 'fila de sincronização' : 'sincronizado'}
            </div>
            <div style={{ height: 8 }} />
            <FieldNum label="Horas diurnas (Hrs/Diar)" value={os.hrsDia} suffix="h"
                      editable={editable}
                      onChange={v => onUpdateOS({ hrsDia: v })} />
            <FieldNum label="Horas noturnas (HNot)" value={os.hrsNot} suffix="h"
                      editable={editable}
                      onChange={v => onUpdateOS({ hrsNot: v })} />
            <FieldText label="Observações" value={os.obs}
                       editable={editable}
                       onChange={v => onUpdateOS({ obs: v })} />

            {os.status === 'contestada' && (
              <div style={{ margin: '14px 16px', padding: 14, background: 'var(--st-danger-bg)',
                            borderRadius: 12, color: 'var(--st-danger)',
                            display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <I.Warning size={18} sw={2.2} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Gerente solicitou ajuste de horas</div>
                  <div style={{ fontSize: 12, marginTop: 4, color: 'var(--clay-900)', opacity: 0.9 }}>
                    Justificativa: "Horímetro 9h diurnas excede jornada do dia. Ajustar para 8h."
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'insumos' && (
          <div style={{ padding: '0 16px' }}>
            <div className="card" style={{ padding: 0 }}>
              <InsumoRow nome="Glifosato 480" qtd="2,5 L/ha" total="220 L" />
              <InsumoRow nome="Adjuvante Aterbane" qtd="0,2 L/ha" total="18 L" />
              <InsumoRow nome="Diesel S-10" qtd="142 L" total="abastec. 07:14" last />
            </div>
            <button className="btn outline full" style={{ marginTop: 12 }}>+ Adicionar insumo</button>
          </div>
        )}

        {tab === 'historico' && (
          <Timeline items={[
            { ico: 'Plus',     who: 'Aderbal de Souza', what: 'Abertura', when: '10/05 06:45' },
            { ico: 'Fuel',     who: 'Aderbal de Souza', what: 'Abastecimento +142 L · TR-04', when: '10/05 07:14' },
            { ico: 'Play',     who: 'Aderbal de Souza', what: 'Início de execução', when: '10/05 07:20' },
            { ico: 'Pause',    who: 'Aderbal de Souza', what: 'Pausa para almoço (45 min)', when: '10/05 11:30' },
            { ico: 'Play',     who: 'Aderbal de Souza', what: 'Retomada', when: '10/05 12:18' },
          ]} />
        )}
      </div>

      {editable && (
        <div className="btn-bar">
          <button className="btn outline" style={{ flex: '0 0 auto' }}>
            <I.Pause size={16}/> Pausar
          </button>
          <button className="btn primary" onClick={() => navigate('os-closing')}>
            Encerrar OS <I.Check size={18} sw={2.4}/>
          </button>
        </div>
      )}
    </>
  );
}

function FieldNum({ label, value, suffix, editable, onChange }) {
  const [v, setV] = useStateOS(String(value));
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input className="input numeric" inputMode="decimal"
               value={v} onChange={e => setV(e.target.value)}
               onBlur={() => onChange?.(parseFloat(v) || 0)}
               disabled={!editable} />
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: 'var(--ink-3)' }}>{suffix}</span>
      </div>
    </div>
  );
}
function FieldText({ label, value, editable, onChange }) {
  const [v, setV] = useStateOS(value || '');
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <textarea className="input" style={{ height: 80, padding: 14, fontSize: 15, fontFamily: 'var(--f-sans)', textAlign: 'left' }}
                value={v} onChange={e => setV(e.target.value)}
                onBlur={() => onChange?.(v)}
                disabled={!editable}
                placeholder="Notas do operador (opcional)" />
    </div>
  );
}

function InsumoRow({ nome, qtd, total, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                  borderBottom: last ? 0 : '1px solid var(--line)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--olive-100)', color: 'var(--olive-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I.Drop size={18}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{nome}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{qtd}</div>
      </div>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>{total}</div>
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((it, i) => {
        const Ic = I[it.ico] || I.Clock;
        return (
          <div key={i} className="tl-item">
            <div className="dot"><Ic size={14} sw={2} /></div>
            <div className="body">
              <div className="h">{it.what}</div>
              <div className="s">{it.who} · {it.when}</div>
              {it.delta && <div className="delta">{it.delta}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OS CLOSING — horímetro final, validação
// ─────────────────────────────────────────────────────────────
function ScreenOSClosing({ conn, queueLen, navigate, currentOS, onCloseOS, onOpenSync }) {
  const [hrFim, setHrFim] = useStateOS('');
  const [obs, setObs] = useStateOS('');
  const [confirmOpen, setConfirmOpen] = useStateOS(false);

  const lastHr = currentOS.hrAtu;
  const valNum = parseFloat(hrFim || '0');
  const tooLow = hrFim && valNum < lastHr;
  const valid = hrFim && !tooLow;

  return (
    <>
      <AppBar title="Encerrar OS-3127" eyebrow="Confirmar horas trabalhadas"
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />
      <div className="screen-body">
        <OfflineBanner conn={conn} queueLen={queueLen} onTap={onOpenSync} />

        <div style={{ padding: '0 16px 14px' }}>
          <div className="card" style={{ background: 'var(--olive-50)', border: '1px solid var(--olive-200)' }}>
            <div style={{ fontSize: 12, color: 'var(--olive-900)', opacity: 0.8 }}>{currentOS.servico} · talhão {currentOS.talhao}</div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 22, marginTop: 4, color: 'var(--olive-900)' }}>
              {currentOS.maquinaNome}
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
              <Stat label="Hor. início" value={currentOS.hrIni.toFixed(1)} />
              <Stat label="Hor. atual"  value={lastHr.toFixed(1)} />
              <Stat label="Diur./Not." value={`${currentOS.hrsDia}h / ${currentOS.hrsNot}h`} />
            </div>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Horímetro final</label>
          <input className={'input numeric' + (tooLow ? ' error' : '')}
                 inputMode="decimal" placeholder={lastHr.toFixed(1)}
                 value={hrFim} onChange={e => setHrFim(e.target.value)} />
          {tooLow && (
            <div className="field-error">
              <I.Warning size={14} /> Horímetro não retrocede. Mínimo {lastHr.toFixed(1)} h.
            </div>
          )}
          {valid && (
            <div className="field-help">
              Total trabalhado: <b style={{ color: 'var(--ink-1)' }}>{(valNum - currentOS.hrIni).toFixed(1)} h</b>
            </div>
          )}
        </div>

        <FieldText label="Observações de encerramento" value={obs} editable onChange={setObs} />

        <div style={{ padding: '14px 16px' }}>
          <div style={{ padding: 14, background: 'var(--bg-sunk)', borderRadius: 12,
                        display: 'flex', alignItems: 'center', gap: 12 }}>
            <I.Pin size={20} stroke="var(--ink-3)" />
            <div style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)' }}>
              <b>Assinatura do operador</b><br/>
              <span style={{ color: 'var(--ink-3)' }}>Pulada nesta versão · será adicionada antes do go-live</span>
            </div>
            <Badge status="neutral">Pulada</Badge>
          </div>
        </div>
      </div>

      <div className="btn-bar">
        <button className="btn outline" style={{ flex: '0 0 auto' }} onClick={() => navigate(-1)}>Voltar</button>
        <button className="btn primary" disabled={!valid} onClick={() => setConfirmOpen(true)}>
          Concluir OS <I.Check size={18} sw={2.4}/>
        </button>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h3>Concluir OS-3127?</h3>
        <p>Após concluída, a OS irá para a bandeja de aprovação do gerente. Edição retroativa exigirá justificativa.</p>
        <div className="actions">
          <button className="btn ghost" onClick={() => setConfirmOpen(false)}>Cancelar</button>
          <button className="btn primary" onClick={() => {
            onCloseOS({ hrFim: valNum, obs });
            setConfirmOpen(false);
            navigate('os-success');
          }}>Concluir</button>
        </div>
      </Dialog>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// OS SUCCESS — confirmation
// ─────────────────────────────────────────────────────────────
function ScreenOSSuccess({ navigate, conn }) {
  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px',
                    background: 'linear-gradient(180deg, var(--olive-50) 0%, var(--bg-app) 60%)' }}>
        <button className="iconbtn" onClick={() => navigate('dash')} style={{ alignSelf: 'flex-start' }}>
          <I.X size={20}/>
        </button>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--olive-700)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 12px 30px rgba(63, 77, 38, 0.4)' }}>
            <I.Check size={44} stroke="#FBF7EC" sw={2.6} />
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--f-serif)', fontWeight: 400, fontSize: 32, lineHeight: 1.1,
                     textAlign: 'center', marginTop: 28, letterSpacing: '-0.02em' }}>
          OS encerrada<br/><em style={{ color: 'var(--olive-700)' }}>com sucesso</em>
        </h1>
        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--ink-3)', marginTop: 10, lineHeight: 1.5 }}>
          {conn === 'offline'
            ? 'Salva no dispositivo. Será sincronizada quando a rede voltar.'
            : 'Sincronizada com o servidor. Aguardando aprovação do gerente.'}
        </div>

        <div style={{ marginTop: 32, padding: 18, background: 'var(--bg-elev)', borderRadius: 16,
                      border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--ink-3)' }}>OS-3127</span>
            <Badge status="concluida"/>
          </div>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, marginTop: 8 }}>
            Subsolagem · TR-04 Valtra BH 180
          </div>
          <div className="kv" style={{ marginTop: 10 }}>
            <span className="k">Horas trabalhadas</span><span className="v">5,5 h</span>
          </div>
          <div className="kv">
            <span className="k">Horímetro final</span><span className="v">6.215,5 h</span>
          </div>
          <div className="kv">
            <span className="k">Talhão</span><span className="v">MV-12</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn primary full" onClick={() => navigate('os-wizard')}>Abrir nova OS</button>
          <button className="btn ghost full" onClick={() => navigate('dash')}>Voltar ao início</button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  ScreenOSList, ScreenOSWizard, ScreenOSDetail, ScreenOSClosing, ScreenOSSuccess,
  PickerSheet, SelectRow, Timeline,
});
