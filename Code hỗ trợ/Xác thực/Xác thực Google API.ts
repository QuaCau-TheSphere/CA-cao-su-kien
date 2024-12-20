import "@std/dotenv/load";
import * as log from "@std/log";
import { google } from "googleapis";
import { Credentials } from "npm:google-auth-library";
import { authenticate as xácThựcClient } from "@google-cloud/local-auth";
import { chuẩnBịCred, email, ghiBảnMã, ghiBảnRõ, SCOPES, Token, ĐƯỜNG_DẪN_CREDENTIALS, đọcBảnMã, đọcBảnRõ } from "./Hàm hỗ trợ xác thực.ts";

/**
 * Thông tin xác thực (credential)
 * Client ID là để authorization server biết client nào là client nào, còn client secret là để nó đảm bảo rằng client này chính là client đó
 */
export async function lưuTokenTruyCập(credentials: Credentials) {
  const keys = JSON.parse(await Deno.readTextFile(ĐƯỜNG_DẪN_CREDENTIALS));
  const key = keys.installed || keys.web;
  const token = {
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: credentials.refresh_token,
  };
  await ghiBảnRõ(token);
  await ghiBảnMã(token);
}

async function đọcToken(): Promise<Token> {
  try {
    return await đọcBảnRõ();
  } catch {
    return await đọcBảnMã();
  }
}

/**
 * Việc kiểm tra xem người dùng được phép truy cập dữ liệu ở mức độ nào được gọi là cấp phép (authorization). Nó khác với việc xác thực (authentication) là kiểm tra danh tính của người đang truy cập
 */
async function cấpPhépTruyCập() {
  try {
    const tokenTruyCậpCóSẵn = await đọcToken();
    return google.auth.fromJSON(tokenTruyCậpCóSẵn);
  } catch {
    /** Tạo token truy cập mới (bằng việc xác thực lại) */
    console.log("Không có token sẵn. Dùng credential");
    await chuẩnBịCred();
    const { credentials } = await xácThựcClient({ scopes: SCOPES, keyfilePath: ĐƯỜNG_DẪN_CREDENTIALS });
    if (credentials) await lưuTokenTruyCập(credentials);
    return credentials;
  }
}

export async function lấyApiCủaCalendar() {
  log.info(`Xác thực Google Calendar cho ${email}`);
  try {
    const auth = await cấpPhépTruyCập();
    return google.calendar({ version: "v3", auth });
  } catch (error) {
    log.error("Không xác thực Google API được");
  }
}
