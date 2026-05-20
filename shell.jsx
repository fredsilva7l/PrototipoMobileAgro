// shell.jsx — device frame, app chrome, bottom tabs, FAB, banners

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Status bar (top of phone screen)
// ─────────────────────────────────────────────────────────────
function StatusBar({ dark }) {
  return (
    <div className={'statusbar' + (dark ? ' dark' : '')}>
      <div>9:42</div>
      <div className="punch" />
      <div className="icons">
        <I.Wifi size={14} sw={2} />
        <I.Battery size={16} sw={1.5} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Connection chip (header pill)
// ─────────────────────────────────────────────────────────────
function ConnChip({ state, queueLen }) {
  if (state === 'offline') {
    return (
      <span className="conn-chip offline">
        <I.CloudOff size={12} sw={2.2} />
        Offline · {queueLen}
      </span>
    );
  }
  if (state === 'syncing') {
    return (
      <span className="conn-chip syncing">
        <span className="dot" />
        Sincronizando
      </span>
    );
  }
  return (
    <span className="conn-chip online">
      <span className="dot" />
      Online
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Top app bar (compact + large variant)
// ─────────────────────────────────────────────────────────────
function AppBar({ title, eyebrow, onBack, action, large, conn, queueLen }) {
  return (
    <div className={'appbar' + (large ? ' large' : '')}>
      {large ? (
        <>
          <div className="row">
            {onBack && (
              <button className="iconbtn" onClick={onBack} aria-label="Voltar">
                <I.Back size={22} />
              </button>
            )}
            <div className="title">{eyebrow || ''}</div>
            <ConnChip state={conn} queueLen={queueLen} />
            {action}
          </div>
          <h1>{title}</h1>
        </>
      ) : (
        <>
          {onBack && (
            <button className="iconbtn" onClick={onBack} aria-label="Voltar">
              <I.Back size={22} />
            </button>
          )}
          <div className="title">
            {eyebrow && <small>{eyebrow}</small>}
            {title}
          </div>
          {action}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Offline / sync banner (sits beneath app bar when relevant)
// ─────────────────────────────────────────────────────────────
function OfflineBanner({ conn, queueLen, syncProgress, onTap }) {
  if (conn === 'online' && queueLen === 0) return null;
  if (conn === 'offline') {
    return (
      <div className="offline-banner" onClick={onTap} style={{ cursor: 'pointer' }}>
        <I.CloudOff size={18} sw={2} />
        <div className="label">Offline — {queueLen} {queueLen === 1 ? 'item' : 'itens'} na fila</div>
        <span className="badge">Toque</span>
      </div>
    );
  }
  if (conn === 'syncing') {
    return (
      <div className="offline-banner syncing" onClick={onTap} style={{ cursor: 'pointer' }}>
        <I.Refresh size={18} sw={2} style={{ animation: 'spin 1.4s linear infinite' }} />
        <div className="label">Sincronizando {queueLen} {queueLen === 1 ? 'item' : 'itens'}…</div>
        <span className="badge">{Math.round(syncProgress * 100)}%</span>
        <div className="progress"><span style={{ width: (syncProgress * 100) + '%' }} /></div>
      </div>
    );
  }
  // online with pending (rare): hidden
  return null;
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar
// ─────────────────────────────────────────────────────────────
function BottomTabs({ active, onChange }) {
  const tabs = [
    { id: 'dash',  label: 'Início',   ico: 'Home' },
    { id: 'os',    label: 'OS',       ico: 'Wrench' },
    { id: 'fuel',  label: 'Abastec.', ico: 'Fuel' },
    { id: 'buy',   label: 'Compras',  ico: 'Cart' },
    { id: 'more',  label: 'Mais',     ico: 'More' },
  ];
  return (
    <div className="bottom-tabs">
      {tabs.map(t => {
        const Ic = I[t.ico];
        return (
          <button key={t.id} className={t.id === active ? 'active' : ''} onClick={() => onChange(t.id)}>
            <Ic size={20} sw={t.id === active ? 2.2 : 1.8} className="ic" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAB
// ─────────────────────────────────────────────────────────────
function FAB({ icon: Ic = I.Plus, label, onClick, extended }) {
  return (
    <button className={'fab' + (extended ? ' extended' : '')} onClick={onClick}>
      <Ic size={24} sw={2.2} />
      {extended && <span>{label}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom sheet
// ─────────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, title, children }) {
  return (
    <>
      <div className={'scrim' + (open ? ' open' : '')} onClick={onClose} />
      <div className={'sheet' + (open ? ' open' : '')}>
        <div className="grip" />
        {title && <h3>{title}</h3>}
        <div className="sheet-list">
          {children}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal dialog (centered)
// ─────────────────────────────────────────────────────────────
function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="scrim open" onClick={onClose}
         style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Status badge (taking status key)
// ─────────────────────────────────────────────────────────────
function Badge({ status, kind = 'os', children }) {
  const map = kind === 'maq' ? AGM_DATA.STATUS_MAQ : AGM_DATA.STATUS_OS;
  if (children) return <span className={'badge ' + (status || 'neutral')}><span className="dot" />{children}</span>;
  const s = map[status] || { label: status, cls: 'neutral' };
  return <span className={'badge ' + s.cls}><span className="dot" />{s.label}</span>;
}

// ─────────────────────────────────────────────────────────────
// Brand mark (provisional logo)
// ─────────────────────────────────────────────────────────────
function BrandMark({ size = 32 }) {
  return (
    <div className="brand-mark" style={{ width: size, height: size, borderRadius: size * 0.28, fontSize: size * 0.56 }}>
      <svg viewBox="0 0 32 32" width={size * 0.7} height={size * 0.7} fill="none" stroke="#FBF7EC"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* leaf + chip dots */}
        <path d="M8 22C8 14 14 8 22 8c0 8-6 14-14 14Z" fill="#FBF7EC" stroke="none" opacity="0.92"/>
        <path d="M9 22c4-1 9-5 12-12" stroke="#3F4D26" strokeWidth="1.6"/>
        <circle cx="24" cy="24" r="1.5" fill="#FBF7EC"/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Device frame (whole phone)
// ─────────────────────────────────────────────────────────────
function Device({ children, dark, hideStatusBar }) {
  return (
    <div className="device">
      <div className="device-screen" style={{ background: dark ? 'var(--bg-dark)' : 'var(--bg-app)' }}>
        {!hideStatusBar && <StatusBar dark={dark} />}
        {children}
        <div className={'gesturebar' + (dark ? ' dark' : '')}>
          <div className="pill" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Spinning keyframe (used by offline banner refresh icon)
// ─────────────────────────────────────────────────────────────
const _styleEl = document.createElement('style');
_styleEl.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(_styleEl);

Object.assign(window, {
  StatusBar, ConnChip, AppBar, OfflineBanner, BottomTabs, FAB,
  BottomSheet, Dialog, Badge, BrandMark, Device,
});
