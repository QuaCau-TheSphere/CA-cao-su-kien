import * as log from "@std/log";
import { hômNay, thiếtLập, TênLịch, TênWebsite, Url } from "./Hàm hỗ trợ.ts";
import { càoMeetup } from "../Hàm cào/Sự kiện ở VN/Meetup.ts";
import { resolve } from "@std/path/resolve";
import { ĐƯỜNG_DẪN_CACHE } from "./Cache.ts";

type HàmCào = (url: Url, tênLịch: TênLịch) => Promise<SựKiện[]>;
const mapHàmCào = new Map<TênWebsite, HàmCào>([
  ["Meetup", càoMeetup],
]);

async function tạoDsSựKiện() {
  const dsSựKiện: SựKiện[] = [];
  for (const vậtThểWebsite of thiếtLập["Danh sách cào"]) {
    const [tênWebsite, { "Lịch": tênLịch, URL: url }] = Object.entries(vậtThểWebsite)[0];
    const hàmCào = mapHàmCào.get(tênWebsite);
    if (hàmCào) {
      try {
        const dsSựKiệnTừWebsite = await hàmCào(url, tênLịch);
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

/**
 * Không có phương thức vì có thể được đọc lại từ cache
 */
export class SựKiện {
  tiêuĐề: string;
  môTả: string;
  địaĐiểm: string;
  lúcBắtĐầu: Temporal.Instant;
  lúcKếtThúc: Temporal.Instant;
  ảnh?: Url | Url[];
  nguồnLấy: Url;
  tênLịch: TênLịch;

  constructor({ tiêuĐề, môTả, địaĐiểm, nguồnLấy, lúcBắtĐầu, lúcKếtThúc, ảnh, tênLịch }: SựKiện) {
    this.tiêuĐề = tiêuĐề;
    this.môTả = môTả;
    this.địaĐiểm = địaĐiểm;
    this.nguồnLấy = nguồnLấy;
    this.ảnh = ảnh;

    this.lúcBắtĐầu = lúcBắtĐầu;
    this.lúcKếtThúc = lúcKếtThúc;
    this.tênLịch = tênLịch;
  }
}

/**
 * Kiểm tra xem hôm nay đã tạo cache chưa. Nếu có thì dùng cache hôm nay. Nếu chưa thì mới cào mới
 */
export async function lấySựKiện() {
  const cacheSựKiệnHômNay = resolve(ĐƯỜNG_DẪN_CACHE, `${hômNay}.json`);
  try {
    log.info("Dùng cache sự kiện");
    return JSON.parse(await Deno.readTextFile(cacheSựKiệnHômNay)) as SựKiện[];
  } catch (error) {
    log.info("Không có cache, cào mới");
    const ds = await tạoDsSựKiện();
    await Deno.writeTextFile(cacheSựKiệnHômNay, JSON.stringify(ds, null, 2));
    return ds;
  }
}
