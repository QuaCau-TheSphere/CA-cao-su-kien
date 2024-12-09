import "@std/dotenv";
import * as log from "@std/log";
import { resolve } from "@std/path";
import { google } from "googleapis";
import { authenticate as xácThựcClient } from "@google-cloud/local-auth";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = resolve("Code hỗ trợ", "Google Calendar", "token.json");
const CREDENTIALS_PATH = resolve("Code hỗ trợ", "Google Calendar", "credentials.json");

/**
 * Thông tin xác thực (credential)
 * Client ID là để authorization server biết client nào là client nào, còn client secret là để nó đảm bảo rằng client này chính là client đó
 */
async function lưuTokenTruyCập(credentials: Credentials) {
  const keys = JSON.parse(await Deno.readTextFile(CREDENTIALS_PATH));
  const key = keys.installed || keys.web;
  const payload = {
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: credentials.refresh_token,
  };
  await Deno.writeTextFile(TOKEN_PATH, JSON.stringify(payload, null, 2));
}

/**
 * Việc kiểm tra xem người dùng được phép truy cập dữ liệu ở mức độ nào được gọi là cấp phép (authorization). Nó khác với việc xác thực (authentication) là kiểm tra danh tính của người đang truy cập
 * Nếu có token nghĩa là đã
 */
async function cấpPhépTruyCập() {
  try {
    const tokenTruyCậpCóSẵn = JSON.parse(await Deno.readTextFile(TOKEN_PATH));
    return google.auth.fromJSON(tokenTruyCậpCóSẵn);
  } catch {
    /** Tạo token truy cập mới (bằng việc xác thực lại) */
    const { credentials } = await xácThựcClient({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
    if (credentials) await lưuTokenTruyCập(credentials);
    return credentials;
  }
}

export async function lấyApiCủaCalendar() {
  log.info("Xác thực Google Calendar");

  const auth = await cấpPhépTruyCập();
  return google.calendar({ version: "v3", auth });
}
