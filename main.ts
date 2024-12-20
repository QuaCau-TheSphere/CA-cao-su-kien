import { lấyApiCủaCalendar } from "./Code hỗ trợ/Xác thực/Xác thực Google API.ts";
import { nhậpSựKiện } from "./Code hỗ trợ/Google Calendar/Nhập sự kiện lên Google Calendar.ts";
import { lấyLịchSựKiện } from "./Code hỗ trợ/Lấy sự kiện mới.ts";
import { xoáSựKiệnTươngLai } from "./Code hỗ trợ/Google Calendar/Hàm hỗ trợ Google Calendar.ts";

export const calendarApi = await lấyApiCủaCalendar();

const lịchSựKiện = await lấyLịchSựKiện();
if (calendarApi) {
  // await xoáSựKiệnTươngLai("zMeetup");
  await nhậpSựKiện(lịchSựKiện);
}
