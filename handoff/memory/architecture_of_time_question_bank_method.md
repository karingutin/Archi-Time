---
name: architecture-of-time-question-bank-method
description: "Design method agreed for the \"Architecture of Time\" question bank (content categories, interaction types, session rules) before any question text or code was written"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9b666a9f-9d46-4b0b-a49f-1393723f585e
  modified: 2026-07-30T13:40:11.135Z
---

The project [[architecture-of-time-project]] is expanding its question bank (currently only 4 questions live in `architecture-of-time.html`: shape, tod, maturity, smoke) into a 21-question bank built from an explicit method, agreed via a long back-and-forth clarification session on 2026-07-30.

**Why:** the user wants the poster to represent "the user's subjective perception of time," and asked to co-design a cataloguing method before writing any actual question text — she explicitly said to ignore the current visual mechanisms in the code (beads/pixels/color), calling them "just my technical experiments with the interface," so the new question bank is being designed independent of the current rendering code.

Agreed method (v2, final before drafting question text):

- **7 content categories**, equal weight, ~3 questions each (21 total): body & biology, daily rhythm, memory & the past, ritual & cyclicality, finitude & anticipation of the future, time with others, attention & technology.
- **Interaction types (1D only, no 2D deferred for now)**: number/scrubber, duo (binary toggle), position-on-an-axis (no numeric value, just a leaning), card choice (3–5 options), intensity gauge/dial. Each question tagged with (category, interaction type, depth: light/medium/heavy).
- Universal/neutral wording (no Israeli/Jewish-specific references like Hebrew calendar, holidays, army) — accessible to any culture.
- Every category should mix light and heavy questions (heavy = personal/sensitive, like the existing smoking question) — not segregated.
- **Skip is always available** on every question, and leaves a subtle visible mark on the poster (not an invisible gap, not a blank hole) — distinct from an unasked/undrawn question.
- Session draws **10–12 questions** out of the 21-question pool per user.
- **2–3 anchor/pinned questions** stay always-asked (like today's shape + rhythm); the rest are drawn randomly.
- The random draw for a session **must guarantee a mix of light and heavy** depth — not all-heavy or all-light by chance.
- Question **order within a session is fully shuffled** — no fixed light-to-heavy narrative arc.
- The 7-category taxonomy is an **internal/backend organizing tool only** — never shown to the user (no "3 of 12 · body & rhythm" progress indicator).
- Question text itself will be written in **English**, matching the existing code's language.

Further decisions from later rounds in the same 2026-07-30 session:

- **Heavy questions are capped per session** (e.g. max ~2 of the 10–12 drawn) — in addition to guaranteeing at least one light and one heavy, there's also a ceiling so a session can't skew mostly-heavy.
- **Age gate at 16, not 18**: heavy/personal questions (loss, addiction, self-harm-adjacent topics) must never be shown to users under 16.
- **No content boundaries/taboo topics** — everything is open (loss of a loved one, suicidal ideation, violence, etc.) if it serves the piece; the user explicitly said not to pre-limit topics.
- **Branching allowed**: a question CAN change or appear conditionally based on an answer given earlier in the same session (e.g. a follow-up question differs if the user answered "morning" vs "night" earlier) — questions are not required to be fully independent of each other. This was a deliberate choice against the "recommended" simpler independent-questions default.
  - **Refinement**: a branch pair (trigger question + its follow-up) must always be presented back-to-back, consecutively, with nothing else drawn in between them.
  - **Neither question in a branch pair can be skipped** — this overrides the general "skip always available, no cap" rule specifically for branch pairs.
  - This constraint is enforced silently by the system — the user is never shown any indication that these two questions are a linked/mandatory pair; it should just feel like the natural flow of the session.
- **Numeric/scrubber questions use varied units** as fits each question (years, hours, times/day, percent...) — not forced into one consistent unit like "years" for comparability.
- **Skip has no cap** — a user can skip as many of the drawn questions as they want in one session.
- **Each question controls its own visual element independently** — no two answers are combined to jointly drive one visual element (simpler mapping, one question → one encoding).
- **Heavy-question phrasing (direct/blunt vs. softened lead-in) is decided per question individually**, not by a blanket rule — will be judgment calls made while drafting each one.
- **Question length/style varies by weight**: light questions stay short and punchy (5-8 words, like the existing "How do you picture time?"); heavy questions are allowed to be longer and more poetic/evocative.
- **Point of view mixes**: most questions address the user directly ("How do you..."), but some are phrased as more universal/philosophical statements rather than direct second-person address.
- **One-time vs. repeatable experience**: left undecided, explicitly deferred to the assistant ("תחליט") — no firm answer yet, revisit if it comes up again.
- **Category names**: the user doesn't think the 7 categories need formal/poetic names at all ("לא בטוחה שצריך להיות לדבר הזה שם בכלל") — treat them as loose internal groupings for coverage, not a rigid or named taxonomy to defend.
- **Export**: poster save/download as PNG and SVG is wanted and the user is happy with whatever the current code already supports there.
- **The finished poster shows NO words at all** — only shapes and colors. This is a change from the current code, which today prints a text footer (e.g. "MATURITY · 13 yrs") next to the visuals; going forward the poster itself should be purely visual, no labels/values rendered as text.
- Three **separate future interface feature ideas** raised (NOT part of the question-bank method, explicitly set aside for later, do not fold into question design): (1) an end-of-flow hover legend/key that explains what each choice on the finished poster corresponds to (note: this seems in tension with "no words on the poster" — worth reconciling when we get to it, e.g. the legend could live outside/after the poster itself rather than on it); (2) a gallery showing other people's finished posters; (3) a separate onboarding/intro screen, shown before the current dot-based question interface, to help first-time users understand that odd, non-linear interface before they land in it — she called the current interface "a bit strange and not immediately readable."
- The name+age intro step stays, but conceptually it (or a new explainer) should come **before** the user reaches today's dot-grid interface — see feature idea (3) above.

**How to apply:** when next drafting the actual 21 questions (content + phrasing) or touching `architecture-of-time.html`'s `QUESTION_BANK`/session-drawing logic, follow this method exactly rather than re-deriving it — check this file's rules before proposing new questions, and don't reintroduce the old visual mechanisms as if they were a constraint on the new question bank. Remember the two set-aside interface feature ideas (hover legend, posters gallery) when eventually returning to interface/product work.
