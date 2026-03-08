/**
 * Format a number as Indonesian Rupiah
 */
export function formatRupiah(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return `Rp. ${num.toLocaleString("id-ID")}`;
}

/**
 * Format a bigint nanosecond timestamp to DD-MM-YYYY
 */
export function formatDate(nanos: bigint | number | null | undefined): string {
  if (nanos === null || nanos === undefined) return "-";
  const ms =
    typeof nanos === "bigint"
      ? Number(nanos / BigInt(1_000_000))
      : Number(nanos) / 1_000_000;
  if (Number.isNaN(ms)) return "-";
  const d = new Date(ms);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format bigint nanos to long Indonesian date e.g. "08 Maret 2026"
 */
export function formatDateLong(
  nanos: bigint | number | null | undefined,
): string {
  if (nanos === null || nanos === undefined) return "-";
  const ms =
    typeof nanos === "bigint"
      ? Number(nanos / BigInt(1_000_000))
      : Number(nanos) / 1_000_000;
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
    "Desember",
  ];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Convert a Date or date string (YYYY-MM-DD) to bigint nanoseconds
 */
export function dateToBigIntNanos(date: Date | string): bigint {
  const d = typeof date === "string" ? new Date(date) : date;
  return BigInt(d.getTime()) * BigInt(1_000_000);
}

/**
 * Convert bigint nanoseconds to YYYY-MM-DD string for input[type=date]
 */
export function nanosToDateInput(
  nanos: bigint | number | null | undefined,
): string {
  if (nanos === null || nanos === undefined) return "";
  const ms =
    typeof nanos === "bigint"
      ? Number(nanos / BigInt(1_000_000))
      : Number(nanos) / 1_000_000;
  if (Number.isNaN(ms)) return "";
  const d = new Date(ms);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Today as YYYY-MM-DD
 */
export function todayInputValue(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Calculate days between two date strings (YYYY-MM-DD)
 */
export function calcDaysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return 0;
  return Math.max(0, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
}
