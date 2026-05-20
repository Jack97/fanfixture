export function formatMatchDate(utcDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(utcDate));
}

export function formatKickoff(utcDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    hour12: false,
  }).format(new Date(utcDate));
}

export function formatShortDate(utcDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  }).format(new Date(utcDate));
}

export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysUntil(utcDate: string): number {
  const match = new Date(utcDate);
  const now = new Date();
  return Math.ceil((match.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function toCheckoutDate(checkin: string): string {
  const d = new Date(checkin);
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function maxDateISO(): string {
  return toISODate(addDays(new Date(), 90));
}
