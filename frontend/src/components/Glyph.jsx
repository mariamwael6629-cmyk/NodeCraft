// Emoji in node, template and settings data are drawn as one stroke icon set
// (24px grid, 1.8 stroke). Unknown emoji fall back to the character itself.
const P = {
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5 0-.8.7-1.5 1.5-1.5H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5z"/><path d="M7.5 11h.01M10 7.5h.01M14.5 7.5h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',

    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    disk: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    gauge: '<path d="M12 14l4-4M4 18a9 9 0 1 1 16 0"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
    export: '<path d="M12 15V3M7 8l5-5 5 5M5 14v6h14v-6"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    car: '<path d="M5 17h14v-5l-2-5H7l-2 5zM5 12h14"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    box: '<path d="m12 3 9 4.5v9L12 21l-9-4.5v-9z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.7-4.3M4 4v4h4M4 13a8 8 0 0 0 14.7 4.3M20 20v-4h-4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6v4H9z"/>',
    flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 1.5 1 3 2.5 3 4 0-2 0-5 0-7z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4z"/><path d="M12 5v16"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    hash: '<path d="M5 9h15M4 15h15M10 3 8 21M16 3l-2 18"/>',
    note: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    rocket: '<path d="M5 15c-1 1-2 5-2 5s4-1 5-2M12 15l-3-3c1-5 5-9 10-9 0 5-4 9-9 10z"/><circle cx="15" cy="9" r="1.5"/>',
    crown: '<path d="M3 7l4 5 5-7 5 7 4-5-2 12H5z"/>',
    star: '<path d="M12 3l2.8 5.9 6.2.9-4.5 4.4 1 6.3L12 17.6 6.5 20.5l1-6.3L3 9.8l6.2-.9z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    robot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
    doc: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    folder: '<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9zM10 20a2 2 0 0 0 4 0"/>',
    money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    sparkle: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
    cloud: '<path d="M7 18a5 5 0 0 1 0-10 6 6 0 0 1 11.3 1.5A4.3 4.3 0 0 1 18 18z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    up: '<path d="M7 17 17 7M8 7h9v9"/>',
    down: '<path d="M7 7l10 10M17 8v9H8"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    wand: '<path d="M4 20 15 9M14 4v3M18 6l-2 2M20 10h-3M9 4l1 2"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V7a3 3 0 0 0-3-3zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 0"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
    frown: '<circle cx="12" cy="12" r="9"/><path d="M8.5 16a4.5 4.5 0 0 1 7 0M9 9.5h.01M15 9.5h.01"/>',
    meh: '<circle cx="12" cy="12" r="9"/><path d="M8.5 15h7M9 9.5h.01M15 9.5h.01"/>',
    send: '<path d="M21 3 3 10l7 3 3 7z"/><path d="M10 13l4-4"/>',
    attach: '<path d="m20 12-8 8a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/>',
    grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    puzzle: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-6-6-9 9"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5M5 14v6h14v-6"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  };

const M = {
    '🤖': 'bot', '🧠': 'brain', '⏸': 'pause', '🗺': 'map', '🎨': 'palette', '🎯': 'target', '🔔': 'bell', '⏰': 'clock',

    '🌐': 'globe', '🛜': 'wifi', '⚖': 'scale', '🔀': 'shuffle', '⚙': 'gear', '🔐': 'lock', '🔒': 'lock', '🔑': 'key', '🔍': 'search', '🔎': 'search',
    '🗄': 'database', '⚡': 'bolt', '💾': 'disk', '📨': 'mail', '📧': 'mail', '✉': 'mail', '📊': 'chart', '📈': 'up', '📉': 'down', '🚦': 'gauge', '🗑': 'trash',
    '🔗': 'link', '✂': 'scissors', '📤': 'export', '📥': 'download', '↩': 'undo', '🏗': 'layers', '🎬': 'film', '🚗': 'car', '💬': 'chat', '🗨': 'chat',
    '📸': 'camera', '📷': 'camera', '📦': 'box', '🗃': 'archive', '🔄': 'refresh', '🔁': 'refresh', '🏆': 'trophy', '🥇': 'trophy', '🔥': 'flame', '💡': 'bulb',
    '📖': 'book', '📚': 'book', '📅': 'calendar', '📆': 'calendar', '🗓': 'calendar', '👁': 'eye', '🔢': 'hash', '📝': 'note', '✍': 'note', '✏': 'note',
    '🚀': 'rocket', '👑': 'crown', '⭐': 'star', '🌟': 'star', '🤝': 'users', '👥': 'users', '❤': 'heart', '💖': 'heart', '🔖': 'bookmark', '⏱': 'clock',
    '⏰': 'clock', '🕐': 'clock', '✅': 'check', '✔': 'check', '⚠': 'alert', '❌': 'x', '🎯': 'target', '🤖': 'robot', '📄': 'doc', '📃': 'doc', '📋': 'doc',
    '📁': 'folder', '📂': 'folder', '🗂': 'folder', '👤': 'user', '🧑': 'user', '🔔': 'bell', '💰': 'money', '💵': 'money', '💳': 'money', '✨': 'sparkle',
    '📍': 'pin', '🎙': 'mic', '🎤': 'mic', '📞': 'phone', '🏠': 'home', '💻': 'code', '🖥': 'code', '🧩': 'puzzle', '☁': 'cloud', '🛡': 'shield', '▶': 'play',
    '⏸': 'pause', '➕': 'plus', '🪄': 'wand', '🧠': 'brain', '😊': 'smile', '🙂': 'smile', '😃': 'smile', '😀': 'smile', '😞': 'frown', '😠': 'frown',
    '😡': 'frown', '😐': 'meh', '📎': 'attach', '🎓': 'grad', '💼': 'briefcase', '🚩': 'flag', '🖼': 'image', '🔧': 'gear', '🛠': 'gear', '⚗': 'gear',
    '🔌': 'link', '🌍': 'globe', '🌎': 'globe', '📡': 'wifi', '🗺': 'globe',
  };

export default function Glyph({ e, size = 18, style }) {
  const key = String(e || "").replace(/️/g, "");
  const name = M[key];
  if (!name || !P[name]) return <span style={{ fontSize: size, ...style }}>{e}</span>;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: P[name] }}
    />
  );
}
