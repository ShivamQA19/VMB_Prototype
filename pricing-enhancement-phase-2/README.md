# Pricing Enhancement Phase 2 Prototype

Clickable prototype of the Phase 2 pricing changes for Vedanta Metal Bazaar (Lead and Zinc).

## Logins

Sign in with any account below (password **demo123** for all), or click a demo-user tile on the login page. **Log out / switch user** returns to the login page. Data carries across logins, so a request raised by one user is waiting for the next approver.

| Role | Email | Does |
|---|---|---|
| Customer | customer@mahaveermetal.com | Plans and prices orders (customer 777, Mahaveer Metal Co.) |
| ASM | asm@vedanta.com | First approver; raises rollover exceptions; enters manual HZL pricing |
| RM | rm@vedanta.com | Final plan approval (Effective Date, Additional Premium, bulk approve) |
| RFM | rfm@vedanta.com | Adds service charge |
| CSA | csa@vedanta.com | Approves rollover step and manual pricing |
| Treasury | treasury@vedanta.com | Adds backwardation / contango; final rollover approval |

## What's covered

- **Home and PDP:** All Products catalog (SHG, CGG, EPG, HG, HZDA, Lead 99.99%, PW) with Buy Now. The product page has Buy Under MOU (MoU, variant, product specification, chemical composition and bundle accordions), quantity, Delivery in up to M+2, **Add to Cart** (stays on the page) and **Plan Order** (opens the cart). Spot Price and LP Sale tabs are shown but unchanged in Phase 2.
- **Cart:** price-type split with PNDL (price now for M+1 / M+2 delivery), Already Priced fetched automatically, read-only Rollover and Preponement quantities, Customer / HZL Default, Initial vs Additional plan label, and the Net Physical Delivery and Net Pricing Qty formulas. Zero-quantity plans go to RM.
- **Rollover / Preponement:** raised against an approved planned order. Eligibility follows the M+2 rule from the original delivery month (or MOU expiry, if earlier). The quantity stays blocked until final approval. Requests close at 1:00 PM IST on the last LME working day (use the **Demo clock**).
- **Approval chain:** ASM → RM → RFM (service charge) → CSA → Treasury (backwardation / contango, up to 3 decimals). Final approval creates a Price Booking entry for the selected month. Any approver can reject with a reason, which releases the blocked quantity.
- **ASM exception:** rollover beyond M+2 (up to M+12) with a mandatory Mail/PDF attachment (max 10 MB).
- **Planned orders:** ASM → RM. RM is the final approver and can enter an Effective Date (optional) and Additional Premium; Select All supports bulk approval.
- **Manual pricing (HZL direct):** ASM enters, CSA approves (maker–checker). Backdating within the current month only; cannot exceed the unpriced balance.
- **Supplier Price Bookings** lists only plans that already have pricing. **Dashboard** and **Exception Report** (SAP vs VMB) follow the BRD columns.

Demo data only, no external libraries. Open `index.html` in a browser; **Reset data** restores the sample orders.
