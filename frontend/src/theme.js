// "Layout board" system: a model railway at night. Dark baseboard, cream
// station enamel, signal lamps for state, brass for AI. See DESIGN.md.
// Key names are kept so existing components keep working.
export const C = {
  charcoal: "#161A16",
  charcoalMid: "#1F241F",
  charcoalLight: "#343B33",
  emerald: "#6CC07A", // signal green: triggers, actions, success
  emeraldDim: "#4E9E5C",
  emeraldGlow: "#8ED29A",
  purple: "#C99A45", // brass: AI nodes
  purpleDim: "#A87D30",
  purpleGlow: "#DDB66A",
  ivory: "#EDE6D3", // station enamel cream
  ivoryDim: "#E2D9C2",
  muted: "#A8A493",
  mutedDark: "#7E7B6E",
  border: "rgba(237,230,211,0.1)",
  borderMed: "rgba(237,230,211,0.16)",
  borderBright: "rgba(237,230,211,0.26)",
  glass: "rgba(237,230,211,0.04)",
  glassMed: "rgba(237,230,211,0.06)",
};

export const PAGES = ["home", "builder", "templates", "monitoring", "team", "pricing", "settings"];
