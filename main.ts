import * as log from "@std/log";
import { càoMeetup } from "./Hàm cào/Sự kiện ở VN/Meetup.ts";
import { TênWebsite, yaml } from "./Code hỗ trợ/Đọc thiết lập.ts";
import { SựKiện } from "./Code hỗ trợ/Kiểu cho sự kiện.ts";
import { Url } from "./Code hỗ trợ/Kiểu cho URL.ts";

type HàmCào = (url: Url) => Promise<SựKiện[]>;

const mapHàmCào = new Map<TênWebsite, HàmCào>([
  ["Meetup", càoMeetup],
]);

for (const vậtThểWebsite of yaml.Websites) {
  const [tênWebsite, { "Tên lịch": tênLịch, URL: url }] = Object.entries(vậtThểWebsite)[0];
  log.info(`Cào ${tênWebsite}`);
  const hàmCào = mapHàmCào.get(tênWebsite);
  if (hàmCào) {
    // const dsSựKiện = await hàmCào(url);
    // console.log("🚀 ~ dsSựKiện:", dsSựKiện);
  } else {
    log.error(`Chưa thiết lập hàm cào cho ${tênWebsite}`);
  }
}
