export function parseLocalDateTime(iso) {
  if (!iso) return null;
  const [datePart, timePart = '00:00:00'] = iso.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
}

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

export function formatDataHora(iso) {
  const d = parseLocalDateTime(iso);
  if (!d) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${DIAS[d.getDay()]}, ${dd} ${MESES[d.getMonth()]} ${d.getFullYear()} · ${hh}:${mi}`;
}

export function formatData(iso) {
  const d = parseLocalDateTime(iso);
  if (!d) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function formatMoeda(valor) {
  const n = Number(valor || 0);
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function humanizeEnum(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .split('_')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
