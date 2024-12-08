import { parse } from "@std/yaml";
import { resolve } from "@std/path/resolve";
import { SựKiện } from "./Tạo sự kiện.ts";

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
// const { year, month, day, hour, minute, second, offset } = Temporal.Now.zonedDateTimeISO();
// export const bâyGiờ = `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;

export async function lấyCacheSựKiện() {
  const dsCacheSựKiện = (await Array.fromAsync(Deno.readDir("Cache"))).filter((i) => i.isFile);
  const tênCache = dsCacheSựKiện.at(-1)?.name;
  if (!tênCache) return [];
  return JSON.parse(await Deno.readTextFile(resolve("Cache", tênCache))) as SựKiện[];
}
