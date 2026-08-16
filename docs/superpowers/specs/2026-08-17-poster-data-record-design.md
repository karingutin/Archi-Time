# The data record — design

**Date:** 2026-08-17
**Status:** approved, ready to plan

The finished poster gains a band along its foot carrying the session's answers as
one run of uppercase text, the items separated by `\\`. The band sits on plain
paper: no grid, no layer, nothing else reaches into it.

Reference: Karin's mock, 16 Aug. The mock is a real session — its nine answer
items are exactly the ten questions a default session asks, less the colourway.

---

## 1. What the band says

One item per question that was **answered**, in the asking order, then three items
of session metadata. A question that was **skipped** contributes nothing. The
colourway contributes nothing either: the poster is already the colourway, and
naming it is the one item that says nothing the sheet does not already say.

Items are joined by ` \\ `. Every item is uppercase. British spelling.

### Answer copy

| id | answer | item |
|---|---|---|
| `shape` | `square` | `TIME MOVES ON WITHOUT YOU` |
| | `circle` | `TIME CARRIES YOU WITH IT` |
| `density` | `little` | `TOO LITTLE TIME` |
| | `enough` | `ENOUGH TIME` |
| | `plenty` | `PLENTY OF TIME` |
| `month` | `May` | `FAVOURITE WEATHER 22C OR 72F IN MAY` *(template)* |
| `febdays` | `31` | `31 DAYS IN BIRTH MONTH` *(template)* |
| `alarms` | `0` | `NO SNOOZE IN THE MORNING` |
| | `1` | `1 SNOOZE EVERY MORNING` |
| | `2`..`12` | `10 SNOOZES EVERY MORNING` *(template)* |
| `decades` | `10` | `1 DECADE AHEAD` |
| | `20`..`100` | `5 DECADES AHEAD` *(template)* |
| `vacations` | `1` | `1 CORE MEMORY` |
| | `2` | `2 CORE MEMORIES` |
| | `3` | `3 CORE MEMORIES` |
| | `4+` | `4+ CORE MEMORIES` |
| `sixweek` | `<45` | `WEEK SUPERIORITY` |
| | `45..55` | `WEEK AND WEEKEND EVEN` |
| | `>55` | `WEEKEND SUPERIORITY` |
| `saying` | `Trust` | `TIME IS TRUST` |
| | `Worry` | `TIME IS WORRY` |
| | `Regret` | `TIME IS REGRET` |
| | `Presence` | `TIME IS PRESENCE` |
| `colorway` | — | *(no item)* |

The tail binaries are written too, so raising `QUESTIONS_PER_SESSION` needs no
copy work:

| id | a | b |
|---|---|---|
| `gaze` | `LOOKING BACKWARD` | `LOOKING FORWARD` |
| `reserve` | `MORE TIME BEHIND` | `MORE TIME AHEAD` |
| `trust` | `CLOSER TO TRUST` | `CLOSER TO WORRY` |
| `today` | `A DAY TO REMEMBER` | `A DAY THAT BLURS` |
| `novelty` | `MORE REPEATS THAN NEW` | `MORE NEW THAN REPEATS` |
| `supply` | `RUNNING OUT OF TIME` | `MORE TIME THAN NEEDED` |

The month item reads its two temperatures from `MONTH_TEMPS`, the table the month
layer already indexes, so the celsius and the fahrenheit on the poster are the
same pair the silhouette was set from. The decades item is the bar's answer in
years divided by ten; the bar's stops are decades and the item names them as
such. Singulars are written out per value rather than pluralised by rule
(`1 CORE MEMORY`, `1 SNOOZE`, `1 DECADE AHEAD`).

### Metadata copy

Three items, always, in this order:

```
10 SECONDS AVERAGE TO ANSWER A QUESTION
01:45 MIN TO COMPLETE THE EXPERIENCE
SUN 16 AUG 13:55 2026 THE YEAR OF THE HORSE
```

- **Average.** Seconds, rounded, over the questions that were answered. A question's
  time runs from the moment its card opens to the moment it is banked; time spent
  with no card open belongs to nobody and is not counted. Revisiting a question
  adds to its own total rather than starting it over.
- **Total.** `MM:SS` from the Begin press to the Create press. Begin, not page
  load: the wait before someone starts is not part of the experience.
- **Stamp.** Day, date, month, 24h clock, year, and the Chinese zodiac animal of
  that year, from a table of twelve keyed by `year % 12`. Taken at the Create
  press, not at page load.

The three are written even when nothing else is: a session where every question
was skipped still carries its own duration.

---

## 2. Where the band sits

The sheet's outer rectangle does not move. It is 14 x 20 cells at Sheet format
and its four edges stay on the interface grid, as they always have.

