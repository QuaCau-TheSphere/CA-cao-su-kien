import * as log from "@std/log";
import { calendarApi } from "../../main.ts";
import { lấyDsTênLịch, TênLịch } from "../Hàm hỗ trợ.ts";
import { LịchSựKiện, SựKiện } from "../Lấy sự kiện mới.ts";
import { liệtKêSựKiện, lấyIdLịch, tạoSựKiệnGcal, tạoSựKiệnTừGCal } from "./Hàm hỗ trợ Google Calendar.ts";

/**
 * Liệt kê các sự kiện đã có trên Google Calendar
 */
async function lấyLịchĐãCó(): Promise<LịchSựKiện> {
  const lịchĐãCó: LịchSựKiện = {};
  for (const tênLịch of lấyDsTênLịch()) {
    const kếtQuảTruyVấn = await liệtKêSựKiện(tênLịch, 100);
    lịchĐãCó[tênLịch] = kếtQuảTruyVấn.map(tạoSựKiệnTừGCal);
  }
  return lịchĐãCó;
}

function sựKiệnĐãĐượcNhập(tênLịch: TênLịch, { môTả }: SựKiện, lịchĐãCó: LịchSựKiện) {
  const dsSựKiện = lịchĐãCó[tênLịch];
  return dsSựKiện.some((sựKiện) => sựKiện.môTả === môTả);
}

export async function nhậpSựKiện(lịchSựKiện: LịchSựKiện) {
  const lịchĐãCó = await lấyLịchĐãCó();
  for (const [tênLịch, dsSựKiện] of Object.entries(lịchSựKiện)) {
    log.info(`Bắt đầu nhập ${dsSựKiện.length} sự kiện lên lịch ${tênLịch} trên Google Calendar`);
    for (const sựKiện of dsSựKiện) {
      if (sựKiệnĐãĐượcNhập(tênLịch, sựKiện, lịchĐãCó)) {
        console.log(`Đã có sẵn: ${sựKiện.tiêuĐề}`);
        continue;
      }
      // if (dsSựKiện.indexOf(sựKiện) !== 0) continue;
      try {
        const { data: { _htmlLink, summary } } = await calendarApi.events.insert({
          calendarId: await lấyIdLịch(tênLịch),
          requestBody: tạoSựKiệnGcal(sựKiện),
        });
        console.log(summary);
        // console.debug(_htmlLink);
      } catch (error) {
        log.error(`Không nhập được: ${sựKiện.tiêuĐề}`);
        console.error((error as Error).message);
      }
    }
    log.info(`${dsSựKiện.length} sự kiện đã được nhập lên lịch ${tênLịch}`);
  }
}
