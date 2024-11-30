import * as log from "@std/log";
import { Page } from "puppeteer";
import { loginFacebook, mởTrìnhDuyệt } from "../../../Code hỗ trợ/Puppeteer.ts";
import { getEnv } from "../../../Code hỗ trợ/utils.ts";

export async function càoSựKiệnTrênFacebook() {
  // const url = getEnv("FACEBOOK_PROFILE_URL");
  const url = "https://www.facebook.com/nxbphunu/events";
  const page = await mởTrìnhDuyệt(url, true);

  await loginFacebook(page);
}

càoSựKiệnTrênFacebook();
