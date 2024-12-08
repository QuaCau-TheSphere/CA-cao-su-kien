import { lấyApiCủaCalendar } from "./Code hỗ trợ/Google Calendar/Xác thực Google API.ts";
import { liệtKêSựKiện, nhậpSựKiện, xoáSựKiệnTươngLai } from "./Code hỗ trợ/Google Calendar/Google Calendar.ts";
import { lấyCache } from "./Code hỗ trợ/Tạo sự kiện.ts";
import đọcThiếtLập from "./Code hỗ trợ/Đọc thiết lập.ts";

const dsSựKiện = await lấyCache();
const idLịch = đọcThiếtLập["Tên lịch"]["Test ganu"];
const calendarApi = await lấyApiCủaCalendar();
await liệtKêSựKiện(calendarApi, idLịch);
await xoáSựKiệnTươngLai(calendarApi, idLịch);
await nhậpSựKiện(calendarApi, dsSựKiện, idLịch);
