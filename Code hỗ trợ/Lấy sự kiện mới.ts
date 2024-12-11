import * as log from "@std/log";
import { hômNay, thiếtLập, TênLịch, TênWebsite, Url } from "./Hàm hỗ trợ.ts";
import { càoMeetup } from "../Hàm cào/Sự kiện ở VN/Meetup.ts";
import { resolve } from "@std/path/resolve";
import { ĐƯỜNG_DẪN_CACHE } from "./Cache.ts";

type HàmCào = (url: Url) => Promise<SựKiện[]>;
const mapHàmCào = new Map<TênWebsite, HàmCào>([
  ["Meetup", càoMeetup],
]);

export type LịchSựKiện = Record<TênLịch, SựKiện[]>;
async function tạoLịchSựKiện() {
  const lịchSựKiện: LịchSựKiện = {};
  for (const vậtThểWebsite of thiếtLập["Danh sách cào"]) {
    const [tênWebsite, { "Lịch": tênLịch, URL: url }] = Object.entries(vậtThểWebsite)[0];
    const hàmCào = mapHàmCào.get(tênWebsite);
    if (hàmCào) {
      try {
        lịchSựKiện[tênLịch] = await hàmCào(url);
      } catch (error) {
        log.error(error);
      }
    } else {
      log.warn(`Chưa thiết lập hàm cào cho ${tênWebsite}. Bỏ qua việc cào ${tênWebsite}`);
    }
  }
  return lịchSựKiện;
}

/**
 * Không có phương thức vì có thể được đọc lại từ cache
 * Về cơ bản thì cũng không khác gì calendar_v3.Schema$Event cả. Chủ yếu để lúc viết code thì đọc dễ hơn thôi
 */
export class SựKiện {
  tiêuĐề: string;
  môTả: string;
  địaĐiểm: string;
  lúcBắtĐầu: Temporal.PlainDate | Temporal.PlainDateTime;
  lúcKếtThúc: Temporal.PlainDate | Temporal.PlainDateTime;
  ảnh?: Url | Url[];
  nguồnLấy: Url | undefined; // undefined nếu lấy từ Google Calendar
  múiGiờ?: Temporal.TimeZoneLike;

  constructor({ tiêuĐề, môTả, địaĐiểm, nguồnLấy, lúcBắtĐầu, lúcKếtThúc, ảnh }: SựKiện) {
    this.tiêuĐề = tiêuĐề;
    this.môTả = môTả;
    this.địaĐiểm = địaĐiểm;
    this.nguồnLấy = nguồnLấy;
    this.ảnh = ảnh;

    this.lúcBắtĐầu = lúcBắtĐầu;
    this.lúcKếtThúc = lúcKếtThúc;
    this.múiGiờ = "Asia/Saigon";
  }
}

/**
 * Kiểm tra xem hôm nay đã tạo cache chưa. Nếu có thì dùng cache hôm nay. Nếu chưa thì mới cào mới
 */
export async function lấyLịchSựKiện() {
  const cacheSựKiệnHômNay = resolve(ĐƯỜNG_DẪN_CACHE, `${hômNay}.json`);
  try {
    const lịchSựKiện = JSON.parse(await Deno.readTextFile(cacheSựKiệnHômNay)) as LịchSựKiện;
    log.info("Hôm nay đã tạo cache sự kiện rồi. Dùng cache sự kiện đã tạo");
    return lịchSựKiện;
  } catch (error) {
    log.info("Hôm nay chưa tạo cache sự kiện nào. Cào mới");
    const lịchSựKiện = await tạoLịchSựKiện();
    await Deno.writeTextFile(cacheSựKiệnHômNay, JSON.stringify(lịchSựKiện, null, 2));
    return lịchSựKiện;
  }
}
