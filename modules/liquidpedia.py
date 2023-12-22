import logging, traceback
from bs4 import BeautifulSoup
import requests
from datetime import datetime, timedelta
from modules.utils import Event


def scrape_liquipedia():
    print('Getting liquipedia events...')
    try:
        scrape_result = requests.get('https://tl.net/calendar/xml/calendar.xml')

        file = open('liquipedia.html', 'wb')
        file.write(scrape_result.content)
        file.close()

        html = open("liquipedia.html", "r", encoding="utf8") 
        soup = BeautifulSoup(html, 'html5lib')

        print('Processing Liquipedia events...')
        year = int(soup.month['year'])       #type: ignore
        month = int(soup.month['num'])       #type: ignore

        print(year, month)
        events_raw = soup.find_all('event')
        
        events = [] 
        for event_raw in events_raw:
            try:
                summary = f'[{event_raw.title.string}] {event_raw.description.string}' 
                # location = event_raw.location.string
                event_url = event_raw.find('liquipedia-url').string

                day = int(event_raw.parent['num']) 
                hour = int(event_raw['hour'])
                minute = int(event_raw['minute'])

                start_datetime = datetime(year=year, month=month, day=day, hour=hour, minute=minute) + timedelta(hours=7)
                end_datetime = start_datetime + timedelta(hours=3)

                print(summary, event_url, start_datetime)
                event = Event(summary, '', '', event_url, start_datetime, end_datetime)
                events.append(event)
            except:
                logging.error(traceback.format_exc())
                print('Unable to get event data from ' + event_url)
        return events
    except:
        logging.error(traceback.format_exc())
        print('Unable to get event data from ' + event_url)

    return events
