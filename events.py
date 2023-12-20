# Change your calendar ID here
calendarID = 'f784c4b938bab23382fb2347cdf787f5ae454f55895209a45ead16888e3fde23@group.calendar.google.com'

# ┌───────────────┐
# │ Authorization │
# └───────────────┘
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

print('Authorizing...')
# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar"]
creds = None
# The file token.json stores the user's access and refresh tokens, and is
# created automatically when the authorization flow completes for the first
# time.
if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
# If there are no (valid) credentials available, let the user log in.
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            "credentials.json", SCOPES
        )
        creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
        token.write(creds.to_json())

# ┌──────────┐
# │ Scraping │
# └──────────┘
from modules.meetup import scrape_meetup
from modules.ticketbox import scrape_ticketbox
events = scrape_meetup() + scrape_ticketbox()
# events = [ {'summary': 'test', 'description': '', 'source': {'title': 'source title', 'url': 'https://developers.google.com/calendar/api/v3/reference/events/insert'}, 'start': {'dateTime': '2023-12-21T10:00:00Z'}, 'end': {'dateTime': '2023-12-21T12:00:00Z'}}] 

# ┌──────────────────────────────┐
# │ Uploading to Google Calendar │
# └──────────────────────────────┘
service = build("calendar", "v3", credentials=creds)
for event in events:
    print(event)
    if type(event) is dict:
        event_json = event
    else:
        event_json = event.gcal().__dict__
    event = service.events().insert(calendarId=calendarID, body=event_json).execute()
    print('Event created: %s\n' % (event.get('htmlLink'))) 

# try:
# except HttpError as error:
#     print(f"An error occurred: {error}")