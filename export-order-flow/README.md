# Export Order Flow Prototype

Clickable prototype of the planned order flow for Vedanta Metal Bazaar, with three roles and two approval levels.

- **Customer** logs in, opens the catalog, clicks **Buy Now**, and on the PDP picks the MoU, variant, quantity and delivery month (current month plus the next 3).
- **Add to Cart** keeps the customer on the PDP. **Plan Order** goes straight to the cart page, where quantity and delivery month carry over from the PDP.
- On the cart page the customer splits the quantity across price types (**Day CSP, Monthly Average, M-1**). **Plan Order** creates the PO with status **Created** and opens the PO listing.
- **ASM** (approver 1) can **Edit, Approve or Reject** the PO. Approval sends it to the RM.
- **RM** (final approver) approves or rejects. On final approval the PO becomes **Approved**, the customer gets **Create Delivery**, and one entry per price type is created on the **Price Bookings** listing.
- Clicking a PO ID shows the approval timeline and history. The bell notifies each role when something needs its attention.

Prototype logins (password `demo123`): `customer@lqmetals.com`, `asm@vedanta.com`, `rm@vedanta.com`. Switch roles from the avatar menu; **Reset demo data** restores the sample orders.

Demo data only. Open `index.html` in a browser.
