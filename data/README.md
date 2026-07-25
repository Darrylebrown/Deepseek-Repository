# Drop zone

Agent output lands here. Anything a Claw or DeepSeek run produces that the team should
pick up for Gullah Geechee Biz KDP and social packaging goes in one of the folders below —
not in `out/`, which is gitignored and local only.

Author: Darryl Elliott Brown · Publisher: [Gullah Geechee Biz](https://gullahgeecheebiz.com/)

## Folders

| Folder | What goes in it |
| --- | --- |
| [`volumes/`](volumes/) | Book-length manuscripts and volume drafts headed for KDP. |
| [`social/`](social/) | Social calendars, post batches, and caption sets. |
| [`packs/`](packs/) | Culture pack drafts, including output from `scripts/ggb_pack_draft.py`. |

Each folder has its own README with the details for that format.

## Naming

- Lowercase, hyphen-separated, no spaces: `sweetgrass-basket-weaving.md`
- Date-lead anything time-bound: `2026-08-social-calendar.md`
- Keep the `.json` and `.md` stems matched when a drop has both.

## Brand rules

Every file in this drop zone is held to the same standards as published work:

- **Culture first.** Heritage, craft, place, and community lead. Commerce is secondary.
- **One soft CTA at most,** pointing only to https://gullahgeecheebiz.com/
- **No mock dialect.** Clear, dignified standard English. Never phonetically spell Gullah
  Geechee speech, and never put invented quotes in anyone's mouth.
- **No celebrity or public-figure name-drops.**
- **No invented statistics, dates, or citations.** If a detail is uncertain, say so.
- **No Manus links, and no tooling, platform, or vendor mentions** in any shippable copy.
- Respect living traditions and the Gullah Geechee Cultural Heritage Corridor.

A draft that breaks any of these is not ready to hand off. Fix it in place.

## Signalling ready

Everything here is a draft needing human review until it is marked otherwise. Two ways to
signal that a drop is ready for Computer to package:

1. Leave a `READY.md` in the folder listing which files are ready and what they need.
2. Optionally prefix the filenames themselves: `READY_2026-08-social-calendar.md`

Either works. The prefix is a convenience, not a requirement — `READY.md` is the signal
that matters.

See [`INBOX.md`](INBOX.md) for what happens to a drop after it is marked ready.
