export const cx = (...values: (string | undefined | false)[]): string =>
  values.filter(Boolean).join(" ");
