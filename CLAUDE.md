# KAIRO / Architecture of Time

## Everything is on the grid

The `--cell` grid is the interface. Every UI component must sit on it.

**The rule:** any element that is not part of the poster artwork itself must have its
position **and** its size land on grid lines. No exceptions, no "close enough".

That covers all of the interface chrome: the logo, the format control and its menu, the
question panels, dials and other controls, hints, buttons, the reset and status text,
overlays, apertures, tooltips, and anything new added later.

**Exempt:** the poster's own contents inside the sheet (the artwork, the dot field, the
generated layers). Those follow the composition, not the lattice.

### How to place something on the grid

The grid's phase comes from `gridOrigin()`, not from the viewport edge, so the screen
edge never lands on a line. Always snap against the phase:

```js
const cell = cellSize(), o = gridOrigin();
const phaseX = ((o.x % cell) + cell) % cell;   // first vertical line at or after x = 0
const phaseY = ((o.y % cell) + cell) % cell;   // first horizontal line at or after y = 0

const left = phaseX + Math.round((wantX - phaseX) / cell) * cell;
const top  = phaseY + Math.round((wantY - phaseY) / cell) * cell;
```

See `placeChrome()` in [architecture-of-time.html](architecture-of-time.html:3507) for
the reference implementation.

Rules that follow from it:

- **Sizes are whole cell counts.** Write them as `N * cell`, never as a hard px value
  that happens to look right.
- **Assign the snapped value unrounded.** Rounding to whole pixels, or even to 2dp,
  pushes an element off the line.
- **Re-snap on resize and on format change.** `--cell` is a function of the viewport
  alone, so anything placed once at load will drift.
- **Padding and gaps inside a component are cell fractions** (`calc(var(--cell) * 1.1)`,
  `Math.round(cell * 0.382)`), so the component still breathes with the grid.

When a design comes from Figma, convert its px measurements to cell counts first, then
place. Do not reproduce the raw px offsets.
