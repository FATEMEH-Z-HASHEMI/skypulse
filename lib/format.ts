const DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: number | string): string {
  return String(input).replace(/\d/g, (d) => DIGITS[Number(d)]);
}

/** "2026-08-12T05:52" -> "۰۵:۵۲" */
export function formatTime(iso: string): string {
  return toPersianDigits(iso.slice(11, 16));
}
