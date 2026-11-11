/* Shared demo state for the Ledger Reconciliation prototypes.
   Customer, RFM and supplier views run on the same site, so they share browser storage:
   an action in one view shows up in the others (live across open tabs). Demo only. */
(function () {
  const KEY = 'vmb-recon-demo-v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } };
  window.ReconStore = {
    get(key) { return read()[key] || null; },
    put(key, data) {
      const m = read();
      m[key] = Object.assign({}, m[key] || {}, data);
      try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) { /* storage unavailable: changes stay on this page only */ }
    },
    reset() { try { localStorage.removeItem(KEY); } catch (e) { /* nothing to clear */ } },
    /* fn(cleared) runs when another tab changes the shared state; cleared = true after a reset */
    onChange(fn) { window.addEventListener('storage', (e) => { if (e.key === KEY || e.key === null) fn(e.newValue === null); }); }
  };
})();
