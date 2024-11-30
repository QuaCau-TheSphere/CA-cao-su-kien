import * as fs from "fs";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

console.log("Authorizing...");
// If modifying these scopes, delete the file token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
let creds: OAuth2Client | null = null;

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
if (fs.existsSync("token.json")) {
  const token = fs.readFileSync("token.json", "utf-8");
  creds = OAuth2Client.fromJSON(token);
}

// If there are no (valid) credentials available, let the user log in.
if (!creds || !creds.credentials.access_token) {
  const { OAuth2 } = google.auth;
  const oauth2Client = new OAuth2(
    YOUR_CLIENT_ID, // Replace with your client ID
    YOUR_CLIENT_SECRET, // Replace with your client secret
    YOUR_REDIRECT_URL, // Replace with your redirect URL
  );

  if (creds && creds.credentials.expiry_date && creds.credentials.expiry_date < Date.now()) {
    await oauth2Client.refreshAccessToken();
  } else {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    // After user authorizes, get the code and set it here
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync("token.json", JSON.stringify(tokens));
  }
}

const service = google.calendar({ version: "v3", auth: creds });

async function cleanUpComingEvents(calendarID: string) {
  /** Clean upcoming events from previous scrape to avoid duplication */
  const now = new Date(Date.now()).toISOString() + "Z"; // 'Z' indicates UTC time
  console.log("Cleaning upcoming events in calendars...");
  const eventsResult = await service.events.list({
    calendarId: calendarID,
    timeMin: now,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = eventsResult.data.items || [];

  if (!events.length) {
    console.log("No upcoming events found.");
  }

  for (const event of events) {
    console.log("Cleaning " + event.summary);
    await service.events.delete({
      calendarId: calendarID,
      eventId: event.id,
    });
  }
}

async function insertEvents(events: any[], calendarID: string) {
  /** Insert events to Google Tên lịch */
  for (const event of events) {
    console.log(event);
    let eventJson: any;
    if (typeof event === "object") {
      eventJson = event;
    } else {
      // eventJson = JSON.stringify(event.gcal(), default=vars);
      eventJson = event.gcal().__dict__;
    }

    try {
      console.log(eventJson);
      const createdEvent = await service.events.insert({
        calendarId: calendarID,
        requestBody: eventJson,
      });
      console.log("Event created: %s\n", createdEvent.data.htmlLink);
    } catch (error) {
      console.error(error);
      console.log("Unable to insert event to Google Tên lịch");
    }
  }
  const calendarName = (await service.calendarList.get({ calendarId: calendarID })).data.summary;
  console.log(`All events are inserted to calendar ${calendarName}!`);
}
