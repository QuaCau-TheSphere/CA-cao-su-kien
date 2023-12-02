# Change your calendar ID here
calendarID = 'f784c4b938bab23382fb2347cdf787f5ae454f55895209a45ead16888e3fde23@group.calendar.google.com'

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


from bs4 import BeautifulSoup
import json
import requests
from datetime import datetime, timedelta

print('Getting Meetup content...')
# meetup_scrape_result = requests.get('https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=vn--Ho%20Chi%20Minh%20City')
# # meetup_scrape_result = requests.get('https://www.example.com')

# meetup_file = open('meetup.html', 'wb')
# meetup_file.write(meetup_scrape_result.content)
# meetup_file.close()

html = open("meetup.html", "r") 
soup = BeautifulSoup(html, 'html5lib')

print('Processing Meetup content...')
meetup_events = json.loads(soup.find_all('script', attrs={"type": "application/ld+json"})[1].text) 

now = datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time

class Event:
    def __init__(self, summary, description, location, startDate, endDate):
        self.summary = summary
        self.description = description
        self.location = location

        self.start = {'dateTime': startDate} 
        self.end   = {'dateTime': endDate} 

try:
    service = build("calendar", "v3", credentials=creds)
    for event_dict in meetup_events:
        summary = event_dict.get('name')
        description = event_dict.get('description')
        location = event_dict.get('location').get('name')

        start_date = datetime.fromisoformat(event_dict.get('startDate'))
        try:
            end_date = datetime.fromisoformat(event_dict.get('endDate'))
        except:
            end_date = start_date + timedelta(hours=3)
        
        event_body = Event(summary, description, location, start_date.strftime("%Y-%m-%dT%H:%M:%SZ"), end_date.strftime("%Y-%m-%dT%H:%M:%SZ"))
        print(event_body.summary, event_body.start['dateTime'], event_body.end['dateTime'])
        
        event_json = json.loads(json.dumps(event_body, default=vars))
        event = service.events().insert(calendarId=calendarID, body=event_json).execute()
        print('Event created: %s' % (event.get('htmlLink'))) 

except HttpError as error:
    print(f"An error occurred: {error}")