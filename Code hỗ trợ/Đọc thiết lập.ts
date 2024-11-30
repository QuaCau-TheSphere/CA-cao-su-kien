import { parse } from "@std/yaml";

export type TênWebsite = string;
interface ThiếtLập {
  "Danh sách cào": Record<TênWebsite, {
    "Tên lịch": string;
    URL: string;
  }>[];
  "Tên lịch": Record<string, string>;
}
export const yaml = parse(await Deno.readTextFile("./Thiết lập.yaml")) as ThiếtLập;
