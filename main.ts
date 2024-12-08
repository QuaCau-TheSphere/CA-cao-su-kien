import { lấyApiCủaCalendar } from "./Code hỗ trợ/Google Calendar/Xác thực Google API.ts";
import { nhậpSựKiện, xoáSựKiệnTươngLai } from "./Code hỗ trợ/Google Calendar/Google Calendar.ts";
import { lấySựKiện } from "./Code hỗ trợ/Tạo sự kiện.ts";

const dsSựKiện = await lấySựKiện();
export const calendarApi = await lấyApiCủaCalendar();
// await xoáSựKiệnTươngLai("Test ganu");
await nhậpSựKiện(dsSựKiện);
