import * as log from "@std/log";
import { Url } from "./Khác.ts";
import đọcThiếtLập, { TênWebsite } from "./Đọc thiết lập.ts";
import { càoMeetup } from "../Hàm cào/Sự kiện ở VN/Meetup.ts";

type HàmCào = (url: Url) => Promise<SựKiện[]>;

const mapHàmCào = new Map<TênWebsite, HàmCào>([
  ["Meetup", càoMeetup],
]);

async function tạoDsSựKiện() {
  const dsSựKiện: SựKiện[] = [];
  for (const vậtThểWebsite of đọcThiếtLập["Danh sách cào"]) {
    const [tênWebsite, { "Tên lịch": tênLịch, URL: url }] = Object.entries(vậtThểWebsite)[0];
    const hàmCào = mapHàmCào.get(tênWebsite);
    if (hàmCào) {
      try {
        const dsSựKiệnTừWebsite = await hàmCào(url);
        dsSựKiện.push(...dsSựKiệnTừWebsite);
      } catch (error) {
        log.error(error);
      }
    } else {
      log.warn(`Chưa thiết lập hàm cào cho ${tênWebsite}. Bỏ qua việc cào ${tênWebsite}`);
    }
  }
  return dsSựKiện;
}
export async function lấyCache() {
  const đườngDẫnTớiCache = `Cache/${Temporal.Now.plainDateISO()}.json`;
  try {
    log.info("Dùng cache sự kiện");
    return JSON.parse(await Deno.readTextFile(đườngDẫnTớiCache)) as SựKiện[];
  } catch (error) {
    log.info("Không có cache, cào mới");
    const ds = await tạoDsSựKiện();
    await Deno.writeTextFile(đườngDẫnTớiCache, JSON.stringify(ds, null, 2));
    return ds;
  }
}

export class SựKiện {
  tiêuĐề: string;
  môTả: string;
  địaĐiểm: string;
  lúcBắtĐầu: Temporal.Instant;
  lúcKếtThúc: Temporal.Instant;
  ảnh?: Url | Url[];
  nguồnLấy: Url;
  lịch?: string;

  constructor({ tiêuĐề, môTả, địaĐiểm, nguồnLấy, lúcBắtĐầu, lúcKếtThúc, ảnh }: SựKiện) {
    this.tiêuĐề = tiêuĐề;
    this.môTả = môTả;
    this.địaĐiểm = địaĐiểm;
    this.nguồnLấy = nguồnLấy;
    this.ảnh = ảnh;

    this.lúcBắtĐầu = lúcBắtĐầu;
    this.lúcKếtThúc = lúcKếtThúc;
  }
}
