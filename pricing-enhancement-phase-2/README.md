# Pricing Enhancement Phase 2 Prototype

Clickable prototype of the Phase 2 pricing changes for Vedanta Metal Bazaar (Lead and Zinc).

## Logins

Sign in with any account below (password **demo123** for all), or click a demo-user tile on the login page. **Log out / switch user** returns to the login page. Data carries across logins, so a request raised by one user is waiting for the next approver.

| Role | Email | Does |
|---|---|---|
| Customer | customer@mahaveermetal.com | Plans and prices orders (customer 777, Mahaveer Metal Co.) |
| ASM | asm@vedanta.com | First approver for plans and price bookings; raises rollover exceptions; enters Manual Pricing |
| RM | rm@vedanta.com | Final plan approval (Effective Date, Additional Premium, bulk approve) |
| RFM | rfm@vedanta.com | Adds service charge |
| CSA | csa@vedanta.com | Approves rollover step and manual pricing |
| Treasury | treasury@vedanta.com | Adds backwardation / contango; final rollover approval |

## What's covered

- **Home and PDP:** All Products catalog (SHG, CGG, EPG, HG, HZDA, Lead 99.99%, PW) with Buy Now. The product page has Buy Under MOU (MoU, variant, product specification, chemical composition and bundle accordions), quantity, Delivery in up to M+2, **Add to Cart** (stays on the page) and **Plan Order** (opens the cart). Spot Price and LP Sale tabs are shown but unchanged in Phase 2.
- **Cart:** price-type split with PNDL (price now for M+1 / M+2 delivery), Already Priced fetched automatically, read-only Rollover and Preponement quantities, Customer / HZL Default, Initial vs Additional plan label, and the Net Physical Delivery and Net Pricing Qty formulas. Zero-quantity plans go to RM.
- **Rollover / Preponement:** raised against an approved planned order. Eligibility follows the M+2 rule from the original delivery month (or MOU expiry, if earlier). The quantity stays blocked until final approval. Requests close at 1:00 PM IST on the last LME working day.
- **Approval chain:** ASM → RM → RFM (service charge) → CSA → Treasury (backwardation / contango, up to 3 decimals). Final approval creates a Price Booking entry for the selected month. Any approver can reject with a reason, which releases the blocked quantity.
- **ASM exception:** rollover beyond M+2 (up to M+12) with a mandatory Mail/PDF attachment (max 10 MB).
- **Planned orders:** ASM → RM. RM is the final approver and can enter an Effective Date (optional) and Additional Premium; Select All supports bulk approval.
- **Manual Pricing (HZL direct):** the ASM's **Manual Pricing** button on Price Bookings opens a popup: select the customer, enter the plan order number (validated against that customer's approved plan orders), choose the price type and quantity (cannot exceed the balance unpriced quantity), and enter the LME only for Spot price types; for other types the LME is fetched from the system. Backdating within the current month only. CSA approves (maker–checker), after which the booking appears to the customer as a child row under the plan order.
- **Price Booking entries:** when a planned order is finally approved, an entry for its quantity opens on the customer's Price Bookings page (Open for pricing) with **Book Price**. An approved rollover or preponement moves its quantity out of the parent PO's entry into its own entry for the selected month (parent PO shown), and the PO's Net Pricing Qty drops by the same amount. Quantity on a pending request is blocked from booking. Entries for a future month open in that month. Bookings are approved ASM first: Day CSP / Period Average / BDA / WEH → ASM → RFM → CSA → Treasury; Spot – Target → ASM → RFM; Spot – Screen → ASM → RFM → customer confirmation. RFM enters the applicable service charge and Treasury the contango (+) / backwardation (−) when approving.
- **Price Booking page:** laid out like the live VMB price booking screen: price-type tiles (Day CSP, Period Average, Screen Price, Target Price, Balance Day Avg, Which Ever Higher), a Delivery In month stepper with Status, Price Type, Product Type (and Customer, Region for approvers) filters, and a parent/child table. Each approved PO, rollover or preponement entry is a parent row (Deal Id, Deal Ticket ID, planned / net pricing / balance quantity, Book Price); every price booking against it is a child row (PB id, CDT, booked type, LME or target date/time/requested price, booked quantity, status, contango, approver actions). Rows expand and collapse.
- **DNPL / PNDL flags:** rollover entries are flagged **DNPL** (Deliver Now, Price Later); preponement entries and plan orders priced ahead of delivery are flagged **PNDL** (Price Now, Deliver Later). Flags show on the Price Booking page (entry and booking rows) and on the customer and approver Planned Orders lists. Contango / backwardation is not shown on DNPL or PNDL entries or their bookings.
- **Supplier Price Bookings** lists only plans that already have pricing. **Dashboard** and **Exception Report** (SAP vs VMB) follow the BRD columns.

Demo data only, no external libraries. Open `index.html` in a browser; **Reset data** restores the sample orders.
