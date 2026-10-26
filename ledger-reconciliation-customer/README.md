# Ledger Reconciliation – Customer View Prototype

Customer-side Ledger Reconciliation for Vedanta Metal Bazaar, shown for customer **MAHAVEER (777)**.
A switch at the top moves between this view and the supplier (HZL Console) view.

- **Half-yearly periods** (REQ-06): HY1 (Apr – Sep) and HY2 (Oct – Mar), each with Opening and Closing Balance and status.
- The expanded row keeps the existing columns: Ledger Report, Verify By, Uploaded File, Verified Customer's File, Remarks, Action.
- **Two-party verification** (REQ-03): the customer verifies or raises a dispute first; HZL (RFM) verifies after. A step tracker shows both steps with timestamps, and Verify / Raise Dispute lock once used.
- **Verify** asks the customer to confirm the closing balance, with an optional signed Balance Confirmation upload.
- **Raise Dispute** needs a reason and a supporting PDF (PDF only, up to 5 MB).
- **Balance Confirmation** download in the standard format (REQ-07) sits next to the ledger download.
- A banner reminds the customer of pending confirmations and the Verify By date.

Demo data only. Open `index.html` in a browser.
