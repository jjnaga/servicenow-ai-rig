# Change Freeze Windows: Current State and What We Need

Prepared by: Group Change Management, Information Technology
For: the platform team

## 1. How it works today

Each operating company declares periods when changes to its platforms must stop. We call these
freeze windows. Today they are declared three different ways and none of them agree:

- An email to the change managers' distribution list, usually from the opco's IT lead.
- A tab in a shared spreadsheet ("Freeze Calendar FY26") that four people can edit and nobody owns.
- Verbally, in the Thursday change review, which is the only place some of them are ever mentioned.

The result is that when a change is raised, the change manager does not reliably know whether the
target platform is frozen. We find out at the review, or after the change has already been scheduled.
Twice last year we found out after it had been implemented.

We raise roughly eight to twelve freeze windows per quarter across the group.

## 2. What a freeze window actually is

A freeze window names one or more of our business applications and a date range during which no
normal changes may be scheduled against them. Every window has a reason. In practice the reasons
fall into five kinds, and we would like to keep exactly these five:

- **Year-end close** — the finance close cycle.
- **Regulatory reporting** — a filing window where the reporting platform must not move.
- **Peak season** — the venues and the ticketing platforms during their busy periods.
- **Migration** — a planned platform migration where we hold everything else still.
- **Incident recovery** — declared after a major incident while we stabilise.

## 3. The rules we work to

These are the rules the change managers already apply by hand. We want them applied by the system.

1. **A window may not be back-dated.** If the start date is already in the past when the request is
   submitted, it is not a freeze window, it is an excuse. Reject it.

2. **Two windows for the same application may not overlap.** If somebody asks for a window that
   overlaps an existing approved window on the same application, we need to know at the moment they
   ask — not at the Thursday review. Today this is the single biggest source of argument. Note that a
   request can name several applications at once, and it may conflict on one of them and be perfectly
   fine on the others.

3. **A window longer than fourteen days needs the application owner to approve it.** Short windows
   are routine and the change managers handle them. Long ones stop other people's work, so the person
   who owns the platform has to agree. The owner is recorded on the application record; use that,
   do not ask the requester to type a name.

4. **A window that covers a month-end and touches a finance-critical platform also needs the Chief
   Financial Officer to approve.** Month-end is the last calendar day of any month that falls inside
   the window. Our finance-critical platforms are **Group Core Ledger**, **Group Financial
   Consolidation** and **Group Regulatory Reporting**. This is a second approval on top of rule 3,
   not instead of it — a nineteen-day window over a month-end on the Core Ledger needs both. Our CFO
   is the Group Chief Financial Officer; the platform already knows who that is.

5. **Year-end close windows do not need approval at all.** Group Finance publishes the close
   calendar; by the time it reaches us it is already decided. It still has to pass rules 1 and 2.

## 4. What we want

One place to request a freeze window, and one place to look at the calendar.

The request should ask for the applications, the start and end date, the reason, and a short
explanation. Everything else the system should work out for itself — who approves, whether it
conflicts, whether it is allowed at all.

Once a window is approved we want it visible. The specific question a change manager needs answered
in under ten seconds is: *"is this platform frozen on this date, and if so, why, and who approved
it?"* Today that takes a phone call.

Fulfilment sits with Group Change Management. They are the team that maintains the calendar today
and they should stay the owners of it.

## 5. What we are not asking for in this phase

We are **not** asking you to block or reject actual change records yet. We know that is the eventual
prize and we will come back for it. Right now we cannot enforce anything because we do not have a
trustworthy calendar to enforce against — so build us the calendar and the approvals first. Getting
this wrong in the enforcement layer would stop legitimate work across the group, and we would rather
earn that in a second phase once the calendar has been right for a quarter.

We are also not asking for anything to be sent to the opco IT leads automatically. The Thursday
review is still where this gets discussed. Notifying the people involved in an individual request is
sensible; broadcasting to the group is not.
