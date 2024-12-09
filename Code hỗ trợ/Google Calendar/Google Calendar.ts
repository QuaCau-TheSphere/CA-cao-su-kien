import * as log from "@std/log";
import { SựKiện } from "../Lấy sự kiện mới.ts";
import { bâyGiờ, thiếtLập, TênLịch } from "../Hàm hỗ trợ.ts";
import { calendarApi } from "../../main.ts";
import { lấyCacheSựKiệnMớiNhất } from "../Cache.ts";

async function lấyTênLịch(idLịch: string) {
  return (await calendarApi.calendarList.get({ calendarId: idLịch })).data.summary;
}
async function lấyIdLịch(tênLịch: TênLịch) {
  const id = await lấyId(tênLịch);
  if (id) return id;

  const tênLịchMặcĐịnh = thiếtLập["Lịch mặc định"];
  const idMặcĐịnh = await lấyId(tênLịchMặcĐịnh);
  if (!idMặcĐịnh) throw new Error("Lịch mặc định không tồn tại");
  return idMặcĐịnh;

  async function lấyId(tên = tênLịch) {
    return (await calendarApi.calendarList.list()).data.items?.find((lịch) => lịch.summary === tên)?.id;
  }
}

function sựKiệnGcal({ tiêuĐề, môTả, địaĐiểm, nguồnLấy, lúcBắtĐầu, lúcKếtThúc, ảnh, tênLịch }: SựKiện) {
  return {
    summary: tiêuĐề,
    description: môTả,
    location: địaĐiểm,
    source: {
      title: tiêuĐề,
      url: nguồnLấy,
    },
    start: {
      dateTime: lúcBắtĐầu.toString({ smallestUnit: "second" }),
      timeZone: "Asia/Ho_Chi_Minh",
    },
    end: {
      dateTime: lúcKếtThúc.toString({ smallestUnit: "second" }),
      timeZone: "Asia/Ho_Chi_Minh",
    },
  };
}

export async function liệtKêSựKiện(tênLịch: string, sốLượng = 10) {
  const res = await calendarApi.events.list({
    calendarId: await lấyIdLịch(tênLịch),
    timeMin: bâyGiờ,
    maxResults: sốLượng,
    singleEvents: true,
    orderBy: "startTime",
  });
  const dsSựKiện = res.data.items;
  if (!dsSựKiện || dsSựKiện.length === 0) {
    log.info("Không có sự kiện nào mới trong lịch.");
    return;
  }
  log.info(`Danh sách ${sốLượng} sự kiện trong tương lai`);
  for (const sựKiện of dsSựKiện) {
    const { start: { dateTime, date }, summary } = sựKiện;
    console.log(`${dateTime || date} - ${summary}`);
  }
}

export async function xoáSựKiệnTươngLai(tênLịch: string) {
  log.info("Xoá sự kiện trong tương lai");
  const idLịch = await lấyIdLịch(tênLịch);
  const kếtQuảTruyVấn = await calendarApi.events.list({
    calendarId: idLịch,
    // timeMin: bâyGiờ,
    singleEvents: true,
    orderBy: "startTime",
  });
  const dsSựKiện = kếtQuảTruyVấn.data.items || [];

  for (const sựKiện of dsSựKiện) {
    const { id, summary } = sựKiện;
    console.log("Xoá " + summary);
    await calendarApi.events.delete({
      calendarId: idLịch,
      eventId: id,
    });
  }
  log.info(`Đã xoá xong ${dsSựKiện.length} sự kiện trong tương lai`);
}

export async function nhậpSựKiện(dsSựKiện: SựKiện[]) {
  log.info("Nhập sự kiện");

  const cacheMớiNhất = await lấyCacheSựKiệnMớiNhất();
  for (const sựKiện of dsSựKiện) {
    const { tênLịch, tiêuĐề, lúcBắtĐầu } = sựKiện;
    if (cacheMớiNhất.some((i) => i.tiêuĐề === tiêuĐề && i.lúcBắtĐầu === lúcBắtĐầu)) {
      console.log(`Đã nhập: ${tiêuĐề}`);
      continue;
    }
    // if (dsSựKiện.indexOf(sựKiện) !== 0) continue;
    try {
      const { data: { htmlLink, summary } } = await calendarApi.events.insert({
        calendarId: await lấyIdLịch(sựKiện.tênLịch),
        requestBody: sựKiệnGcal(sựKiện),
      });
      console.log(summary);
      // console.debug(htmlLink);
    } catch (error) {
      log.error(`Không nhập được: ${tiêuĐề}`);
      console.error(error.message);
    }
  }
  log.info(`Đã nhập xong ${dsSựKiện.length} sự kiện`);
}
