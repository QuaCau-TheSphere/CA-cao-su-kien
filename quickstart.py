calendarID = 'f784c4b938bab23382fb2347cdf787f5ae454f55895209a45ead16888e3fde23@group.calendar.google.com'
import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

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


import json
from datetime import datetime, timedelta

class Event:
    def __init__(self, summary, description, location, startDate, endDate):
        self.summary = summary
        self.description = description
        self.location = location

        self.start = {'dateTime': startDate} 
        self.end   = {'dateTime': endDate} 

try:
	service = build("calendar", "v3", credentials=creds)
	event_dict = {"@context":"https://schema.org","@type":"Event","name":"Open Play Volleyball (All Levels) - Gentlemen's Night (50% off)","url":"https://www.meetup.com/vietnam-sports-social-club/events/297557788/","description":"🏐**Open play** in An Phu District 2: **All levels** are welcome!!!\n\nWe are playing on an outdoor court: subject to weather conditions\n\n50% of for all men\n\n**Please note:**\n\n\\- be on time\n\n\\- wear proper shoes\n\n\\- bring water \\(there are also refreshments for sale available\\)\n\n\\- leave no trash\n\n\\- no food on the court\n\n\\- keep good sportsmanship on and off court \\!\n\nJoin us and have fun!","startDate":"2023-11-30T11:00:00.000Z","endDate":"","eventStatus":"https://schema.org/EventScheduled","image":"/images/fallbacks/group-cover-7-square.webp","eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode","location":{"@type":"Place","name":"VSSC An Phu Volleyball Court","address":{"@type":"PostalAddress","addressLocality":"Quận 2","addressRegion":"Th","addressCountry":"vn","streetAddress":"undefined, Quận 2, Th"},"geo":{"@type":"GeoCoordinates","latitude":10.799024,"longitude":106.748268}},"organizer":{"@type":"Organization","name":"Vietnam Sports and Social Club","url":"https://www.meetup.com/vietnam-sports-social-club/"},"performer":"Vietnam Sports and Social Club"}
	summary = event_dict.get('name')
	description = event_dict.get('description')
	location = event_dict.get('location').get('name')

	start_date = datetime.fromisoformat(event_dict.get('startDate'))
	try:
		end_date = datetime.fromisoformat(event_dict.get('endDate'))
	except:
		end_date = start_date + timedelta(hours=3)
	
	event = Event(summary, description, location, start_date.strftime("%Y-%m-%dT%H:%M:%SZ"), end_date.strftime("%Y-%m-%dT%H:%M:%SZ"))
	print(event.summary, event.start['dateTime'], event.end['dateTime'])
	
	event_json = json.loads(json.dumps(event.__dict__, default=str))
	print(event_json)
	
	event = service.events().insert(calendarId=calendarID, body=event_json).execute()
	print('Event created: %s' % (event.get('htmlLink'))) 

except HttpError as error:
    print(f"An error occurred: {error}")
    
# try:
# 	service = build("calendar", "v3", credentials=creds)
# 	event = {"summary": "CTE Dist 3: Meet up with the locals", "description": "A perfect group for socializing and growing your network in Saigon.\n\nAt Coffee Talk English, we also host: Board Games nights and DnD nights which are great to meet people and have some fun!\n\nCoffee Talk English 611/4C \u0110i\u1ec7n Bi\u00ean Ph\u1ee7, Ward 1, District 3, HCMC.\n\nH\u00e3y tham gia c\u00f9ng Coffee Talk English, \u0111\u1ec3:\n\n* C\u00f3 c\u01a1 h\u1ed9i th\u1ef1c h\u00e0nh ti\u1ebfng Anh tr\u1ef1c ti\u1ebfp v\u1edbi ng\u01b0\u1eddi b\u1ea3n ng\u1eef, ch\u1ee9 kh\u00f4ng ph\u1ea3i h\u1ecdc qua s\u00e1ch v\u1edf\n* \u0110\u01b0\u1ee3c t\u00ecm hi\u1ec3u th\u00eam v\u1ec1 v\u0103n h\u00f3a c\u1ee7a c\u00e1c n\u01b0\u1edbc tr\u00ean th\u1ebf gi\u1edbi\n* \u0110\u01b0\u1ee3c chia s\u1ebb v\u1edbi c\u00e1c b\u1ea1n t\u00e2y v\u1ec1 v\u0103n h\u00f3a v\u00e0 con ng\u01b0\u1eddi Vi\u1ec7t m\u00ecnh nh\u00e9\n* \u0110\u01b0\u1ee3c ch\u01a1i board games v\u1edbi c\u00e1c b\u1ea1n t\u00e2y n\u1eefa nha!!! Ti\u1ebfng Anh \u0111\u1eddi th\u01b0\u1eddng 100% \u0111\u1ea5y c\u00e1c b\u1ea1n (t\u1ee5i m\u00ecnh ch\u1ec9 lu\u1eadt ch\u01a1i cho c\u00e1c b\u1ea1n m\u1edbi nh\u00e9)\n* V\u00e0 c\u00f2n \u0111\u01b0\u1ee3c k\u1ebft b\u1ea1n v\u1edbi c\u00e1c b\u1ea1n t\u00e2y n\u1eefa c\u01a1\n\nH\u00e3y mau \u0111\u1ebfn tham gia c\u00f9ng ch\u00fang t\u1edb t\u1ea1i Coffee Talk English 611/4C \u0110i\u1ec7n Bi\u00ean Ph\u1ee7, Ward 1, District 3, HCMC nha!\n\nhttps://www.facebook.com/coffeetalkenglish.hcmc", "location": "Coffee Talk English (CTE)", "start": {"dateTime": "2023-12-02T06:00:00Z"}, "end": {"dateTime": "2023-12-02T09:00:00Z"}}

# 	event = service.events().insert(calendarId=calendarID, body=event).execute()
# 	print('Event created: %s' % (event.get('htmlLink'))) 

# except HttpError as error:
# 	print(f"An error occurred: {error}")

