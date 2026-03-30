export function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getYear(date: string) {
  return new Date(date).getFullYear().toString();
}

export function getMonthName(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
  })
    .format(new Date(date))
    .toLowerCase();
}
