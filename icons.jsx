// icons.jsx — minimal stroke icon set, sized via `size` prop

const Icon = ({ d, size = 22, stroke = 'currentColor', sw = 1.8, fill = 'none', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  Home:    (p) => <Icon {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M10 20v-5h4v5"/></Icon>,
  Wrench:  (p) => <Icon {...p} d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-2.1 2.5-2.4Z"/>,
  Fuel:    (p) => <Icon {...p}><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M3 21h13"/><path d="M7 8h5"/><path d="M15 9l3 1.5V18a2 2 0 0 0 2 2"/><path d="M18 4l3 3"/></Icon>,
  Cart:    (p) => <Icon {...p}><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11l2-7H6"/></Icon>,
  More:    (p) => <Icon {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></Icon>,
  Plus:    (p) => <Icon {...p} d="M12 5v14M5 12h14"/>,
  Back:    (p) => <Icon {...p} d="M15 6l-6 6 6 6"/>,
  Search:  (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  Filter:  (p) => <Icon {...p} d="M4 6h16M7 12h10M10 18h4"/>,
  Bell:    (p) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></Icon>,
  Check:   (p) => <Icon {...p} d="m4 12 6 6 12-12"/>,
  X:       (p) => <Icon {...p} d="M6 6l12 12M18 6 6 18"/>,
  Tractor: (p) => <Icon {...p}><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="2"/><path d="M4 17H2v-4l4-1V8h6l2 4h2"/><path d="M14 12V7h4l2 5"/></Icon>,
  Wheat:   (p) => <Icon {...p}><path d="M12 22V8"/><path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 12c3 0 5-2 5-5-3 0-5 2-5 5Z"/><path d="M12 17c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 17c3 0 5-2 5-5-3 0-5 2-5 5Z"/></Icon>,
  Drop:    (p) => <Icon {...p} d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z"/>,
  Cloud:   (p) => <Icon {...p} d="M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11 1 4 4 0 0 1-1 8H7Z"/>,
  CloudOff:(p) => <Icon {...p}><path d="M3 3l18 18"/><path d="M9 6.5A6 6 0 0 1 18 11a4 4 0 0 1 1.5 7.5"/><path d="M15.5 18H7a4 4 0 0 1-3.7-5.5"/></Icon>,
  Refresh: (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></Icon>,
  Clock:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  Calendar:(p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Icon>,
  Map:     (p) => <Icon {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></Icon>,
  User:    (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon>,
  Camera:  (p) => <Icon {...p}><path d="M3 9a2 2 0 0 1 2-2h2l1.5-2h7L17 7h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/></Icon>,
  Warning: (p) => <Icon {...p}><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v5M12 18.5v.1" stroke="currentColor"/></Icon>,
  Spark:   (p) => <Icon {...p} d="M12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10 12 2Z"/>,
  Pause:   (p) => <Icon {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></Icon>,
  Play:    (p) => <Icon {...p} d="M7 4v16l13-8L7 4Z"/>,
  Cog:     (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></Icon>,
  Doc:     (p) => <Icon {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></Icon>,
  Tag:     (p) => <Icon {...p}><path d="m20 13-7 7-9-9V4h7Z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/></Icon>,
  Wifi:    (p) => <Icon {...p}><path d="M2 8a16 16 0 0 1 20 0"/><path d="M5 12a11 11 0 0 1 14 0"/><path d="M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="0.6" fill="currentColor"/></Icon>,
  Battery: (p) => <Icon {...p}><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 10v4"/><rect x="4" y="9" width="13" height="6" rx="1" fill="currentColor" stroke="none"/></Icon>,
  Sun:     (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></Icon>,
  Moon:    (p) => <Icon {...p} d="M20 14a8 8 0 1 1-9-10 6 6 0 0 0 9 10Z"/>,
  Logout:  (p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></Icon>,
  Eye:     (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Icon>,
  Receipt: (p) => <Icon {...p}><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1 2-1V3"/><path d="M8 8h8M8 12h8M8 16h5"/></Icon>,
  Lock:    (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/></Icon>,
  Pin:     (p) => <Icon {...p}><path d="M12 22s7-7 7-13a7 7 0 0 0-14 0c0 6 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></Icon>,
  Sheaf:   (p) => <Icon {...p}><path d="M12 22V11"/><path d="M12 11c-2.5 0-4-2-4-4 2.5 0 4 2 4 4Z"/><path d="M12 11c2.5 0 4-2 4-4-2.5 0-4 2-4 4Z"/><path d="M12 9c-3 0-5-3-5-6 3 0 5 3 5 6Z"/><path d="M12 9c3 0 5-3 5-6-3 0-5 3-5 6Z"/></Icon>,
};

window.I = I;
