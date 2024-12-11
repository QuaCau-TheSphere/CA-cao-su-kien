import { parse } from "@std/yaml";

export type TênLịch = string;
export type TênWebsite = string;
type VậtThểKhaiBáo = Record<TênWebsite, {
  "Lịch": TênLịch;
  URL: string;
}>;

interface ThiếtLập {
  "Danh sách cào": VậtThểKhaiBáo[];
  "Lịch mặc định": TênLịch;
}
export const thiếtLập = parse(await Deno.readTextFile("./Thiết lập.yaml")) as ThiếtLập;

export function lấyDsTênLịch(): TênLịch[] {
  return [...new Set(thiếtLập["Danh sách cào"].map((vậtThểKhaiBáo) => Object.values(vậtThểKhaiBáo)[0].Lịch))];
}

export type UrlChưaChínhTắc = string | URL;
export type UrlChínhTắc = URL;
export type Url = UrlChưaChínhTắc | UrlChínhTắc;

export const bâyGiờ = Temporal.Now.zonedDateTimeISO().toString({ smallestUnit: "second", timeZoneName: "never" });
export const hômNay = Temporal.Now.plainDateISO();
