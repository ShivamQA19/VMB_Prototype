# Ledger Reconciliation – Group-wise Prototype (REQ-01)

Clickable prototype of the group-wise Customer Reconciliation view for Vedanta Metal Bazaar.
Navigation: **Reports → Financial → Ledger Reconciliation**. The existing tab is enhanced; there is no separate dashboard tab.

- **Customer Group** is a searchable dropdown (name or code) and must be picked first. Customer Code, Customer Name, Status, Region and Duration stay disabled until then.
- Picking a group fills **Customer Code** and **Customer Name** with every customer in the group and loads the listing.
- Unticking a code or name removes that customer's rows. Status, Region and Duration apply on **APPLY**. **Clear All** resets the page.
- Rows follow the Ledger Reconciliation layout: Duration, Opening / Closing Balance, Customer Code / Name, status and expand (TDS/TCS removed). 6 records per page.
- The expanded row shows Ledger Report, Verified On, Customer Feedback, Remarks and Add Remark.
- **Duration** is half-yearly: HY1 (Apr – Sep) or HY2 (Oct – Mar).
- A group with no name shows its group code instead of "NA".
- Proposed for review: status summary chips, group status such as "Pending (2 of 6 verified)", and Duration defaulting to the current half-year.

Demo data only. Open `index.html` in a browser.
