from bs4 import BeautifulSoup
import requests
from datetime import datetime, timedelta
import json
import logging, traceback

from modules.utils import Event

def scrape_meetup():
    print('Getting Meetup events...')
    scrape_result = requests.get('https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=vn--Ho%20Chi%20Minh%20City')

    file = open('meetup.html', 'wb')
    file.write(scrape_result.content)
    file.close()

    html = open("meetup.html", "r", encoding="utf8") 
    soup = BeautifulSoup(html, 'html5lib')

    print('Processing Meetup events...')
    events_raw = json.loads(soup.find_all('script', attrs={"type": "application/ld+json"})[1].contents[0]) 
    events = [] 
    for event_raw in events_raw:
        try:
            summary = event_raw.get('name')
            description = event_raw.get('description')
            location = event_raw.get('location').get('name')
            url = event_raw.get('url')
            start_datetime = datetime.fromisoformat(event_raw.get('startDate')) + timedelta(hours=7)
            try:
                end_datetime = datetime.fromisoformat(event_raw.get('endDate')) + timedelta(hours=7)
            except:
                end_datetime = start_datetime + timedelta(hours=3)
        
            event = Event(summary, description, location, url, start_datetime, end_datetime)
            events.append(event)
        except:
            logging.error(traceback.format_exc())
            print('Unable to get event data from ' + url)

    return events

