# Landing → board: the grid forming

Porting the approved `edges` film from `grid-transition-demo.html` into the real
app. The demo is the reference for timing and behaviour; nothing in it changes.
What changes is where each phase runs, because the real board is not one canvas.

## What the real app already has

| the demo draws on canvas | the real app |
|---|---|
| the small-square lattice | `#heroField` canvas inside `#landing` (`js/app/50-landing.js`) |
| the KAIRO letters and START | DOM: `.klogo .kt` and `.kstart` |
| the interface gridlines | `.gridlayer`, a CSS background on `.world` |
| the sheet's four rules | `.sheet-lines i` — four `<i>` on `.world` |
| the paper | `#frame`, holding the two SVG plies |
| question one's card | `#qsys` — the panel and its marker |

So the film is cut in two: the grid run stays on a canvas inside the landing,
and the poster's arrival runs on the real DOM.

## The sequence

**1–2. The grid runs.** START starts the film. A new canvas `#gridRun` sits in
`#landing` where `#heroField` was, and paints the identical resting square field
— same `--cell`, same phase `(W/2) % cell`, same mark size, same `--line` tone.
Then every horizontal line runs top to bottom, staggered `RUN_STAIR_H = 6` ms
apart, each crossing in `RUN_DUR_LINE = 480` ms on an eased-out cubic, with a
darker `RUN_HEAD = 2.2 cell` running tip. The verticals begin when the last
horizontal has **landed** — `RUN_LANDED = 0.82` of its ease, by which point it
has travelled 99.4% of the width — rather than when its ease arithmetically
ends; waiting for that tail put a dead beat between the two passes. A square
dies the instant a covered segment passes through its junction. The KAIRO tiles
are DOM, so they die by class — `.cut` sets `visibility:hidden`, a cut and not a
fade — when a line crosses their box.

**The handover.** The finished canvas is pixel-for-pixel what `.gridlayer`
paints: same phase, same `--gridline`, 1px. `finishBase()` runs, `#landing`
goes, and the canvas is removed on the following frame. No seam.

**3–5. The four rules, and one front.** The real `.sheet-lines i`, each running
the full height or width of the screen — not a frame around the sheet.
`transform: scaleY(0)` with `transform-origin: top` for the two verticals,
`scaleX(0)` / `origin: left` for the two horizontals, released in the order left,
right, top, bottom at `ARRIVE_STAIR = 90` ms apart over `ARRIVE_DUR = 620` ms.

The last of them — the bottom rule, sweeping left to right — carries the whole
board. `.stagebox` is clipped to `inset(0 100% 0 0)` and opens on the same
duration, curve and delay, so the two fronts are one front: the question column,
the KAIRO mark and the poster's paper are each uncovered exactly as the line
reaches them. The questions sit left of the sheet, so they come up first and the
paper colours in after them.

For the two fronts to coincide and not merely be close, `.arrive` pulls the
rules in to span exactly the viewport (`left/right: var(--over)`); they normally
run the world's full extent so panning never shows an end, which would otherwise
put the rule's front 160px away from the wipe's the whole way across.

The fixed chrome — status, Reset, the format control — is not on the board and
cannot be carried by the wipe, so it cuts in on the beat the front sets off
(`.arrive-lit`).

The question system's own arrival — `renderSnake`'s four-part trickle — is
suppressed for this one render (`renderSnake.last` is pre-set to question one),
because the wipe is already carrying the panel in and a stagger on top of it
would be two notations for one event.

Every duration and delay is written to CSS by the film (`--arrive-stair`,
`--arrive-dur`, `--arrive-beat`), the way `--cell` is: the timers that add the
classes and the transitions they release have to agree about the beat, so one of
them owns the number.

## Files

- `js/app/57-transition.js` — new. The whole film: the line model, the collect
  pass, the paint, and the DOM arrival that follows it.
- `architecture-of-time.html` — one `<script>` tag, after `56-tilt.js`.
- `js/app/50-landing.js` — `advanceLanding()` plays the film instead of calling
  `finishBase()` directly.
- `css/20-aperture.css` — `#gridRun`, and `.cut` on the tiles.
- `css/10-chrome.css` — the arrival state: the rules, `#frame`'s clip, the
  chrome's cut-in.

## Decisions

- `?skip` stays instant. It is a development shortcut and has no film.
- Reset returns to the opening screen; the next START plays the film again.
- `prefers-reduced-motion` — no film at all, the handover is immediate, exactly
  as it is today.
- A resize mid-film jumps straight to the end rather than replaying — but only
  when the viewport has actually changed size. A bare `resize` listener cut the
  film off at its second frame: browsers fire the event for things that are not
  a resize, and a phone's URL bar sliding away fires it constantly.
- The demo's constants were the starting point and are not the shipped ones
  (Karin, 17 Aug: faster, and no gap between the two passes). The film now runs
  about 2.1s at 1280×720 — roughly 1.24s of grid and 0.89s of arrival — against
  the demo's 4.3s.

## Trap

Every measurement must come from `cellSize()` and the origin phase, per
CLAUDE.md — never from the demo's hard-coded `CELL = 20`.
