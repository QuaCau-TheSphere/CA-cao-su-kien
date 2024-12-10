import { lấyApiCủaCalendar } from "./Code hỗ trợ/Google Calendar/Xác thực Google API.ts";
import { nhậpSựKiện, xoáSựKiệnTươngLai } from "./Code hỗ trợ/Google Calendar/Google Calendar.ts";
import { lấySựKiện } from "./Code hỗ trợ/Lấy sự kiện mới.ts";

export const calendarApi = await lấyApiCủaCalendar();

await xoáSựKiệnTươngLai("zMeetup");
const dsSựKiện = await lấySựKiện();
await nhậpSựKiện(dsSựKiện);
