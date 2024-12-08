export type UrlChưaChínhTắc = string | URL;
export type UrlChínhTắc = URL;
export type Url = UrlChưaChínhTắc | UrlChínhTắc;

export function bâyGiờ() {
  const { year, month, day, hour, minute, second, offset } = Temporal.Now.zonedDateTimeISO();
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
}
