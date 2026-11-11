# Ledger Reconciliation – Customer View Prototype

Customer-side Ledger Reconciliation for Vedanta Metal Bazaar, shown for customer **MAHAVEER (777)**.
A switch at the top moves between the Supplier, RFM and Customer views. All three share demo state in the browser, so a verification here appears in the RFM worklist; **Reset demo** restores the original data.

- **Half-yearly periods** (REQ-06): HY1 (Apr – Sep) and HY2 (Oct – Mar), each with Opening and Closing Balance and status.
- The expanded row keeps the existing columns (Ledger Report, Verify By, Uploaded File, Verified Customer's File, Remarks, Action) and adds TDS Status. Verify By also shows the date the request was emailed (5th of the following month, REQ-04).
- Statuses: **Pending**, **Exception Raised**, **Verified** (Verified only once HZL's RFM has verified).
- **CN/DN tab** (REQ-12): Type and Posting Month filters with APPLY, Clear All and Export Data, then the digitally signed CN/DN PDFs with multi-select bulk download.
- **Two-party verification** (REQ-03): the customer verifies or raises an exception first; HZL (RFM) verifies after. A step tracker shows both steps with timestamps, and Verify / Raise Dispute lock once used.
- **Verify Confirmation** has a Verification Type dropdown: *No difference*, or *Difference due to TDS* (TDS amount plus a TDS certificate upload). A **TDS Status** column shows the certificate and HZL's review.
- **Verify Confirmation** and **Raise Exception** popups follow the existing VMB popups: declaration text, optional Remarks, and a required file upload (.csv, .xlsx, .txt, .doc, .docx, .jpg, .png, .jpeg, .pdf) with an "uploaded successfully" message and a remove (×) option.
- **Balance Confirmation** download in the standard format (REQ-07) sits next to the ledger download.

Demo data only. Open `index.html` in a browser.
