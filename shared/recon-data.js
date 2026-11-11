/* Shared demo data and rules for the Ledger Reconciliation prototypes (supplier and RFM views).
   Loads after recon-store.js; state changes made in any view are kept in the browser via ReconStore. */
const TODAY = '10-Nov-2026';
const ALERT_TIME = '6:00 PM';

/* ---------- reconciliation periods (REQ-06) ---------- */
const CYCLES = [
  { id: 'HY1-26', label: 'HY1 (Apr – Sep 2026)', asOn: '30-Sep-2026', mailed: '05-Oct-2026', verifyBy: '20-Nov-2026', current: true },
  { id: 'HY2-26', label: 'HY2 (Oct 2025 – Mar 2026)', asOn: '31-Mar-2026', mailed: '05-Apr-2026', verifyBy: '20-Apr-2026' }
];

/* ---------- demo data ----------
   kind: P = no response · C = customer verified, awaiting RFM · T = verified with TDS difference, awaiting RFM
         E = exception raised, awaiting RFM · V / VT / VE = RFM verified (after C / T / E)
   [code, name, region, group, [ob, cb, kind, info] for HY1-26, [ob, cb, kind, info] for HY2-26] */
const GROUPS = [
  { code: '777', name: 'MAHAVEER', email: '[group email]' },
  { code: 'CENT11139', name: '', email: 'gmmaterials@centuryextrusions.com' }
];
const CUST = [
  ['777', 'MAHAVEER', 'North', '777', [-1103228.16, -1360368.16, 'P'], [-16802989.16, -1103228.16, 'V']],
  ['778', 'MAHAVEER METALS', 'North', '777', [2310450.00, 2875120.60, 'C', { at: '14-Oct-2026 11:20' }], [1985000.00, 2310450.00, 'V']],
  ['779', 'MAHAVEER ALLOYS PVT LTD', 'West', '777', [4102300.00, 4630815.40, 'E', { at: '10-Nov-2026 10:42', remark: 'Credit note of 30-Jul not received' }], [3650000.00, 4102300.00, 'V']],
  ['780', 'MAHAVEER INDUSTRIES', 'West', '777', [1250000.00, 1418760.00, 'T', { at: '22-Oct-2026 16:05', tds: 18420.00 }], [1100500.00, 1250000.00, 'V']],
  ['781', 'MAHAVEER CASTINGS', 'East', '777', [3375800.00, 3012455.25, 'E', { at: '02-Nov-2026 12:10', remark: 'Opening balance differs by ₹ 12,450.00', ext: '30-Nov-2026' }], [2890000.00, 3375800.00, 'V']],
  ['782', 'MAHAVEER ZINC TRADERS', 'South', '777', [980400.00, 1265300.80, 'V'], [845000.00, 980400.00, 'VE', { remark: 'Payment of 29-Mar not credited' }]],
  ['783', 'MAHAVEER WIRES LIMITED', 'North', '777', [5620000.00, 6104230.15, 'P'], [5010000.00, 5620000.00, 'P']],
  ['784', 'MAHAVEER GALVANIZERS', 'South', '777', [1745600.00, 1690275.00, 'VT', { tds: 9240.00 }], [1520300.00, 1745600.00, 'V']],
  ['785', 'MAHAVEER ENTERPRISES', 'East', '777', [2865000.00, 3221940.35, 'E', { at: '05-Nov-2026 15:30', remark: 'Debit note of 12-Aug disputed' }], [2410000.00, 2865000.00, 'V']],
  ['500130', 'CENTURY EXTRUSIONS PVT LTD', 'East', 'CENT11139', [27076407.92, 25814260.40, 'P'], [-2761909.58, 27076407.92, 'V']],
  ['50050411', 'CENTURY N F CASTINGS', 'East', 'CENT11139', [4120450.00, 5677910.00, 'V'], [3380000.00, 4120450.00, 'V']],
  ['500564', 'CAMCO MULTI METAL LIMITED', 'North', 'CENT11139', [812500.00, 1465018.73, 'E', { at: '10-Nov-2026 09:15', remark: 'Debit note of 23-Jul not reflected in our books' }], [1040200.00, 812500.00, 'V']],
  ['500846', 'CENTURY NF CASTING', 'East', 'CENT11139', [1500000.00, 2096285.40, 'C', { at: '28-Oct-2026 10:02' }], [1210000.00, 1500000.00, 'V']],
  ['503560', 'CENTURY NF CASTING', 'West', 'CENT11139', [0, 142300.00, 'P'], [0, 0, 'V']],
  ['506224', 'CENTURY ALUMINIUM MFG COMPANY LIMITED', 'West', 'CENT11139', [3200000.00, 3295875.75, 'VT', { tds: 21650.00 }], [2650000.00, 3200000.00, 'VE', { remark: 'Payment of 28-Mar not credited' }]]
];

