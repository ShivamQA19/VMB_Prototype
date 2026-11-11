/* Shared CN/DN tab (REQ-12) for the Ledger Reconciliation prototypes: signed CN/DN PDFs with bulk download.
   Usage: CNDN.init({ mode: 'customer' | 'supplier', customers: [{code, name, group}], rerender, flash })
          CNDN.html()          -> markup for the tab body
          CNDN.click(el)       -> true if it handled a [data-act^="cn-"] click
          CNDN.change(el)      -> true if it handled a change on a [data-cn] control
   Demo data only. */
(function () {
  const css = `
  .cn-bar { padding: 16px; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; }
  .cn-bar .fld { display: flex; flex-direction: column; gap: 5px; }
  .cn-bar .fld label { font-size: 12px; color: #3C4043; }
  .cn-sel { height: 38px; border: 1px solid #1F1F1F; border-radius: 2px; background: #fff; padding: 0 10px; font-size: 13px; color: #1F1F1F; min-width: 150px; }
  .cn-right { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .cn-bulk { height: 40px; padding: 0 18px; border: 0; border-radius: 3px; background: #1565C0; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
  .cn-bulk:disabled { background: #9DB9DC; cursor: not-allowed; }
  .cn-note { font-size: 12.5px; color: #5F6368; padding: 0 16px 12px; }
  .cn-tbl { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 1040px; table-layout: fixed; }
  .cn-tbl > thead > tr > th:first-child { width: 44px; }
  .cn-tbl > thead > tr > th { background: #EEF0F3; text-align: left; font-weight: 700; padding: 11px 12px; }
  .cn-tbl > thead > tr > th { white-space: normal; vertical-align: bottom; }
  .cn-tbl > tbody > tr > td { padding: 11px 12px; border-bottom: 1px solid #ECEEF1; vertical-align: middle; overflow-wrap: anywhere; }
  .cn-tbl > tbody > tr > td.num, .cn-tbl > thead > tr > th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .cn-tbl input[type=checkbox] { width: 16px; height: 16px; accent-color: #1565C0; margin: 0; }
  .cn-wrap { overflow-x: auto; border-top: 1px solid #E3E5E8; }
  .cn-type { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: 11px; font-size: 12px; font-weight: 700; }
  .cn-CN { background: #E8F5E9; color: #2E7D32; }
  .cn-DN { background: #FFF3E0; color: #8A4B00; }
  .cn-sig { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #2E7D32; }
  .cn-empty { padding: 30px 16px; color: #5F6368; font-size: 14px; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inr = (n, d = 2) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const svDl = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 19h16"/></svg>';
  const svOk = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>';
  const MONTHS = ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'];
  const MNUM = { 'Apr 2026': '04', 'May 2026': '05', 'Jun 2026': '06', 'Jul 2026': '07', 'Aug 2026': '08', 'Sep 2026': '09', 'Oct 2026': '10' };

  /* Pricing detail lines from the sample ZCN working (CDT level). */
  const BASE_LINES = [
    ['2026M92906', '01-Aug-2026', '31-Aug-2026', '01-Aug-2026', '31-Aug-2026', 150, 3875.13, 95.88, 0, 0, 0],
    ['2026A92957', '27-Aug-2026', '27-Aug-2026', '27-Aug-2026', '27-Aug-2026', 100, 4107.00, 95.91, 0, 0, 0],
    ['2026A92958', '28-Aug-2026', '28-Aug-2026', '28-Aug-2026', '28-Aug-2026', 150, 4070.00, 95.95, 0, 0, 0],
    ['2026S92817', '27-Aug-2026', '27-Aug-2026', '27-Aug-2026', '27-Aug-2026', 100, 4093.80, 95.91, 10, 0, 0],
    ['2026S92847', '28-Aug-2026', '28-Aug-2026', '28-Aug-2026', '28-Aug-2026', 200, 4162.40, 95.95, 10, 3, 0],
    ['2026A92950', '18-Aug-2026', '18-Aug-2026', '18-Aug-2026', '18-Aug-2026', 50, 3799.25, 96.10, 0, 0, 0],
    ['2026A92951', '18-Aug-2026', '18-Aug-2026', '18-Aug-2026', '18-Aug-2026', 50, 3803.15, 96.10, 0, 0, 0],
    ['2026A92952', '19-Aug-2026', '19-Aug-2026', '19-Aug-2026', '19-Aug-2026', 50, 3777.25, 96.15, 0, 0, 0],
    ['2026A92953', '19-Aug-2026', '19-Aug-2026', '19-Aug-2026', '19-Aug-2026', 50, 3759.55, 96.15, 0, 0, 0],
    ['2026A92955', '25-Aug-2026', '25-Aug-2026', '25-Aug-2026', '25-Aug-2026', 50, 3986.40, 96.08, 0, 0, 0]
  ];

  let CFG = null;
  let DOCS = [];
  const S = { month: 'All', group: 'All', cust: 'All', sel: {} };

  function seed(code) { let h = 0; for (const c of code) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; }

  function build(customers) {
    DOCS = [];
    customers.forEach((c, ci) => {
      const h = seed(c.code);
      const nInv = c.code === '777' ? 4 : 2 + (h % 2);
      for (let k = 0; k < nInv; k++) {
        const mIdx = (h + k * 2) % MONTHS.length;
        const month = MONTHS[mIdx];
        const day = String(5 + ((h + k * 7) % 22)).padStart(2, '0');
        const billDate = `${day}-${month.slice(0, 3)}-2026`;
        const billDoc = '00937' + String(15194 + ci * 37 + k * 11).padStart(5, '0');
        const gstInv = 'DS000' + String(1000428 + ci * 41 + k * 13).padStart(7, '0');
        const mou = String(400011798 + ci * 3 + (k % 2));
        const qtyLifted = +(8 + ((h + k * 5) % 9) + ((h % 1000) / 1000)).toFixed(3);
        const shift = ((h + k) % 7) * 6 - 18; // LME shift for variety
        const lines = BASE_LINES.map((l) => [l[0].replace('2026', '2026'), l[1], l[2], l[3], l[4], l[5], +(l[6] + shift).toFixed(2), l[7], l[8], l[9], l[10]]);
        const qtyB = lines.reduce((a, l) => a + l[5], 0);
        const prodLme = lines.reduce((a, l) => a + l[5] * l[6], 0);
        const prodEx = lines.reduce((a, l) => a + l[5] * l[7], 0);
        const spotTot = lines.reduce((a, l) => a + l[5] * l[8], 0);
        const otherTot = lines.reduce((a, l) => a + l[5] * l[9], 0);
        const wLme = prodLme / qtyB, wEx = prodEx / qtyB;
        const premium = 105, spotCost = +(spotTot / qtyB).toFixed(3), total = +(wLme + premium + spotCost).toFixed(3);
        const dutyF = 5.5, duty = +(total * dutyF / 100).toFixed(3), cnf = 1500, depot = 10;
        const landed = +((total + duty) * wEx + cnf + depot).toFixed(2);
        const chargeable = +(landed * qtyLifted).toFixed(2);
        const charged = Math.round(chargeable * (0.93 + ((h + k) % 9) / 100));
        const diff = +(chargeable - charged).toFixed(2);
        const head = {
          mou, pdt: '4108' + String(26 + ci).padStart(2, '0') + 'A0' + String(45 + k), gstInv, billDoc, billDate, month,
          soldTo: c.code, shipTo: c.code, material: k % 2 ? '121102' : '121101', plant: '4700',
          wLme: +wLme.toFixed(3), premium, spotCost, total, exRate: +wEx.toFixed(2), lpDiff: 0, landed, chargeable,
          addlPrem: +(otherTot / qtyB).toFixed(2), totalAddl: +((otherTot / qtyB) * wEx * qtyLifted).toFixed(2), dutyF, duty, cnf, depot,
          pwDiffPmt: 0, pwDiff: 0, qtyLifted, charged, basic: charged, cstFull: 0, cstDisc: 0, disBefore: 0, advRoll: 0, discount: 0, requirement: '—'
        };
        const type = diff >= 0 ? 'DN' : 'CN';
        const docNo = (type === 'CN' ? '16000' : '17000') + String(4412 + ci * 17 + k * 5).padStart(5, '0');
        const pm = MONTHS[Math.min(MONTHS.length - 1, mIdx + 1)];
        const pday = String(2 + ((h + k) % 25)).padStart(2, '0');
        const taxable = Math.abs(diff), gst = +(taxable * 0.18).toFixed(2);
        DOCS.push({ id: docNo, type, docNo, postDate: `${pday}-${pm.slice(0, 3)}-2026`, month: pm, cust: c, gstInv, billDoc, mou, taxable, gst, amount: +(taxable + gst).toFixed(2) });
      }
    });
    DOCS.sort((a, b) => (MNUM[b.month] + b.postDate).localeCompare(MNUM[a.month] + a.postDate));
  }

  function inScope(c) {
    if (CFG.mode === 'customer') return true;
    if (S.group !== 'All' && c.group !== S.group) return false;
    if (S.cust !== 'All' && c.code !== S.cust) return false;
    return true;
  }
  const mi = (m) => MONTHS.indexOf(m);
  function listDocs() { return DOCS.filter((d) => inScope(d.cust) && (S.month === 'All' || d.month === S.month)); }

  /* ---------- markup ---------- */
  function filters() {
    const sel = (v, c) => (v === c ? ' selected' : '');
    const custs = CFG.customers.filter((c) => S.group === 'All' || c.group === S.group);
    const groups = [...new Set(CFG.customers.map((c) => c.group))];
    const sup = CFG.mode === 'supplier' ? `
      <div class="fld"><label for="cnG">Customer Group</label><select id="cnG" class="cn-sel" data-cn="group"><option value="All">All groups</option>${groups.map((g) => `<option value="${esc(g)}"${sel(g, S.group)}>${esc(g)}</option>`).join('')}</select></div>
      <div class="fld"><label for="cnC">Customer</label><select id="cnC" class="cn-sel" data-cn="cust"><option value="All">All customers</option>${custs.map((c) => `<option value="${esc(c.code)}"${sel(c.code, S.cust)}>${esc(c.code)} – ${esc(c.name)}</option>`).join('')}</select></div>` : '';
    return `${sup}
      <div class="fld"><label for="cnM">Posting Month</label><select id="cnM" class="cn-sel" data-cn="month"><option value="All">All months</option>${MONTHS.slice().reverse().map((m) => `<option${sel(m, S.month)}>${m}</option>`).join('')}</select></div>`;
  }

  function pdfView() {
    const list = listDocs();
    const n = list.filter((d) => S.sel[d.id]).length;
    const all = list.length > 0 && n === list.length;
    const supCols = CFG.mode === 'supplier';
    return `
    <div class="cn-bar">${filters()}
      <div class="cn-right"><span style="font-size:13px;font-weight:700">${list.length} document${list.length === 1 ? '' : 's'}</span>
        <button class="cn-bulk" data-act="cn-bulkpdf"${n ? '' : ' disabled'}>${svDl}Download Selected (${n})</button></div>
    </div>
    <div class="cn-note">Digitally signed CN/DN documents. Select several and download them together as one ZIP.</div>
    <div class="cn-wrap">${list.length ? `<table class="cn-tbl">
      <thead><tr><th><input type="checkbox" data-cn="all-pdf" aria-label="Select all"${all ? ' checked' : ''}></th><th>CN/DN No.</th><th>Type</th><th>Posting Date</th>${supCols ? '<th>Customer</th>' : ''}<th>GST Inv No.</th><th>Bill Doc. No.</th><th>MoU No.</th><th class="num">Taxable (₹)</th><th class="num">GST (₹)</th><th class="num">Total (₹)</th><th>Signed PDF</th></tr></thead>
      <tbody>${list.map((d) => `<tr>
        <td><input type="checkbox" data-cn="pick" data-id="${d.id}" aria-label="Select ${d.docNo}"${S.sel[d.id] ? ' checked' : ''}></td>
        <td><b style="font-weight:500">${d.docNo}</b></td><td><span class="cn-type cn-${d.type}">${d.type}</span></td><td>${d.postDate}</td>
        ${supCols ? `<td>${esc(d.cust.code)} – ${esc(d.cust.name)}</td>` : ''}
        <td>${d.gstInv}</td><td>${d.billDoc}</td><td>${d.mou}</td>
        <td class="num">${inr(d.taxable)}</td><td class="num">${inr(d.gst)}</td><td class="num"><b style="font-weight:500">${inr(d.amount)}</b></td>
        <td><button class="lnk" data-act="cn-pdf" data-id="${d.id}">${svDl}PDF</button> <span class="cn-sig">${svOk}Digitally signed</span></td></tr>`).join('')}</tbody></table>`
      : '<div class="cn-empty">No CN/DN documents for the selected filters.</div>'}</div>`;
  }

  window.CNDN = {
    init(cfg) { CFG = cfg; build(cfg.customers); },
    html() {
      const title = CFG.mode === 'supplier' ? 'CN/DN – Console bulk download' : 'CN/DN';
      return `<section class="card" style="padding:0;overflow:hidden">
        <div style="padding:16px 16px 0;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><h2 style="margin:0;font-size:17px">${title}</h2>
        <span style="font-size:13px;color:#5F6368">${CFG.mode === 'supplier' ? 'All customers – filter by group or customer' : 'Your Credit Notes and Debit Notes'}</span></div>
        ${pdfView()}
      </section>`;
    },
    click(el) {
      const a = el.dataset.act; if (!a || !a.startsWith('cn-')) return false;
      if (a === 'cn-pdf') { const d = DOCS.find((x) => x.id === el.dataset.id); CFG.flash(`Download started – ${d.type} ${d.docNo} (digitally signed PDF)`); }
      else if (a === 'cn-bulkpdf') { const l = listDocs().filter((d) => S.sel[d.id]); CFG.flash(`Download started – CNDN_${l.length}_document${l.length === 1 ? '' : 's'}.zip (${l.length} digitally signed PDF${l.length === 1 ? '' : 's'})`); }
      return true;
    },
    change(el) {
      const k = el.dataset.cn; if (!k) return false;
      if (k === 'month') { S.month = el.value; S.sel = {}; }
      else if (k === 'group') { S.group = el.value; S.cust = 'All'; S.sel = {}; }
      else if (k === 'cust') { S.cust = el.value; S.sel = {}; }
      else if (k === 'pick') { S.sel[el.dataset.id] = el.checked; }
      else if (k === 'all-pdf') { listDocs().forEach((d) => { S.sel[d.id] = el.checked; }); }
      CFG.rerender();
      return true;
    }
  };
})();
