# Architecture of Time — working rules

Decisions taken while building the question system. They are enforced in
`architecture-of-time.html` and explained in comments beside the code that holds
them, but the *reasoning* lived only in conversation until now. Read this before
changing layout, colour or copy: most of these were arrived at by trying the
other thing first.

---

## The grid is the design

The interface lattice and the poster's format are **the same cell**. Cell counts
per format are therefore a design decision about the lattice's coarseness, not
just about the poster:

| format | cells | ratio |
|---|---|---|
| Sheet 7:10 | 14 × 20 | 0.700 exact |
| A-series | 12 × 17 | 0.7059 (1:√2 is 0.7071) |
| Portrait 4:5 | 12 × 15 | 0.800 exact |
| Story 9:16 | 9 × 16 | 0.5625 exact |

`CELL = 75` poster units, so the sheet is still 1050 × 1500 — the exported
poster is byte-identical to the pre-change version.

- `cellSize()` is a function of the **viewport alone**, never of the format. That
  is what keeps the lattice still through a format change.
- The poster is **centred** on the grid origin. It was anchored right once to buy
  the question panel width; that was rejected. Do not move it without asking.
- Its display size is `0.78` of viewport height. Shrinking it to `0.62` to widen
  the band was also tried and rejected — a finer lattice over a smaller poster
  reads wrong.

## Nothing of the interface may touch the poster

Tested against `unionBox()` — the largest footprint **any** format can take, not
the one currently showing. So a format change can never bring the poster onto a
question. Every layout change must keep `touchesPoster: 0` at 1920×1080,
2560×1440 and 1512×982.

## The snake

Question markers descend **lengthwise**, one row per question, the column
alternating between two so every step is a diagonal of one cell and consecutive
markers meet at a corner.

- A horizontal run was tried (nine markers across). It cannot work beside a
  centred poster: nine markers plus an eleven-column figure needs twenty
  columns and the band has thirteen.
- The turn is a **triangle wave**, never a sawtooth: restarting on the edge
  column would put two questions in the same column, and a step that does not
  change column is a vertical step — which breaks the corner rule.
- `SNAKE.top` drops the whole run from the top of the viewport, clamped so the
  last question's Save can never fall off the bottom.
- **Currently one lane, not two** — widening the panel to ten cells spent the
  second column. `lanes = 14 − spanW`. Getting the zigzag back means a
  nine-cell panel.

## The composition hangs off corners

Marker → total → panel → Save, each starting exactly where the previous one
ended. Nothing is centred against anything and nothing is spaced by a gap. If a
part ever has to be placed somewhere else, the figure has stopped being one
figure — that is a signal the geometry is wrong, not a thing to paper over.

## One hug for the whole panel

`Q_INSET` is the **only** inset any child of the panel may use — the title, the
hint, the month circles, the binary's cells, and the wheel's arc. A shared edge
is the only thing that says they belong to one panel.

- The wheel's radius is **derived**, not chosen: its widest point is where the
  panel's lower edge cuts it at ±70°, so `r·sin70 = W/2 − Q_INSET` puts the
  arc's ends on the same line as the title's first and last letter.
- What must fit vertically is the **topmost thing drawn** — the label ring sits
  19% outside the arc and the chosen value above that again. Fitting the arc
  alone let the labels climb into the question's text.
- Where a panel's height is pinned (`PANEL_H_FIX`), the control is fitted to the
  room left, never the reverse. Pin heights so the safety cap stays **off**: while
  it binds, the month grid comes out narrower than the hugged width and its side
  inset stops matching the text's.

## Proportions come from the Figma nodes

Every type value is that drawing's pixel measure over its own width, times the
panel's cells — so they are proportions and hold at any cell size. From node
`2739:3508` (365 × 263, ratio 1.388):

```
inset 15/365 = 0.411   title 22/365 = 0.603   leading 32/365 = 0.877
hint 13.5/365 = 0.370  hint leading 20/365 = 0.548   gap 15/365 = 0.411
```

## One palette, one face

- Change a colour **once** and the whole interface follows. The opening screen
  used to declare its own inverted set and was left behind; it now inherits
  `--ink` / `--fg` / `--dim` / `--line` from `:root` like everything else, and
  the aperture canvas reads `--sheetline` and `--line` rather than hard-coded
  white.
- Ground `#EDEAE3`, lattice `#D7D4CC`. Question system: `--q-past #FFC5C5`,
  `--q-now #FF6060`, `--q-panel #FFFFFF`, `--q-text #FF0000`.
- The hint is the **same red as the question**; size alone makes it secondary.
- Everything is **Wix Madefor Display**. `--display`, `--ui` and `--mono` all
  resolve to it; the three names are kept because the code says which voice it
  is speaking in. Only the poster loads a face of its own
  (`ThermoTrial-Zero`, and only to be rasterised into a mask).

## A question answered by picking a card has NO default

- The wheel is a scale and its pointer has to be somewhere, so a count opens on
  a value.
- A row of cards is not a scale. One sitting pre-chosen is an answer nobody
  gave, and Save would bank it. So nothing is registered until the person picks,
  **Save stays shut** until they do, and controls compare against the registered
  answer — never the bank's fallback, or a card would light up before it was
  picked.

## Everything cuts

No dissolves. `visibility`, not `opacity`; whole cells, not sub-pixels. The
opening screen's `HERO_BEAT` of 110ms is the whole piece's clock, and the
panel's trickle-down (marker → total → panel → Save) is a stagger of it.

**Reveals run on timers, not CSS animations.** A CSS animation is *paused* in a
backgrounded tab and its fill-mode held the from-state — that is how the `/9`
cell disappeared. Whatever hides a thing must be the same thing that shows it
again.

## The poster's own layers

Three questions reach the artwork and no others:

| question | control | what it moves |
|---|---|---|
| month | 12 circles | the letterforms of the layer over the grid |
| alarms | wheel, 1–12 | the node's ray count |
| happiness | wheel, 1–10 | the beam count of the sculpture on top |

Each of those three tools also has **one** control the answer does not move
(`ROLLS`): the month's scatter falloff, the node's layout seed, the beams' seed.
The Randomize button was removed from the interface along with Skip, so they now
always return their frozen defaults — `rollFor(id)` then `draw()` brings it back.

The month layer **grows in** rather than cutting in: eight builds with the
circles' minimum radius climbing, so the temperature is briefly legible as type
before the forms merge. The ladder's last rung **is** `MONTHL.rMin`, so the
finished poster is identical to a static build. There is a check that warns if
the two ever disagree.

## Copy

- Nine questions. The first three drive the artwork; the rest are recorded and
  draw nothing.
- The small line under a question **opens the question**, it does not describe
  what the answer draws. Two hints that did the latter were rewritten.
- Six of the nine binaries still have no hint.
- Questions are perceptual binaries, not literal opposites — see
  `memory/feedback_amorphous_question_style.md`.

## Development

`?skip` on the URL, or the "Skip to the poster" link on the opening screen,
bypasses the four landing steps with the base answers at their defaults. The
link is visible to every visitor — gate it before this goes in front of anyone.
