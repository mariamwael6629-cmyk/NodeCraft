import { C } from "./theme.js";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&family=Cabin+Condensed:wght@600;700&family=Fira+Code:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${C.charcoal}; color: ${C.ivory}; font-family: 'Cabin', system-ui, sans-serif; }
    h1, h2, h3 { font-family: 'Cabin Condensed', 'Cabin', sans-serif; letter-spacing: 0 !important; }
    ::selection { background: #EDE6D3; color: #161A16; }
    :focus-visible { outline: 2px solid #E8A33A; outline-offset: 2px; }
    button, input, textarea, select { font-family: inherit; }
    code, pre { font-family: 'Fira Code', ui-monospace, monospace; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${C.charcoalLight}; border-radius: 2px; }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes pulse-glow { 0%,100%{opacity:.6} 50%{opacity:1} }
    @keyframes slide-in { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes grid-scroll { from{background-position:0 0} to{background-position:0 60px} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes dash { to{stroke-dashoffset:-20} }
    @keyframes node-appear { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }
    @keyframes shimmer { 0%{left:-200%} 100%{left:200%} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes ripple { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.5);opacity:0} }
    @keyframes typing { from{width:0} to{width:100%} }
    @keyframes bar-grow { from{transform:scaleX(0)} to{transform:scaleX(1)} }

    .glass-card {
      background: ${C.glassMed};
      border: 1px solid ${C.border};
      border-radius: 8px;
    }
    .glass-card-bright {
      background: rgba(237,230,211,0.06);
      border: 1px solid ${C.borderMed};
      border-radius: 8px;
    }
    .btn-emerald {
      background: ${C.ivory};
      color: ${C.charcoal};
      border: none;
      border-radius: 6px;
      padding: 12px 28px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
      box-shadow: none;
    }
    .btn-emerald:disabled { opacity: .6; cursor: not-allowed; }
    .btn-emerald:hover { background: #FFF8E6; }
    .btn-emerald[data-dark] { background: #161A16; color: #EDE6D3; }
    .btn-emerald[data-dark]:hover { background: #2A302A; }
    @media (max-width: 860px) {
      .nc-nav { flex-wrap: wrap; padding: 10px 16px !important; row-gap: 6px; }
      .nc-nav-items { order: 3; flex: 0 0 100%; overflow-x: auto; }
      .nc-nav-items .nav-item { white-space: nowrap; padding: 6px 12px; }
      .nc-nav-cta { display: none; }
      .nc-stack { grid-template-columns: minmax(0,1fr) !important; }
      /* Builder on phones: components on top, a canvas that scrolls inside
         itself, and node settings underneath. */
      .wb { flex-direction: column; height: auto !important; min-height: 100vh; padding-top: 96px !important; }
      .wb-left { width: 100% !important; max-height: 260px; border-right: 0 !important; border-bottom: 1px solid ${C.border}; }
      .wb-canvas { flex: none !important; height: 64vh; min-height: 420px; overflow: auto !important; }
      .wb-right { width: 100% !important; border-left: 0 !important; border-top: 1px solid ${C.border}; }
      section { padding-left: 16px !important; padding-right: 16px !important; }
    }
    @media (prefers-reduced-motion: reduce) { .nc-train { display: none; } }
    .btn-emerald:active, .btn-ghost:active, .btn-purple:active { transform: scale(.98); }
    .btn-ghost {
      background: ${C.glass};
      color: ${C.ivory};
      border: 1px solid ${C.borderMed};
      border-radius: 6px;
      padding: 12px 28px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
    }
    .btn-ghost:hover { background: rgba(237,230,211,.1); border-color: ${C.borderBright}; }
    .btn-purple {
      background: ${C.purple};
      color: ${C.charcoal};
      border: none;
      border-radius: 10px;
      padding: 10px 22px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
    }
    .btn-purple:hover { background: ${C.purpleGlow}; }
    .tag {
      background: rgba(108,192,122,.12);
      color: ${C.emeraldGlow};
      border: 1px solid rgba(108,192,122,.2);
      border-radius: 8px;
      padding: 4px 14px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0;
    }
    .gradient-text {
      color: ${C.emeraldGlow};
    }
    .node-glow { }
    .nav-item {
      color: ${C.muted}; font-size: 14px; font-weight: 500; cursor: pointer;
      padding: 8px 16px; border-radius: 8px; transition: all .2s;
    }
    .nav-item:hover, .nav-item.active { color: ${C.ivory}; background: ${C.glass}; }
    .nav-item.active { color: ${C.emeraldGlow}; }
    input, textarea, select {
      background: rgba(237,230,211,.05);
      border: 1px solid ${C.border};
      border-radius: 10px;
      color: ${C.ivory};
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      transition: border-color .2s;
    }
    input:focus, textarea:focus { border-color: rgba(108,192,122,.5); }
    .stat-card {
      background: rgba(237,230,211,.04);
      border: 1px solid ${C.border};
      border-radius: 8px;
      padding: 20px;
    }
    .pricing-card {
      background: rgba(237,230,211,.04);
      border: 1px solid ${C.border};
      border-radius: 10px;
      padding: 32px;
      transition: all .3s;
    }
    .pricing-card:hover { border-color: rgba(108,192,122,.3); transform: translateY(-4px); }
    .pricing-card.featured {
      background: rgba(237,230,211,.07);
      border-color: ${C.ivory};
    }
    .template-card {
      background: rgba(237,230,211,.04);
      border: 1px solid ${C.border};
      border-radius: 8px;
      padding: 20px;
      cursor: pointer;
      transition: all .25s;
    }
    .template-card:hover { background: rgba(237,230,211,.07); border-color: rgba(201,154,69,.3); transform:translateY(-3px); }
    .sidebar-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      font-size: 13px; cursor: pointer; transition: all .15s;
      color: ${C.muted};
    }
    .sidebar-item:hover { background: rgba(237,230,211,.06); color: ${C.ivory}; }
    .sidebar-item.active { background: rgba(108,192,122,.12); color: ${C.emeraldGlow}; }
    .workflow-node {
      touch-action: none;
      position: absolute; border-radius: 14px;
      display: flex; flex-direction: column; gap: 6px;
      padding: 14px 18px;
      cursor: grab; user-select: none;
      border: 1px solid ${C.borderMed};
      transition: box-shadow .2s;
    }
    .workflow-node:hover { box-shadow: 0 8px 32px rgba(0,0,0,.4); z-index: 10; }
    .workflow-node.selected { border-color: ${C.ivory}; box-shadow: 0 0 0 1px ${C.ivory}; }
    .chat-bubble {
      max-width: 80%; padding: 12px 16px;
      border-radius: 16px; font-size: 13px; line-height: 1.5;
    }
    .chat-bubble.ai {
      background: rgba(201,154,69,.15);
      border: 1px solid rgba(201,154,69,.2);
      border-radius: 16px 16px 16px 4px;
    }
    .chat-bubble.user {
      background: rgba(108,192,122,.12);
      border: 1px solid rgba(108,192,122,.2);
      border-radius: 16px 16px 4px 16px;
      margin-left: auto;
    }
    .toggle-switch {
      position: relative; width: 52px; height: 28px;
      background: ${C.charcoalLight}; border-radius: 14px;
      cursor: pointer; transition: background .2s;
    }
    .toggle-switch.on { background: ${C.emerald}; }
    .toggle-knob {
      position: absolute; top: 3px; left: 3px;
      width: 22px; height: 22px; border-radius: 50%;
      background: white; transition: transform .2s;
      box-shadow: 0 2px 6px rgba(0,0,0,.3);
    }
    .toggle-switch.on .toggle-knob { transform: translateX(24px); }
    .activity-dot {
      width: 8px; height: 8px; border-radius: 50%;
    }
    .progress-ring circle { transition: stroke-dashoffset .8s ease; }
    .modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(10,12,10,.7);
      display: flex; align-items: center; justify-content: center;
    }
  `}</style>
);

export default GlobalStyle;
