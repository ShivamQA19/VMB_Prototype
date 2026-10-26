# Ledger Reconciliation – Customer View Prototype

Customer-side Ledger Reconciliation for Vedanta Metal Bazaar, shown for customer **MAHAVEER (777)**.
A switch at the top moves between this view and the supplier (HZL Console) view.

- **Half-yearly periods** (REQ-06): HY1 (Apr – Sep) and HY2 (Oct – Mar), each with Opening and Closing Balance and status.
- The expanded row keeps the existing columns: Ledger Report, Verify By, Uploaded File, Verified Customer's File, Remarks, Action.
- **Two-party verification** (REQ-03): the customer verifies or raises a dispute first; HZL (RFM) verifies after. A step tracker shows both steps with timestamps, and Verify / Raise Dispute lock once used.
- **Verify Confirmation** and **Raise Dispute** popups follow the existing VMB popups: declaration text, optional Remarks, and a required file upload (.csv, .xlsx, .txt, .doc, .docx, .jpg, .png, .jpeg, .pdf) with an "uploaded successfully" message and a remove (×) option.
- **Balance Confirmation** download in the standard format (REQ-07) sits next to the ledger download.
- A banner reminds the customer of pending confirmations and the Verify By date.

Demo data only. Open `index.html` in a browser.
