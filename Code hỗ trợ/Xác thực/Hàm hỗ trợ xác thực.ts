import { resolve } from "@std/path";
import { parseArgs } from "@std/cli/parse-args";
import { createSymmetricCryptor } from "@hugoalh/symmetric-crypto";

export const { email } = parseArgs(Deno.args, {
  string: ["email"],
  default: { email: "dohangminhtri@gmail.com" },
});
export const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const ĐƯỜNG_DẪN_TOKEN = resolve("Dữ liệu xác thực", email);
export const ĐƯỜNG_DẪN_CREDENTIALS = resolve("Dữ liệu xác thực", email, "credentials.json");
const password = Deno.env.get("DECRYPT_PASSWORD") || "";
const cryptor = await createSymmetricCryptor(password);

export interface Token {
  type: string;
  client_id: string;
  client_secret: string;
  refresh_token?: string | null;
}

function đườngDẫnBảnRõ(tậpTin: "token.json" | "credentials.json" = "token.json") {
  return resolve(ĐƯỜNG_DẪN_TOKEN, tậpTin);
}

function đườngDẫnBảnMã(tậpTin: "encrypted_token.txt" | "encrypted_credentials.txt" = "encrypted_token.txt") {
  return resolve(ĐƯỜNG_DẪN_TOKEN, tậpTin);
}

export async function ghiBảnRõ(vậtThể: Token, tậpTin: "token.json" | "credentials.json" = "token.json") {
  const bảnRõ = JSON.stringify(vậtThể, null, 2);
  await Deno.writeTextFile(đườngDẫnBảnRõ(tậpTin), bảnRõ);
}

export async function ghiBảnMã(vậtThể: Token, tậpTin: "encrypted_token.txt" | "encrypted_credentials.txt" = "encrypted_token.txt") {
  const bảnRõ = JSON.stringify(vậtThể, null, 2);
  const bảnMã = await cryptor.encrypt(bảnRõ);
  await Deno.writeTextFile(đườngDẫnBảnMã(tậpTin), bảnMã);
}

export async function đọcBảnRõ(tậpTin: "token.json" | "credentials.json" = "token.json") {
  const bảnRõ = await Deno.readTextFile(đườngDẫnBảnRõ(tậpTin));
  return JSON.parse(bảnRõ) as Token;
}

export async function đọcBảnMã(tậpTin: "encrypted_token.txt" | "encrypted_credentials.txt" = "encrypted_token.txt") {
  const bảnMã = await Deno.readTextFile(đườngDẫnBảnMã(tậpTin));
  const bảnRõ = await cryptor.decrypt(bảnMã);
  return JSON.parse(bảnRõ) as Token;
}

export async function chuẩnBịCred() {
  try {
    const bảnRõ = await đọcBảnRõ("credentials.json");
    await ghiBảnMã(bảnRõ, "encrypted_credentials.txt");
    console.info("Có bản rõ. Ghi bản mã");
  } catch {
    try {
      console.info("Không có bản rõ. Đọc bản mã và tạo bản rõ");
      const bảnRõ = await đọcBảnMã("encrypted_credentials.txt");
      return ghiBảnRõ(bảnRõ, "credentials.json");
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
      throw new Error("Credential không tồn tại");
    }
  }
}