On Create:

- The **artwork** scales **uniformly by 12/14**, anchored one cell in from the
  sheet's top-left corner. It therefore stands one cell clear of the top, the
  left and the right.
- The **band** is the sheet's bottom **two rows**, full width, in the paper
  colour. Its top edge is the artwork's cut line: the artwork runs 0.14 cell past
  it and is clipped there, so nothing from the artwork enters the band.
- The band's **text** is inset one cell from the left and the right, so its column
  is 12 cells wide — the artwork's own width.

The scale is one factor on both axes by decision. Insetting one cell on each of
the four sides separately would mean 0.857 across and 0.9 down, and every circle
on the sheet would come out an ellipse.

Cell counts are per format; every number above is `cell = w / cols`, so the band
is two rows and the inset one column at each of the four formats.

### Type

Helvetica, the poster's one face, the same the word layer sets. Uppercase, in
the **blue ink role**, on paper. Three lines, flush left, wrapped by measured
advance rather than by the browser (SVG `<text>` does not wrap). **At most three
lines**: a short run takes one or two and the block stays vertically centred in
the band. The band's height is fixed, so the **size adapts** — the run is set at a
nominal size, wrapped, and if it needs a fourth line the size steps down until it
fits in three. Line pitch and the block's centring inside the two rows are
fractions of the cell.

---

## 3. How it arrives

The band is not a separate screen. It arrives on the same beat the board already
turns over on:

- The artwork's retreat runs on `--flip` (460ms) with `--eo`, the same duration
  and curve as the ground going to its negative. One movement, not two: the page
  reads as having zoomed out.
- The text is written after the retreat lands, letter by letter, on the word
  layer's own mechanics (`sayingDelay`, the eased sequence) so it reads as being
  written rather than switched on.
- Reduced motion cuts both, as it cuts the flip.
- **Back** (`hideFinish`) reverses it: the artwork returns to full bleed and the
  band empties, on the same beat.

### Where the transform lives

The retreat is a CSS transition on a `<g>` in the poster markup, driven by
`body.made` — the class `showFinish` already sets. This keeps `showFinish`'s
existing property that it asks for no redraw: the group is in the markup from the
first paint carrying no transform, and the class supplies the finished one. The
numbers are format-dependent, so they reach CSS as custom properties written by
`syncSheet`/`relayout` (px in an SVG resolve as user units).

The **export** carries no CSS, so `buildSVG` bakes the transform and the band
inline when asked for an export. One flag, two callers (`exportSVG`,
`exportRaster`).

---

## 4. Where the code lives

| file | what |
|---|---|
| `js/app/63-record.js` *(new)* | the copy tables, `recordLine()` (the joined string), `recordLayer(B,C)` (the band's markup, including the fit-to-width measurement), and the zodiac table |
| `js/app/51-flow.js` | the clock: start on Begin, per-question spans on `openQuestion`/bank, stamp on Create |
| `js/poster/30-svg.js` | wrap the art in the retreat group; append `recordLayer`; the export-baking flag |
| `css/00-ground.css` | the retreat transition and the band's write-in, beside the existing flip rules |
| `js/app/61-relayout.js` | write the format's retreat numbers as custom properties |
| `js/app/70-collect.js` | pass the baking flag from the three export paths |
| `architecture-of-time.html` | one `<script>` tag for the new file |

`63-record.js` sits in `js/app/` beside `62-hover-notes.js`, which is the other
file holding per-answer copy. It loads before the first draw (boot is 72), which
is all `buildSVG` needs.

The timings also go into `payload()` as `context.duration_ms` and
`context.per_question_ms`, so the record in storage says the same thing the
poster does.

---

## 5. What this changes that was true before

Two comments in the code state the opposite of this design and must be corrected
rather than left to rot:

- `buildSVG`'s header: *"The poster carries no identifying text ... everything
  identifying is kept in the data record, not on the artwork itself."* The data
  record is now on the artwork. The claim that the poster's one piece of
  typography is the word pair is also no longer true.
- `showFinish`'s header: *"NOTHING ABOUT THE POSTER CHANGES HERE. Not the sheet,
  not the format, not a single layer — no redraw is even asked for."* No redraw is
  still asked for, but the poster does change: it retreats and gains its band.

---

## 6. Out of scope

- The interface chrome does not move. The KAIRO mark, the dots, the reset and the
  status stay where the grid puts them; only the artwork inside the sheet
  retreats. The zoomed-out feeling comes from the artwork, not from scaling the
  board, which would take the sheet's edges off the grid.
- No new question, no change to the bank, no change to any layer's own geometry.
- The band does not appear during the asking. It exists only past Create.
