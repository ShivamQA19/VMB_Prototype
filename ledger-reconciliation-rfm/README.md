# Ledger Reconciliation – RFM View Prototype

RFM (Relationship / Finance Manager) view of Ledger Reconciliation for Vedanta Metal Bazaar. It completes the two-party flow in REQ-03: the customer verifies or raises an exception, then the RFM verifies.

- **Worklist** for the selected period (HY1 / HY2) with tiles: Awaiting your verification, Exceptions to resolve, No customer response, Verified.
- **Lists**: Action required, Customer verified, TDS difference, Exceptions, No response, Verified, All, plus Region and search. Oldest waiting items come first; items waiting over 7 days are highlighted.
- Each row shows the customer action, closing balance, TDS difference, **DO Check**, days waiting and status.
- **Review & Verify** popup: period details, DO Check, TDS status, documents (ledger, Balance Confirmation, customer file, TDS certificate), remarks, and the two-step tracker.
  - TDS difference: the RFM ticks that the certificate was checked.
  - Exception: resolution remarks are required.
  - **Add Remark** and **Extend Date** (the DO check stays allowed until the new date for an open exception).
- Verifying locks the reconciliation and updates the **customer** and **supplier** views straight away.

## Shared demo state
The customer, RFM and supplier views share their state in the browser (`../shared/recon-store.js`), so you can run the full flow across them, even in separate tabs. **Reset demo** in the top bar restores the original data.

Demo data only. Open `index.html` through a web server (for example GitHub Pages) so the views can share state.
