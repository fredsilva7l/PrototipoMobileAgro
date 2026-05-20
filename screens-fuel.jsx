// screens-fuel.jsx — Abastecimento (FAB form, history, balance), and a few list/system extras

const { useState: useStateF } = React;

// ─────────────────────────────────────────────────────────────
// FUEL FORM — bomba → máquina → litros → horímetro → origem
// ─────────────────────────────────────────────────────────────
function ScreenFuelForm({ conn, queueLen, navigate, onCommit, onOpenSync }) {
  const [d, setD] = useStateF({
    bomba: 'AGM-01',
    maquina: '',
    litros: '',
    hor: '',
    origem: 'AGM',
  });
  const [picker, setPicker] = useStateF(null);
  const [divDialog, setDivDialog] = useStateF(false);
  const [justDialog, setJustDialog] = useStateF(false);
  const [justification, setJustification] = useStateF('');

  const update = (p) => setD(prev => ({ ...prev, ...p }));
  const maquinaObj = AGM_DATA.MAQUINAS.find(m => m.id === d.maquina);
  const lastHor = maquinaObj?.hor ?? 0;
  const valHor = parseFloat(d.hor || '0');
  const horError = d.hor && valHor < lastHor;

  // Mock divergence logic: if litros is exactly "150" we trigger a divergence > 5L
  // For demo, divergence = previous reading vs reported; randomize-ish
  const expected = 142.0;
  const litrosNum = parseFloat(d.litros || '0');
  const divergencia = d.litros ? Math.abs(litrosNum - expected) : 0;
  const divError = divergencia > 5;

  const valid = d.bomba && d.maquina && d.litros && d.hor && !horError;

  const trySave = () => {
    if (divError && !justification) {
      setDivDialog(true);
      return;
    }
    onCommit({ ...d, justification });
    navigate('fuel-success');
  };

  return (
    <>
      <AppBar title="Novo abastecimento" eyebrow="Bomba diesel"
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />

      <div className="screen-body">
        <OfflineBanner conn={conn} queueLen={queueLen} onTap={onOpenSync} />

        <SelectRow label="Bomba" value={d.bomba} sub="Pátio principal" icon={I.Fuel}
                   onClick={() => setPicker('bomba')} />
        <div style={{ height: 12 }} />
        <SelectRow label="Máquina" value={d.maquina ? `${d.maquina} · ${maquinaObj?.nome}` : ''}
                   sub="Selecione a máquina" icon={I.Tractor}
                   onClick={() => setPicker('maquina')}
                   placeholder="Cascata: bomba → máquina" />

        <div style={{ height: 18 }} />
        <div className="field">
          <label className="field-label">Litros</label>
          <input className={'input numeric' + (divError ? ' error' : '')}
                 inputMode="decimal" placeholder="0,0"
                 value={d.litros} onChange={e => update({ litros: e.target.value })} />
          {divError ? (
            <div className="field-error">
              <I.Warning size={14}/> Divergência de {divergencia.toFixed(1)} L · acima da tolerância (5 L) · justificativa do gerente exigida.
            </div>
          ) : d.litros ? (
            <div className="field-help">Esperado pelo histórico: {expected.toFixed(1)} L · diferença {divergencia.toFixed(1)} L</div>
          ) : null}
        </div>

        <div className="field">
          <label className="field-label">Horímetro</label>
          <input className={'input numeric' + (horError ? ' error' : '')}
                 inputMode="decimal" placeholder={lastHor ? lastHor.toFixed(1) : '—'}
                 value={d.hor} onChange={e => update({ hor: e.target.value })}
                 disabled={!d.maquina} />
          {horError && (
            <div className="field-error">
              <I.Warning size={14}/> Horímetro não retrocede. Mínimo {lastHor.toFixed(1)} h.
            </div>
          )}
          {!horError && d.maquina && (
            <div className="field-help">Último registrado: {lastHor.toFixed(1)} h</div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Origem do saldo</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['AGM', 'Agrium'].map(o => (
              <button key={o} onClick={() => update({ origem: o })}
                      style={{
                        flex: 1, height: 56, borderRadius: 14, cursor: 'pointer',
                        background: d.origem === o ? 'var(--olive-700)' : 'var(--bg-elev)',
                        color: d.origem === o ? '#FBF7EC' : 'var(--ink-1)',
                        border: '1.5px solid ' + (d.origem === o ? 'var(--olive-700)' : 'var(--line-strong)'),
                        fontFamily: 'var(--f-sans)', fontSize: 15, fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}>
                <I.Drop size={18} sw={2}/> Saldo {o}
              </button>
            ))}
          </div>
          <div className="field-help">Saldo atual {d.origem}: <b>14.823,2 L</b> · pátio MV</div>
        </div>

        {justification && (
          <div style={{ margin: '12px 16px', padding: 12, background: 'var(--st-warning-bg)', borderRadius: 10,
                        fontSize: 13, color: 'var(--st-warning)' }}>
            <b>Justificativa registrada:</b> "{justification}"
            <button onClick={() => setJustification('')}
                    style={{ float: 'right', background: 'transparent', border: 0, color: 'var(--st-warning)', cursor: 'pointer', fontWeight: 700 }}>
              Limpar
            </button>
          </div>
        )}
      </div>

      <div className="btn-bar">
        <button className="btn outline" style={{ flex: '0 0 auto' }} onClick={() => navigate(-1)}>Cancelar</button>
        <button className="btn primary" disabled={!valid} onClick={trySave}>
          Registrar abastecimento
        </button>
      </div>

      <PickerSheet open={picker === 'bomba'} onClose={() => setPicker(null)} title="Bomba"
        items={[
          { id: 'AGM-01', h: 'Bomba AGM-01', s: 'Pátio MV · saldo 14.823 L' },
          { id: 'AGM-02', h: 'Bomba AGM-02', s: 'Pátio MV · saldo 8.210 L' },
          { id: 'AGRIUM', h: 'Bomba Agrium', s: 'Comodato · saldo 6.420 L' },
        ]}
        onPick={id => { update({ bomba: id }); setPicker(null); }} active={d.bomba} />

      <PickerSheet open={picker === 'maquina'} onClose={() => setPicker(null)} title="Máquina"
        items={AGM_DATA.MAQUINAS.filter(m => m.tipo !== 'Implem.').map(m => ({
          id: m.id, h: `${m.id} · ${m.nome}`,
          s: m.status === 'manut' ? 'Em manutenção — indisponível' : `Horímetro ${m.hor.toFixed(1)} h`,
          disabled: m.status === 'manut',
        }))}
        onPick={id => { update({ maquina: id }); setPicker(null); }} active={d.maquina} />

      {/* Divergence dialog */}
      <Dialog open={divDialog} onClose={() => setDivDialog(false)}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--st-danger-bg)',
                      color: 'var(--st-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 14 }}>
          <I.Warning size={28} sw={2.2}/>
        </div>
        <h3>Divergência de {divergencia.toFixed(1)} L bloqueada</h3>
        <p>RN03: diferença acima de 5 L exige justificativa do gerente para ser salva. Descreva o motivo abaixo:</p>
        <textarea placeholder="Ex.: bomba descalibrada, vazamento, fornecimento em jerican…"
                  style={{ width: '100%', minHeight: 100, padding: 12, borderRadius: 10,
                          border: '1.5px solid var(--line-strong)', fontFamily: 'var(--f-sans)',
                          fontSize: 14, resize: 'none', boxSizing: 'border-box' }}
                  defaultValue=""
                  onChange={e => setJustification(e.target.value)} />
        <div className="actions">
          <button className="btn ghost" onClick={() => setDivDialog(false)}>Cancelar</button>
          <button className="btn primary" onClick={() => { setDivDialog(false); /* keep justification, user clicks save again */ }}>
            Anexar justificativa
          </button>
        </div>
      </Dialog>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// FUEL SUCCESS
// ─────────────────────────────────────────────────────────────
function ScreenFuelSuccess({ navigate, conn }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px',
                  background: 'linear-gradient(180deg, var(--clay-50) 0%, var(--bg-app) 50%)' }}>
      <button className="iconbtn" onClick={() => navigate('dash')} style={{ alignSelf: 'flex-start' }}>
        <I.X size={20}/>
      </button>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--clay-500)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 12px 30px rgba(154, 74, 42, 0.4)' }}>
          <I.Fuel size={40} stroke="#FBF7EC" sw={2.2} />
        </div>
      </div>
      <h1 style={{ fontFamily: 'var(--f-serif)', fontWeight: 400, fontSize: 32, lineHeight: 1.1,
                   textAlign: 'center', marginTop: 28 }}>
        Abastecimento<br/><em style={{ color: 'var(--clay-700)' }}>registrado</em>
      </h1>
      <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--ink-3)', marginTop: 10 }}>
        {conn === 'offline' ? 'Salvo localmente. Será sincronizado.' : 'AB-8842 · sincronizado'}
      </div>

      <div style={{ marginTop: 32, padding: 18, background: 'var(--bg-elev)',
                    borderRadius: 16, border: '1px solid var(--line)' }}>
        <div className="kv"><span className="k">Máquina</span><span className="v">TR-04 · Valtra BH 180</span></div>
        <div className="kv"><span className="k">Bomba</span><span className="v">AGM-01</span></div>
        <div className="kv"><span className="k">Litros</span><span className="v">142,0 L</span></div>
        <div className="kv"><span className="k">Horímetro</span><span className="v">6.215,5 h</span></div>
        <div className="kv"><span className="k">Origem</span><span className="v">Saldo AGM</span></div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn primary full" onClick={() => navigate('fuel-list')}>Ver histórico</button>
        <button className="btn ghost full" onClick={() => navigate('dash')}>Voltar ao início</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FUEL LIST (history)
