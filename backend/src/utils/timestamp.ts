import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function toUTCISO(input: string | number | Date | null | undefined): string {
  if (!input) return dayjs.utc().toISOString();
  const parsed = dayjs.utc(input);
  if (!parsed.isValid()) return dayjs.utc().toISOString();
  return parsed.toISOString();
}

export function nowUTC(): string {
  return dayjs.utc().toISOString();
}