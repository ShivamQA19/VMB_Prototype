# DO Review Prototype

Clickable prototype of the new Delivery Order flow for Vedanta Metal Bazaar.

- The listing keeps only **View DO** and the downloads. Edit and More are removed.
- **View DO** shows the price, quantity, plant, buyer and consignee, with **Edit, Approve, Cancel and Clone** at the top of the page.
- Edit happens in place. Changed fields are highlighted and the price summary recalculates live.
- Approve opens the **NFA Configuration** popup: pick an NFA number to see its purpose, segment, total and remaining quantity and validity, then **Send to SAP**. An NFA without enough remaining quantity is blocked.
- Cancel needs a reason and can also clone the order.

Demo data only. Open `index.html` in a browser.
