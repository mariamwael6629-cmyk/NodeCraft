# NodeCraft design system: "Layout board"

Building an automation from nodes is like laying out a model railway: you
place stations, join them with track, and watch a train run the route. The
app is the layout board at night: dark baseboard, cream enamel station boards,
signal lamps for state, brass for AI.

## Colour (`frontend/src/theme.js`, key names unchanged)
| Key | Value | Use |
|---|---|---|
| `charcoal` / `charcoalMid` / `charcoalLight` | `#161A16` / `#1F241F` / `#343B33` | baseboard, panels, tracks of switches |
| `ivory` / `ivoryDim` | `#EDE6D3` / `#E2D9C2` | station enamel: text, primary buttons, node boards |
| `emerald` (+Dim/Glow) | `#6CC07A` | signal green: triggers, actions, success, active nav |
| `purple` (+Dim/Glow) | `#C99A45` | brass: AI nodes |
| literals | blue `#6FA3C7` (data), amber `#E8A33A` (logic, warnings, popular tag), red `#D9533F` (errors) | node roles and status |
| `border*`, `glass*` | cream at 4–26% | rules and fills |

No gradients, glows or blur. The old green-to-purple gradients are flat.

## Type
Cabin Condensed for headings and numbers, Cabin for UI, Fira Code for file
names and code. Buttons inherit the UI font.

## Components
- `Glyph` (`src/components/Glyph.jsx`): emoji in node, template, settings and
  monitoring data render as one stroke icon set; unknown emoji fall back to
  the character.
- Home preview: station boards with a coloured roof strip and a signal lamp
  that turns green in sequence; connections drawn as track with sleepers and
  rails; a small train runs the top route.
- Builder nodes: flat panel with a 4px role-coloured top edge.
- Primary button: cream; on the cream CTA panel it flips to dark.
- Mobile (<860px): nav items move to a scrolling second row, the nav CTA
  hides, pricing and monitoring grids stack.

## Motion
The train and track dashes stop under `prefers-reduced-motion`.
