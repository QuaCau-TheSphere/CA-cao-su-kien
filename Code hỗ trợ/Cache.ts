import { ensureDir } from "@std/fs";
import * as log from "@std/log";
import { resolve } from "@std/path/resolve";
import { slugify } from "@std/text/unstable-slugify";
import { hômNay, TênWebsite, Url } from "./Hàm hỗ trợ.ts";
import { LịchSựKiện, SựKiện } from "./Lấy sự kiện mới.ts";
import { thiếtLập } from "./Hàm hỗ trợ.ts";

export const ĐƯỜNG_DẪN_CACHE = "Cache";

function làUrlTrongThiếtLập(tênWebsite: string, url: Url) {
  for (const vậtThểWebsite of thiếtLập["Danh sách cào"]) {
    const [tênWebsite1, { URL: url1 }] = Object.entries(vậtThểWebsite)[0];
    if (tênWebsite === tênWebsite1 && url === url1) return true;
  }
  return false;
}

export async function lấyCacheHtml(url: Url, tênWebsite: TênWebsite) {
  let tênCache, đọcCache, tạoCache;
  const thưMụcCache = resolve(ĐƯỜNG_DẪN_CACHE, hômNay.toString(), tênWebsite);
  switch (làUrlTrongThiếtLập(tênWebsite, url)) {
    case true:
      tênCache = resolve(thưMụcCache, `${tênWebsite}.html`);
      đọcCache = `Đọc từ cache HTML của ${tênWebsite}`;
      tạoCache = `Cào ${tênWebsite}`;
      break;

    default: {
      const pathname = slugify(new URL(url).pathname);
      tênCache = resolve(thưMụcCache, `${pathname}.html`);
      đọcCache = `Đọc cache HTML của ${pathname}`;
      tạoCache = `Cào ${url}`;
      break;
    }
  }

  let html;
  try {
    log.debug(đọcCache);
    html = await Deno.readTextFile(tênCache);
  } catch {
    log.debug(tạoCache);
    await ensureDir(thưMụcCache);
    html = await (await fetch(url)).text();
    await Deno.writeTextFile(tênCache, html);
  }

  return html;
}

async function lấyTênCacheMớiNhất() {
  const dsCacheSựKiện = (await Array.fromAsync(Deno.readDir(ĐƯỜNG_DẪN_CACHE))).filter((i) => i.isFile);
  return dsCacheSựKiện.at(-1)?.name;
}
// /**
//  * Có tác dụng để xem có đẩy lên Google Calendar, chứ vẫn cào bình thường
//  */
// export async function đọcCacheSựKiệnMớiNhất() {
//   const tênCache = await lấyTênCacheMớiNhất();
//   if (tênCache) {
//     log.info(`Tìm thấy cache ${tênCache}. Kiểm tra xem sự kiện đã được nhập lên chưa bằng cache chứ không kiểm tra trực tiếp trên Google Calendar`);
//     return JSON.parse(await Deno.readTextFile(resolve(ĐƯỜNG_DẪN_CACHE, tênCache))) as LịchSựKiện;
//   }
//   log.info("Không tìm thấy cache sự kiện của lần chạy trước đây. Kiểm tra sự kiện đã được nhập lên Google Calendar bằng cách trực tiếp gọi API");
//   return undefined;
// }
