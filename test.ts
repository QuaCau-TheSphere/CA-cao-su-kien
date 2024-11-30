import "@std/dotenv";
import * as path from "@std/path";
import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_PATH = path.join(Deno.cwd(), "Code hỗ trợ", "Google Calendar", "token.json");
const CREDENTIALS_PATH = path.join(
  Deno.cwd(),
  "Code hỗ trợ",
  "Google Calendar",
  "client_secret_834783543230-s6d4eg4ja7es4grp5bp1ajavce24pic2.apps.googleusercontent.com.json",
);

async function loadSavedCredentialsIfExist() {
  try {
    const credentials = JSON.parse(await Deno.readTextFile(TOKEN_PATH));
    console.log("🚀 ~ loadSavedCredentialsIfExist ~ credentials:", credentials);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: any) {
  const content = await Deno.readTextFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await Deno.writeTextFile(TOKEN_PATH, payload);
}

async function authorize() {
  const client = await loadSavedCredentialsIfExist();
  console.log("🚀 ~ authorize ~ client:", client);
  if (client) {
    return client;
  }
  const OAuth2Client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (OAuth2Client?.credentials) {
    await saveCredentials(client);
  }

  return OAuth2Client;
}

async function listEvents(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming 10 events:");
  events.map((event, i) => {
    const start = event?.start?.dateTime || event?.start?.date;
    console.log(`${start} - ${event.summary}`);
  });
}

authorize().then(listEvents).catch(console.error);

// const databaseId = Deno.env.get("NOTION_DATABASE_ID") ?? "";

// const notion = new Client({
//   auth: Deno.env.get("NOTION_TOKEN"),
// });

// const createPage = await notion.pages.create({
//   parent: {
//     database_id: databaseId,
//   },
//   properties: {
//     title: [
//       {
//         text: {
//           content: "New Event",
//         },
//       },
//     ],
//     Date: {
//       start: new Date().toISOString(),
//     },
//   },
// });

// console.log(createPage);