const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const toD = (s) => { const [d, m, y] = s.slice(0, 11).split('-'); return new Date(+y, MON[m], +d); };
const fromIso = (iso) => { const [y, m, d] = iso.split('-'); return `${d}-${Object.keys(MON)[+m - 1]}-${y}`; };
const day = (s) => s.slice(0, 11);

const RECS = [];
CUST.forEach(([code, name, region, group, h1, h2]) => {
  [[h1, CYCLES[0]], [h2, CYCLES[1]]].forEach(([spec, cy]) => {
    const [ob, cb, kind, info = {}] = spec;
    const custAt = info.at || (cy.current ? '16-Oct-2026 11:20' : '08-Apr-2026 11:20');
    const r = { key: code + '|' + cy.id, code, name, region, group, cy, ob, cb, ext: info.ext || '', cust: null, rfm: null, remarks: [] };
    const base = kind.replace('V', '') || 'C';
    if (kind !== 'P') {
      if (base === 'C') r.cust = { t: 'ok', at: custAt, file: `Ledger_${code}_${cy.id}.pdf` };
      if (base === 'T') r.cust = { t: 'tds', at: custAt, file: `Ledger_${code}_${cy.id}.pdf`, tdsAmt: info.tds, tdsFile: `TDS_Certificate_${code}.pdf` };
      if (base === 'E') r.cust = { t: 'exc', at: custAt, file: `Exception_${code}_${cy.id}.xlsx` };
      if (info.remark) r.remarks.push(['Customer', info.remark, day(custAt)]);
    }
    if (kind.startsWith('V')) {
      r.rfm = { at: cy.current ? '05-Nov-2026 17:40' : '15-Apr-2026 17:40' };
      r.remarks.push(['RFM', base === 'E' ? 'Resolved with customer – ledger corrected' : 'Verified', day(r.rfm.at)]);
    }
    RECS.push(r);
  });
});

/* ---------- categorisation logic ----------
   Pending          : customer has not responded, or customer verified and RFM verification is pending
   Exception Raised : customer raised an exception and RFM has not verified yet
   Verified         : RFM has verified (after a customer verification, a TDS-difference verification, or a resolved exception) */
function status(r) {
  if (r.rfm) return 'Verified';
  if (r.cust && r.cust.t === 'exc') return 'Exception Raised';
  return 'Pending';
}
const awaitingRfm = (r) => !!r.cust && !r.rfm && r.cust.t !== 'exc';
const dueDate = (r) => r.ext || r.cy.verifyBy;
/* DO check: TDS-only difference → customer verification status; exception → RFM verification or extension date. */
function doCheck(r) {
  if (r.rfm) return { ok: true, why: 'RFM verified' };
  if (r.cust && r.cust.t !== 'exc') return { ok: true, why: r.cust.t === 'tds' ? 'Customer verified (TDS difference)' : 'Customer verified' };
  if (r.cust && r.cust.t === 'exc') return r.ext && toD(r.ext) >= toD(TODAY) ? { ok: true, why: 'Extended till ' + r.ext } : { ok: false, why: 'Exception – awaiting RFM' };
  return toD(dueDate(r)) >= toD(TODAY) ? { ok: true, why: 'Within Verify By ' + dueDate(r) } : { ok: false, why: 'Not verified by ' + dueDate(r) };
}
const PILL = { 'Verified': 'p-verified', 'Pending': 'p-pending', 'Exception Raised': 'p-exception' };
const REGIONS = ['North', 'South', 'East', 'West'];


/* ---------- shared demo state ---------- */
const verifiedFileName = (r) => `HZL_Verified_${r.code}_${r.cy.id}.pdf`;
function applyStore() {
  RECS.forEach((r) => {
    const o = ReconStore.get(r.key);
    if (!o) return;
    if ('cust' in o) r.cust = o.cust;
    if ('rfm' in o) r.rfm = o.rfm;
    if ('ext' in o) r.ext = o.ext;
    if (o.remarks) r.remarks = o.remarks;
  });
}
function saveRec(r) {
  ReconStore.put(r.key, { cust: r.cust, rfm: r.rfm, ext: r.ext || '', remarks: r.remarks, verifiedFile: r.rfm ? verifiedFileName(r) : '' });
}
applyStore();
