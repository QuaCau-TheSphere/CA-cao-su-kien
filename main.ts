import * as log from "@std/log";
import { càoMeetup } from "./Hàm cào/Sự kiện ở VN/Meetup.ts";
import { TênWebsite, yaml } from "./Code hỗ trợ/Đọc thiết lập.ts";
import { SựKiện } from "./Code hỗ trợ/Kiểu cho sự kiện.ts";
import { Url } from "./Code hỗ trợ/Kiểu cho URL.ts";

type HàmCào = (url: Url) => Promise<SựKiện[]>;

const mapHàmCào = new Map<TênWebsite, HàmCào>([
  ["Meetup", càoMeetup],
]);

const dsSựKiện: SựKiện[] = [];
for (const vậtThểWebsite of yaml["Danh sách cào"]) {
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
await Deno.writeTextFile("Cache/Sự kiện.json", JSON.stringify(dsSựKiện, null, 2));
