import { parse } from "@std/yaml";

export type TênLịch = string;
export type TênWebsite = string;
interface ThiếtLập {
  "Danh sách cào": Record<TênWebsite, {
    "Lịch": TênLịch;
    URL: string;
  }>[];
  "Lịch mặc định": TênLịch;
}
export const thiếtLập = parse(await Deno.readTextFile("./Thiết lập.yaml")) as ThiếtLập;

export type UrlChưaChínhTắc = string | URL;
export type UrlChínhTắc = URL;
export type Url = UrlChưaChínhTắc | UrlChínhTắc;

export const bâyGiờ = Temporal.Now.zonedDateTimeISO().toString({ smallestUnit: "second", timeZoneName: "never" });
export const hômNay = Temporal.Now.plainDateISO();
