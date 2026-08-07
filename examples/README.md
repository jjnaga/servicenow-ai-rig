# Examples

One real enhancement, carried end to end by the loop. Nothing here is a template to fill in —
it is what the artifacts actually looked like, including their rough edges.

## change-freeze-calendar

A business unit needed one place to request a change-freeze window and one place to see the
resulting calendar. Five rules had to be enforced by the system rather than by change managers
applying them from memory: no back-dating, no overlapping windows on the same application, owner
approval past fourteen days, a **second stacked** CFO approval when a window covers a month-end on
a finance-critical platform, and one reason type that bypasses approval entirely.

| File | What it is |
|---|---|
| `intake-document.md` | What the business unit handed over. The requirements as *they* wrote them — not cleaned up, not restructured. |
| `SPEC.md` | The Gate-1 artifact. Interpretation first, technical detail second, open questions at the end. This is the packet a human reads at the gate. |
| `PACKAGE.md` | The Gate-2 artifact. What was built, the update-set identifier and row count, read-back evidence, test results, and the gaps. |

**Worth noticing when you read these:**

- The spec **leads with interpretation**, not with a table list. The gate is a read-through where
  a human checks whether the agent understood the ask — not a yes/no on a work order.
- The open questions are real questions, and some of them changed the build.
- The package names what was **not** proven. That is not hedging; it is the thing that makes the
  rest of the package worth trusting.

This is a real enhancement, not a demonstration built to succeed. No prior solution to it existed
anywhere — on disk, in version control, or on the instance — so the agent had to actually solve
it. The rough edges in these files are the ones the work actually had.

**One honesty note about this particular run.** It was executed as a controlled trial to measure
what the loop produces, so Gate 1 was granted up front rather than by a human reading the spec, and
the run was stopped at Gate 2 without promoting. Both deviations are marked in the artifacts
themselves. Neither gate field on the platform record was ever written — the agent left them
`Pending` and `Not reached`. Read the spec as a complete Gate-1 packet, which is what it is; do not
read it as evidence that a human approved this one.
