import { calendar_v3 } from "googleapis";
import * as log from "@std/log";
import { SựKiện } from "../Kiểu cho sự kiện.ts";

async function lấyTênLịch(calendarApi: calendar_v3.Calendar, idLịch: string) {
  return (await calendarApi.calendarList.get({ calendarId: idLịch })).data.summary;
}

function sựKiệnGcal({ tiêuĐề, môTả, địaĐiểm, nguồnLấy, lúcBắtĐầu, lúcKếtThúc, ảnh, lịch }: SựKiện) {
  return {
    summary: tiêuĐề,
    description: môTả,
    location: địaĐiểm,
    source: {
      title: tiêuĐề,
      url: nguồnLấy,
    },
    start: {
      dateTime: lúcBắtĐầu.toLocaleString(),
      timeZone: "Asia/Ho_Chi_Minh",
    },
    end: {
      dateTime: lúcKếtThúc.toLocaleString(),
      timeZone: "Asia/Ho_Chi_Minh",
    },
  };
}

export async function liệtKêSựKiện(calendarApi: calendar_v3.Calendar, idLịch: string) {
  const res = await calendarApi.events.list({
    calendarId: idLịch,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming 10 events:");
  events.map((event, i) => {
    const start = event?.start?.dateTime || event?.start?.date;
    console.log(`${start} - ${event.summary}`);
  });
}

export async function xoáSựKiệnTươngLai(calendarApi: calendar_v3.Calendar, idLịch: string) {
  log.info("Xoá sự kiện trong tương lai");
  const { year, month, day, hour, minute, second, offset } = Temporal.Now.zonedDateTimeISO();
  const now = `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
  const kếtQuảTruyVấn = await calendarApi.events.list({
    calendarId: idLịch,
    timeMin: now,
    singleEvents: true,
    orderBy: "startTime",
  });
  const dsSựKiện = kếtQuảTruyVấn.data.items || [];

  if (!dsSựKiện.length) {
    log.info("Không thấy sự kiện trong tương lai");
  }

  for (const sựKiện of dsSựKiện) {
    console.log("Xoá " + sựKiện.summary);
    await calendarApi.events.delete({
      calendarId: idLịch,
      eventId: sựKiện.id,
    });
  }
}

export async function nhậpSựKiện(calendarApi: calendar_v3.Calendar, dsSựKiện: SựKiện[], idLịch: string) {
  log.info("Nhập sự kiện");
  const tênLịch = await lấyTênLịch(calendarApi, idLịch);
  for (const sựKiện of dsSựKiện) {
    // if (dsSựKiện.indexOf(sựKiện) !== 0) continue;

    try {
      const { data: { htmlLink, summary } } = await calendarApi.events.insert({
        calendarId: idLịch,
        requestBody: sựKiệnGcal(sựKiện),
      });
      console.log("Nhập", summary);
      console.debug(htmlLink);
    } catch (error) {
      log.error(`Không chèn được sự kiện lên ${tênLịch}`);
      console.error(error);
    }
    log.info(`Đã nhập xong sự kiện vào ${tênLịch}!`);
  }
}
