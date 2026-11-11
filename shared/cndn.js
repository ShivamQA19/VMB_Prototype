/* Shared CN/DN tab (REQ-12) for the Ledger Reconciliation prototypes: signed CN/DN PDFs with bulk download.
   Usage: CNDN.init({ mode: 'customer' | 'supplier', groupRequired, groups: [{code, name}], customers: [{code, name, group}], rerender, flash })
          The supplier filter bar works like the Ledger Reconciliation one: searchable Customer Group fills
          Customer Code and Name; Type and Posting Month apply on APPLY; Clear All and Export Data.
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
  .cn-bulk { height: 40px; padding: 0 18px; border: 0; border-radius: 3px; background: #1565C0; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
  .cn-bulk:disabled { background: #9DB9DC; cursor: not-allowed; }
  .cn-icon { width: 40px; height: 40px; border: 1px solid #1565C0; border-radius: 3px; background: #fff; color: #1565C0; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
  .cn-icon:hover:not(:disabled) { background: #F1F6FD; }
  .cn-icon:disabled { color: #9AA0A6; border-color: #C9CDD3; cursor: not-allowed; }
  .cn-note { font-size: 12.5px; color: #5F6368; padding: 0 16px 12px; }
  .cn-tbl { width: 100%; border-collapse: collapse; font-size: 15px; min-width: 1040px; table-layout: fixed; }
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
  .cn-filters { margin-bottom: 14px; }
  .cn-listbar { padding: 14px 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  .cn-listbar h2 { margin: 0; font-size: 17px; }
  .cn-listbar .meta { font-size: 13px; color: #5F6368; }
  .cn-start { padding: 56px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
  .cn-start h3 { margin: 0; font-size: 16px; font-weight: 500; }
  .cn-start p { margin: 0; font-size: 14px; color: #5F6368; max-width: 470px; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inr = (n, d = 2) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const svDl = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 19h16"/></svg>';
  const svWork = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h6"/><path d="M14 3l5 5h-5z"/><path d="M8 11h6M8 14.5h3M10.5 11v7"/><path d="M18 13v7M15 17.5l3 3 3-3"/></svg>';
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
  const RESET = { dType: 'All', dMonth: 'All', aType: 'All', aMonth: 'All' };
  const S = Object.assign({ group: null, selected: [], menu: null, search: '', sel: {} }, RESET);
  const svDown = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const svDl16 = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 19h16"/></svg>';
  const svPeople = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9.5" r="2.4"/><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5M14.5 15.2c.8-.5 1.6-.7 2.5-.7 2.2 0 3.8 1.4 4.3 3.9"/></svg>';

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

  const isSup = () => CFG.mode === 'supplier';
  const grp = () => (CFG.groups || []).find((g) => g.code === S.group) || null;
  const gTitle = (g) => (g.name ? `${g.name} (${g.code})` : g.code);
  const groupCusts = () => (S.group ? CFG.customers.filter((c) => c.group === S.group) : []);
  const locked = () => isSup() && CFG.groupRequired && !S.group;

  function listDocs() {
    return DOCS.filter((d) => {
      if (isSup() && S.group && !S.selected.includes(d.cust.code)) return false;
      if (S.aType !== 'All' && d.type !== S.aType) return false;
      if (S.aMonth !== 'All' && d.month !== S.aMonth) return false;
      return true;
    });
  }
  function rerender() {
    CFG.rerender();
    if (S.menu === 'group') { const i = document.getElementById('cnsearch'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
  }

  /* ---------- markup ---------- */
  function filterBar() {
    const sel = (v, c) => (v === c ? ' selected' : '');
    const g = grp(), custs = groupCusts();
    const chosen = custs.filter((c) => S.selected.includes(c.code));
    const first = chosen[0];
    const more = g && chosen.length > 1 ? `<span>+${chosen.length - 1}</span>` : '';
    const allOn = custs.length > 0 && chosen.length === custs.length;
    const off = locked();
    const dis = !g ? ' disabled title="Select a Customer Group first"' : '';
    const disF = off ? ' disabled title="Select a Customer Group first"' : '';
    const q = S.search.trim().toLowerCase();
    const groups = (CFG.groups || []).filter((x) => !q || x.code.toLowerCase().includes(q) || x.name.toLowerCase().includes(q));
    const checkList = (field) => `
      <label class="chk all"><input type="checkbox" data-cn="allc"${allOn ? ' checked' : ''}>Select all</label>
      ${custs.map((c) => `<label class="chk"><input type="checkbox" data-cn="cust" data-code="${esc(c.code)}"${S.selected.includes(c.code) ? ' checked' : ''}>${esc(field === 'code' ? c.code : c.name)}</label>`).join('')}`;
    const sup = isSup() ? `
      <div class="fld" style="width:185px">
        <label>Customer Group${CFG.groupRequired ? ' <span class="req">*</span>' : ''}</label>
        <button class="ctl${S.menu === 'group' ? ' active' : ''}" data-act="cn-menu" data-m="group" aria-haspopup="listbox" aria-expanded="${S.menu === 'group'}"><span class="val">${g ? esc(gTitle(g)) : CFG.groupRequired ? 'Customer Group' : 'All groups'}</span>${svDown}</button>
        ${S.menu === 'group' ? `<div class="pop" style="width:320px">
          <div class="srch"><input id="cnsearch" type="text" value="${esc(S.search)}" placeholder="Search group name or code" aria-label="Search customer group"></div>
          <div class="scroll" role="listbox">
            ${CFG.groupRequired ? '' : `<button class="opt${!S.group ? ' sel' : ''}" data-act="cn-pick" data-code="" role="option"><span style="flex:1">All groups</span><small>${CFG.customers.length} customers</small></button>`}
            ${groups.map((x) => { const k = CFG.customers.filter((c) => c.group === x.code).length; return `<button class="opt${x.code === S.group ? ' sel' : ''}" data-act="cn-pick" data-code="${esc(x.code)}" role="option"><span style="flex:1">${esc(gTitle(x))}</span><small>${k} customer${k === 1 ? '' : 's'}</small></button>`; }).join('')}
            ${groups.length ? '' : `<div style="padding:14px 12px;font-size:13px;color:#5F6368">No group matches “${esc(S.search)}”</div>`}
          </div></div>` : ''}
      </div>
      <div class="fld" style="width:140px">
        <label>Customer Code</label>
        <button class="ctl${S.menu === 'code' ? ' active' : ''}" data-act="cn-menu" data-m="code"${dis}><span class="val">${!g ? 'Customer Code' : first ? esc(first.code) : 'None selected'}</span>${more}${svDown}</button>
        ${S.menu === 'code' ? `<div class="pop" style="width:220px"><div class="scroll">${checkList('code')}</div></div>` : ''}
      </div>
      <div class="fld" style="width:160px">
        <label>Customer Name</label>
        <button class="ctl${S.menu === 'name' ? ' active' : ''}" data-act="cn-menu" data-m="name"${dis}><span class="val">${!g ? 'Customer Name' : first ? esc(first.name) : 'None selected'}</span>${more}${svDown}</button>
        ${S.menu === 'name' ? `<div class="pop" style="width:340px"><div class="scroll">${checkList('name')}</div></div>` : ''}
      </div>` : '';
    return `<section class="card filters cn-filters">
      ${sup}
      <div class="fld" style="width:120px"><label for="cnType">Type</label>
        <select id="cnType" class="ctl" data-cn="dType"${disF}>${['All', 'CN', 'DN'].map((v) => `<option value="${v}"${sel(v, S.dType)}>${v === 'All' ? 'All' : v === 'CN' ? 'Credit Note' : 'Debit Note'}</option>`).join('')}</select></div>
      <div class="fld" style="width:150px"><label for="cnM">Posting Month</label>
        <select id="cnM" class="ctl" data-cn="dMonth"${disF}><option value="All">All months</option>${MONTHS.slice().reverse().map((m) => `<option${sel(m, S.dMonth)}>${m}</option>`).join('')}</select></div>
      <div class="actions">
        <button class="apply" data-act="cn-apply"${off ? ' disabled' : ''}>APPLY</button>
        <button class="txtbtn" data-act="cn-clear">Clear All</button>
        <button class="txtbtn" style="color:#1565C0" data-act="cn-export"${off ? ' disabled' : ''}>${svDl16}Export Data</button>
      </div>
    </section>`;
  }

  function listView() {
    if (locked()) {
      return `<section class="card cn-start"><span style="color:#80868B">${svPeople}</span><h3>Select a Customer Group to begin</h3>
        <p>Customer Code and Customer Name fill automatically with every customer in the group, and their CN/DN documents load below.</p></section>`;
    }
    const list = listDocs();
    const n = list.filter((d) => S.sel[d.id]).length;
    const all = list.length > 0 && n === list.length;
    const g = grp();
    return `<section class="card" style="padding:0;overflow:hidden">
    <div class="cn-listbar"><h2>CN/DN</h2>
      <span class="meta">${isSup() ? (g ? esc(g.name || g.code) : 'All groups') + ' · ' : ''}Digitally signed documents – select CN/DNs to download them as one ZIP, or download their working.</span>
      <div class="cn-right"><span style="font-size:15px;font-weight:700">${list.length} document${list.length === 1 ? '' : 's'}</span>
        <button class="cn-icon" data-act="cn-working"${n ? '' : ' disabled'} aria-label="Download Working" title="${n ? 'Download Working for the selected CN/DNs' : 'Download Working – select CN/DNs first'}">${svWork}</button>
        <button class="cn-bulk" data-act="cn-bulkpdf"${n ? '' : ' disabled'}>${svDl}Download Selected (${n})</button></div>
    </div>
    <div class="cn-wrap">${list.length ? `<table class="cn-tbl">
      <thead><tr><th><input type="checkbox" data-cn="all-pdf" aria-label="Select all"${all ? ' checked' : ''}></th><th>CN/DN No.</th><th>Type</th><th>Posting Date</th>${isSup() ? '<th>Customer</th>' : ''}<th>GST Inv No.</th><th>Bill Doc. No.</th><th>MoU No.</th><th class="num">Taxable (₹)</th><th class="num">GST (₹)</th><th class="num">Total (₹)</th><th>Signed PDF</th></tr></thead>
      <tbody>${list.map((d) => `<tr>
        <td><input type="checkbox" data-cn="pick" data-id="${d.id}" aria-label="Select ${d.docNo}"${S.sel[d.id] ? ' checked' : ''}></td>
        <td><b style="font-weight:500">${d.docNo}</b></td><td><span class="cn-type cn-${d.type}">${d.type}</span></td><td>${d.postDate}</td>
        ${isSup() ? `<td>${esc(d.cust.code)} – ${esc(d.cust.name)}</td>` : ''}
        <td>${d.gstInv}</td><td>${d.billDoc}</td><td>${d.mou}</td>
        <td class="num">${inr(d.taxable)}</td><td class="num">${inr(d.gst)}</td><td class="num"><b style="font-weight:500">${inr(d.amount)}</b></td>
        <td><button class="lnk" data-act="cn-pdf" data-id="${d.id}">${svDl}PDF</button> <span class="cn-sig">${svOk}Digitally signed</span></td></tr>`).join('')}</tbody></table>`
      : '<div class="cn-empty">No CN/DN documents for the selected filters.</div>'}</div>
    </section>`;
  }

  window.CNDN = {
    init(cfg) {
      CFG = cfg; build(cfg.customers);
      document.addEventListener('click', (e) => {
        if (S.menu && !e.target.closest('.cn-filters .pop') && !e.target.closest('[data-act="cn-menu"]')) { S.menu = null; rerender(); }
      });
      document.addEventListener('input', (e) => { if (e.target.id === 'cnsearch') { S.search = e.target.value; rerender(); } });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && S.menu) { S.menu = null; rerender(); } });
    },
    html() { return filterBar() + listView(); },
    click(el) {
      const a = el.dataset.act; if (!a || !a.startsWith('cn-')) return false;
      if (a === 'cn-pdf') { const d = DOCS.find((x) => x.id === el.dataset.id); CFG.flash(`Download started – ${d.type} ${d.docNo} (digitally signed PDF)`); return true; }
      if (a === 'cn-bulkpdf') { const l = listDocs().filter((d) => S.sel[d.id]); CFG.flash(`Download started – CNDN_${l.length}_document${l.length === 1 ? '' : 's'}.zip (${l.length} digitally signed PDF${l.length === 1 ? '' : 's'})`); return true; }
      if (a === 'cn-working') { const l = listDocs().filter((d) => S.sel[d.id]); CFG.flash(l.length === 1 ? `Download started – CN_Working_${l[0].billDoc}.xlsx (working for ${l[0].type} ${l[0].docNo})` : `Download started – CN_Workings_${l.length}_documents.xlsx (one sheet per CN/DN)`); return true; }
      if (a === 'cn-export') { S.menu = null; CFG.flash(`Exported ${listDocs().length} CN/DN record${listDocs().length === 1 ? '' : 's'} to Excel`); return true; }
      if (a === 'cn-menu') S.menu = S.menu === el.dataset.m ? null : el.dataset.m;
      else if (a === 'cn-pick') {
        const code = el.dataset.code || null;
        Object.assign(S, RESET, { group: code, selected: code ? CFG.customers.filter((c) => c.group === code).map((c) => c.code) : [], menu: null, search: '', sel: {} });
      } else if (a === 'cn-apply') { Object.assign(S, { aType: S.dType, aMonth: S.dMonth, menu: null, sel: {} }); }
      else if (a === 'cn-clear') { Object.assign(S, RESET, { group: null, selected: [], menu: null, search: '', sel: {} }); }
      rerender();
      return true;
    },
    change(el) {
      const k = el.dataset.cn; if (!k) return false;
      if (k === 'dType' || k === 'dMonth') { S[k] = el.value; return true; }
      if (k === 'cust') { const c = el.dataset.code; S.selected = S.selected.includes(c) ? S.selected.filter((x) => x !== c) : S.selected.concat([c]); S.sel = {}; }
      else if (k === 'allc') { const cs = groupCusts(); S.selected = S.selected.length === cs.length ? [] : cs.map((c) => c.code); S.sel = {}; }
      else if (k === 'pick') { S.sel[el.dataset.id] = el.checked; }
      else if (k === 'all-pdf') { listDocs().forEach((d) => { S.sel[d.id] = el.checked; }); }
      rerender();
      return true;
    }
  };
})();
