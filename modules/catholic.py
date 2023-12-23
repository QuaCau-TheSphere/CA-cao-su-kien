from bs4 import BeautifulSoup
import requests
from datetime import datetime, timedelta
import json
import logging, traceback

# from modules.utils import Event

def scrape_catholic_viet():
    scrape_result = requests.get('https://www.tonggiaophanhanoi.org/thang-muoi-hai-2024/')

    file = open('catholic_viet.html', 'wb')
    file.write(scrape_result.content)
    file.close()

    html = open("catholic_viet.html", "r", encoding="utf8") 
    soup = BeautifulSoup(html, 'html5lib')


    # events_raw = json.loads(soup.find_all('script', attrs={"type": "application/ld+json"})[1].contents[0]) 
    # events = [] 
    # for event_raw in events_raw:
    #     try:
    #         summary = event_raw.get('name')
    #         description = event_raw.get('description')
    #         location = event_raw.get('location').get('name')
    #         url = event_raw.get('url')
    #         start_datetime = datetime.fromisoformat(event_raw.get('startDate')) + timedelta(hours=7)
    #         try:
    #             end_datetime = datetime.fromisoformat(event_raw.get('endDate')) + timedelta(hours=7)
    #         except:
    #             end_datetime = start_datetime + timedelta(hours=3)
        
    #         event = Event(summary, description, location, url, start_datetime, end_datetime)
    #         events.append(event)
    #     except:
    #         logging.error(traceback.format_exc())
    #         print('Unable to get event data from ' + url) #type: ignore

    # return events

scrape_catholic_viet() 