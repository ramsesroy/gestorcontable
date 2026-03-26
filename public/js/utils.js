const fmt = new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 });
function toArgDate(dateStr) { return dateStr + 'T00:00:00-03:00'; }
function toArgDateEnd(dateStr) { return dateStr + 'T23:59:59-03:00'; }
function todayISO() { var n = new Date(); return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0'); }
function getDefaultRange() { var now = new Date(); var y = now.getFullYear(); var m = String(now.getMonth() + 1).padStart(2, '0'); var lastDay = new Date(y, now.getMonth() + 1, 0).getDate(); return { from: y + '-' + m + '-01', to: y + '-' + m + '-' + String(lastDay).padStart(2, '0') }; }
