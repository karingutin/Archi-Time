# Importing this into another account

Everything here is plain text. Nothing is machine-specific except one path,
noted below.

```
handoff/
  IMPORT.md            this file
  DESIGN-RULES.md      the working rules — read this one first
  memory/              5 files: the persistent project memory
  skills/              4 user-level skills
  config/launch.json   dev-server config for the Browser pane
  docs/                the three specs that predate this build
```

---

## 1. Memory

Claude Code keeps per-project memory in a folder whose name is derived from the
project's **absolute path**, with `/` replaced by `-`:

```
~/.claude/projects/<slug>/memory/
```

On this machine the slug is:

```
-Users-karingu-Wix-Playground-ARCHITIME-Archi-Time
```

On the new account the project will almost certainly sit somewhere else, so the
slug will differ. Two ways to land it:

**a. Let Claude create it.** Open the project in the new account, ask Claude to
save any memory, then copy these five files into the folder it made, replacing
what is there.

**b. Work the slug out yourself.** Take the project's absolute path, replace
every `/` with `-` (the leading slash becomes a leading `-`), and create
`~/.claude/projects/<that>/memory/`.

`MEMORY.md` is the index loaded into context at the start of every session — one
line per memory. Keep it in step with the files beside it; a pointer to a file
that is not there is worse than no pointer.

## 2. Skills

Copy the four folders into the new account's `~/.claude/skills/`. They are
user-level, so they apply across all that account's projects, not just this one:

- `domain-modeling` — domain terminology, ubiquitous language, ADRs
- `grilling` — stress-test a plan or decision
- `grill-with-docs` — the same, against documentation
- `i-have-adhd`

Each has an `agents/` folder with `openai.yaml` (and `gemini.toml` in one case)
for non-Claude harnesses. Harmless if unused.

## 3. Config

`config/launch.json` goes to the project's `.claude/launch.json`. It tells the
Browser pane how to serve the project.

**`settings.local.json` was deliberately left out.** It holds permission grants
made on this machine, which should not follow a project into someone else's
account — the new account should grant its own. If you do want it, copy it by
hand and read it first.

## 4. What is NOT in here

- **`architecture-of-time.html`** — the build itself. It is the deliverable, not
  context; bring it across with the repo. Every rule in `DESIGN-RULES.md` is
  enforced somewhere in it and commented beside the code that holds it.
- **`shapes/`** and the two `.psd` files — source assets, also in the repo.
- **The Figma file.** Sharing is done in Figma's own permissions, not here.
  `DESIGN-RULES.md` cites the node ids the proportions were measured from
  (`2720:3101` for the question layout, `2739:3508` for question 2), so the
  numbers survive even if access to the file does not.
- **This conversation.** Transcripts live under
  `~/.claude/projects/<slug>/*.jsonl` and are not portable in any useful way.
  `DESIGN-RULES.md` is the distillation — it is the thing that would otherwise be
  lost, including the approaches that were tried and rejected and *why*, which
  is the part that stops the next person repeating them.

## 5. First thing to do in the new account

Read `DESIGN-RULES.md`, then open `architecture-of-time.html` with `?skip` on the
URL to land straight on the board without answering the four opening steps.