// ─────────────────────────────────────────────────────────────
function ScreenFuelList({ conn, queueLen, navigate, onOpenSync }) {
  return (
    <>
      <AppBar large title={<>Abastecimento</>} eyebrow="Histórico · Pátio MV"
              conn={conn} queueLen={queueLen} onBack={() => navigate('dash')} />
      <div className="screen-body">
        <OfflineBanner conn={conn} queueLen={queueLen} onTap={onOpenSync} />

        <div style={{ padding: '0 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="metric">
            <div className="label">Saldo AGM</div>
            <div className="value">14.823<span style={{ fontSize: 18, color: 'var(--ink-3)' }}> L</span></div>
            <div className="sub">Pátio MV · 4 bombas</div>
          </div>
          <div className="metric">
            <div className="label">Saldo Agrium</div>
            <div className="value">6.420<span style={{ fontSize: 18, color: 'var(--ink-3)' }}> L</span></div>
            <div className="sub">Comodato · vence 31/05</div>
          </div>
        </div>

        <div className="section-title">Hoje</div>
        <div className="card-stack">
          {AGM_DATA.ABASTEC_LIST.slice(0, 2).map(a => <FuelCard key={a.id} a={a}/>)}
        </div>

        <div className="section-title">Esta semana</div>
        <div className="card-stack">
          {AGM_DATA.ABASTEC_LIST.slice(2).map(a => <FuelCard key={a.id} a={a}/>)}
        </div>
      </div>

      <FAB icon={I.Plus} extended label="Abastecer" onClick={() => navigate('fuel-form')} />
    </>
  );
}
function FuelCard({ a }) {
  const div = a.divergencia > 5;
  return (
    <div className={'card os-card' + (div ? ' attn' : '')} style={div ? { borderColor: 'var(--st-danger)' } : null}>
      <div className="head">
        <span className="id">{a.id}</span>
        {div ? <Badge status="danger">Diverg. {a.divergencia.toFixed(1)} L</Badge>
             : <Badge status="success">Conferido</Badge>}
      </div>
      <div className="machine">
        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--clay-50)', color: 'var(--clay-700)',
                       display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I.Fuel size={16}/>
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>{a.maquina} · {a.litros.toFixed(1)} L</span>
      </div>
      <div className="service">Bomba {a.bomba} · saldo {a.origem}</div>
      <div className="meta">
        <span><b>{a.data}</b></span>
        <span>Hor. {a.hor.toFixed(1)}</span>
        {div && <span style={{ color: 'var(--st-danger)', fontWeight: 600 }}>Justificativa anexada</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FUEL BALANCE — saldos por bomba/fazenda
// ─────────────────────────────────────────────────────────────
function ScreenFuelBalance({ conn, queueLen, navigate, onOpenSync }) {
  const bombas = [
    { id: 'AGM-01', faz: 'MV', origem: 'AGM',    saldo: 14823, cap: 20000 },
    { id: 'AGM-02', faz: 'MV', origem: 'AGM',    saldo: 8210,  cap: 15000 },
    { id: 'AGM-03', faz: 'MB', origem: 'AGM',    saldo: 11410, cap: 20000 },
    { id: 'AGRIUM', faz: 'MV', origem: 'Agrium', saldo: 6420,  cap: 12000 },
    { id: 'CACH-01',faz: 'CACH',origem: 'AGM',   saldo: 18290, cap: 25000 },
  ];
  return (
    <>
      <AppBar large title={<>Saldo de <em>bombas</em></>} eyebrow="Diesel · pátios"
              conn={conn} queueLen={queueLen} onBack={() => navigate(-1)} />
      <div className="screen-body">
        <OfflineBanner conn={conn} queueLen={queueLen} onTap={onOpenSync} />

        <div className="card-stack">
          {bombas.map(b => {
            const pct = b.saldo / b.cap;
            const low = pct < 0.25;
            return (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--ink-3)' }}>{b.faz} · {b.origem}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--f-serif)' }}>Bomba {b.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 22, fontWeight: 600,
                                  color: low ? 'var(--st-danger)' : 'var(--ink-1)' }}>
                      {b.saldo.toLocaleString('pt-BR')} L
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>de {b.cap.toLocaleString('pt-BR')} L</div>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--bg-sunk)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: (pct * 100) + '%',
                                background: low ? 'var(--st-danger)' : 'var(--olive-500)',
                                borderRadius: 3, transition: 'width .4s' }}/>
                </div>
                {low && (
                  <div style={{ fontSize: 12, color: 'var(--st-danger)', marginTop: 8, fontWeight: 600 }}>
                    <I.Warning size={12} sw={2.2}/> Saldo baixo · solicitar reposição
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <FAB icon={I.Plus} extended label="Abastecer" onClick={() => navigate('fuel-form')} />
    </>
  );
}

Object.assign(window, {
  ScreenFuelForm, ScreenFuelSuccess, ScreenFuelList, ScreenFuelBalance,
});
