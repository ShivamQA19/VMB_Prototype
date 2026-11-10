# Ledger Reconciliation – Supplier (HZL Console) Prototype

Supplier-side Ledger Reconciliation for Vedanta Metal Bazaar, under **Reports → Financial → Ledger Reconciliation**.
A switch at the top moves between this view and the customer view.

- **Period-wise dashboards** (REQ-01 / REQ-06): pick HY1 (Apr – Sep) or HY2 (Oct – Mar); everything below follows that period.
- **Reconciliation Summary** in the same format as the status mail: Region × Pending / Exception Raised / Verified / Total / % Pending.
- **Send Status Mail** button opens a preview of the REQ-02 mail (sent automatically on the 15th and 29th), with the attachment list including Recon Period.
- **Exception alert**: when customers raise an exception that day, a banner shows the evening mail to all RFMs, with a preview listing customer names only.
- **Customer Group** filter auto-fills Customer Code and Name; Status, Region and DO Check filters apply on APPLY. 6 records per page.
- **Status logic**: Pending = no response, or customer verified and awaiting RFM · Exception Raised = customer raised an exception, RFM not yet verified · Verified = RFM verified.
- **DO Check** per customer: TDS-only difference follows the customer's verification; an exception follows RFM verification or the extension date.
- **RFM Verify** unlocks once the customer verifies or raises an exception; exceptions need resolution remarks, TDS cases need the certificate checked. Locked once verified.
- **Extend Date** for one customer, or select several and extend in bulk (REQ-08).
- **CN/DN tab** (REQ-12/13): PDF / Working dropdown, posting-month or invoice-period filter, group and customer filters, multi-select bulk download, and the Credit Note working with a formula-linked Excel download.

Demo data only. Open `index.html` in a browser.
