function formatRupiah(amount) {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return `Rp. ${num.toLocaleString("id-ID")}`;
}
function formatDate(nanos) {
  if (nanos === null || nanos === void 0) return "-";
  const ms = typeof nanos === "bigint" ? Number(nanos / BigInt(1e6)) : Number(nanos) / 1e6;
  if (Number.isNaN(ms)) return "-";
  const d = new Date(ms);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
function formatDateLong(nanos) {
  if (nanos === null || nanos === void 0) return "-";
  const ms = typeof nanos === "bigint" ? Number(nanos / BigInt(1e6)) : Number(nanos) / 1e6;
  if (Number.isNaN(ms)) return "-";
  const d = new Date(ms);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function dateToBigIntNanos(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return BigInt(d.getTime()) * BigInt(1e6);
}
function nanosToDateInput(nanos) {
  if (nanos === null || nanos === void 0) return "";
  const ms = typeof nanos === "bigint" ? Number(nanos / BigInt(1e6)) : Number(nanos) / 1e6;
  if (Number.isNaN(ms)) return "";
  const d = new Date(ms);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
function todayInputValue() {
  const d = /* @__PURE__ */ new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
function calcDaysBetween(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return 0;
  return Math.max(0, Math.round((e - s) / (1e3 * 60 * 60 * 24)) + 1);
}
export {
  formatDate as a,
  formatDateLong as b,
  calcDaysBetween as c,
  dateToBigIntNanos as d,
  formatRupiah as f,
  nanosToDateInput as n,
  todayInputValue as t
};
