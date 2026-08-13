# One-shot prompt — NGB Source-to-Pay foundation implementation

Morning — Controllers' Office standup ran long, here's where we landed.

The BSA team finished Source-to-Pay discovery. Requirements are signed off at
`enhancements/NGB-S2P-OPS/BUSINESS_REQUIREMENTS.md`, with the live install audit beside it at
`enhancements/NGB-S2P-OPS/S2P-INSTALL-MAP.md`. The S2P Operations product is already installed on
our instance — nobody has configured a single thing on it yet. Tiare's team and Bruno's office are
waiting on the foundation.

Your job today: implement it. All 46 requirements, the six acceptance journeys, the negative
controls. This is OOB configuration of the installed product — roles and groups, master data,
approval policy, the supplier book, the requisition-to-receipt spine, one sourcing cycle,
procurement cases, the invoice checkpoint, dashboards. The spec is explicit and so am I: **no
custom apps, no custom tables, no custom columns.** If a requirement cannot be met with the
installed product, write down why and move on — a documented negative beats a workaround nobody
asked for.

Work the rig's law (`CLAUDE.md`, `codex/servicenow.md`, `codex/addendum-2026-08-11.md`,
`codex/instance-profile.md`). Capture configuration in a named update set. Prove journeys with
read-backs, never assertions. This repo is self-contained — do not read or reference anything
outside it except the instance credentials env. When you're done, write
`enhancements/NGB-S2P-OPS/IMPLEMENTATION_REPORT.md` for Tiare and Bruno — what works, what's
proven, what isn't, straight about every gap.

You have the day and full autonomy — no check-ins. Go.
