import { calendarApi } from "../../main.ts";
import * as log from "@std/log";
import { bâyGiờ, thiếtLập, TênLịch } from "../Hàm hỗ trợ.ts";
import { calendar_v3 } from "googleapis";
import { SựKiện } from "../Lấy sự kiện mới.ts";

export async function lấyTênLịch(idLịch: string) {
  return (await calendarApi.calendarList.get({ calendarId: idLịch })).data.summary as TênLịch;
}

export async function lấyIdLịch(tênLịch: TênLịch) {
  async function lấyId(tên: TênLịch) {
    const items = (await calendarApi.calendarList.list()).data.items as calendar_v3.Schema$CalendarListEntry[];
    return items?.find((lịch) => lịch.summary === tên)?.id as string | undefined;
  }

  const id = await lấyId(tênLịch);
  if (id) return id;

  log.warn(`Lịch ${tênLịch} không tồn tại. Dùng lịch mặc định`);
  const tênLịchMặcĐịnh = thiếtLập["Lịch mặc định"];
  const idMặcĐịnh = await lấyId(tênLịchMặcĐịnh);
  return idMặcĐịnh;
}

/**
 * Tạo từ vật thể sự kiện
 */
export function tạoSựKiệnGcal({ tiêuĐề, môTả, địaĐiểm, nguồnLấy, lúcBắtĐầu, lúcKếtThúc, ảnh }: SựKiện): calendar_v3.Schema$Event {
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

/**
 * Tạo từ vật thể sự kiện từ Google Calendar
 */
export function tạoSựKiệnTừGCal({ summary, description, location, source, start, end }: calendar_v3.Schema$Event): SựKiện {
  return new SựKiện({
    tiêuĐề: summary,
    môTả: description,
    lúcBắtĐầu: Temporal.PlainDateTime.from(start.dateTime) || Temporal.PlainDate.from(start.date),
    lúcKếtThúc: Temporal.PlainDateTime.from(end.dateTime) || Temporal.PlainDate.from(end.date),
    nguồnLấy: source?.url,
    địaĐiểm: location,
  });
}

export async function liệtKêSựKiện(tênLịch: string, sốLượng = 10, logOut = false): Promise<calendar_v3.Schema$Events> {
  const idLịch = await lấyIdLịch(tênLịch);
  if (!idLịch) return [];

  const { data } = await calendarApi.events.list({
    calendarId: idLịch,
    timeMin: bâyGiờ,
    maxResults: sốLượng,
    singleEvents: true,
    orderBy: "startTime",
  });
  if (!data) {
    log.warn(`Có vấn đề khi liệt kê sự kiện trong lịch ${tênLịch}. Bỏ qua lịch này`);
    return [];
  }

  const kếtQuảTruyVấn = data.items as calendar_v3.Schema$Events;
  if (kếtQuảTruyVấn.length === 0) log.warn(`Lịch ${tênLịch} đang trống sự kiện sau hôm nay.`);
  else if (logOut) {
    log.info(`Danh sách ${sốLượng} sự kiện trong tương lai`);
    for (const sựKiện of kếtQuảTruyVấn) {
      const { start: { dateTime, date }, summary } = sựKiện;
      console.info(`${dateTime || date} - ${summary}`);
    }
  }
  return kếtQuảTruyVấn;
}

export async function xoáSựKiệnTươngLai(tênLịch: string) {
  log.info("Xoá sự kiện trong tương lai");
  const idLịch = await lấyIdLịch(tênLịch);
  if (!idLịch) return;

  const kếtQuảTruyVấn = await calendarApi.events.list({
    calendarId: idLịch,
    timeMin: bâyGiờ,
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
