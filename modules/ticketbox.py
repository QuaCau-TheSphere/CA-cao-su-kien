import logging, traceback

from bs4 import BeautifulSoup, Tag
from time import sleep
from requests import get, Response
from datetime import datetime, timedelta, timezone
from pydantic import HttpUrl
from modules.utils import Event

def process_datetime(date_raw, time_raw):
    day   = int(date_raw[1])
    month = int(date_raw[3])
    year  = int(date_raw[4])

    hour   = int(time_raw.split(':')[0])
    minute = int(time_raw.split(':')[1].split(' ')[0])
    period = time_raw.split(':')[1].split(' ')[1].lower()

    if period == 'pm' and hour < 12:
        hour += 12

    timezone_vietnam = timezone(timedelta(hours=7))
    return datetime(year=year, month=month, day=day, hour=hour, minute=minute, tzinfo=timezone_vietnam)
    # return datetime(year=year, month=month, day=day, hour=hour, minute=minute, tzinfo=timezone_vietnam).strftime("%Y-%m-%dT%H:%M:%SZ")

def scrape_ticketbox(source) -> list:
    scrape_result: Response = get(source)
    file = open('ticketbox.html', 'wb')
    file.write(scrape_result.content)
    file.close()

    listing_page_html = open("ticketbox.html", "r", encoding="utf8") 
    listing_page_soup = BeautifulSoup(listing_page_html, 'html5lib')

    print('Processing Ticketbox events...')
    events_raw = listing_page_soup.find_all('div', attrs={"class": "event-list-item"})
    events: list[Event] = [] 
    for event_raw in events_raw:
        try:
            assert isinstance(event_raw.find('a'), Tag) 
            event_url= event_raw.find('a')['href']
            assert HttpUrl(event_url) 

            event_html = get(event_url).content
            event_soup = BeautifulSoup(event_html, 'html5lib') 

            summary: str = event_soup.find('h2', class_='title').get_text()                                  # type: ignore
            description: str = event_soup.find('div', class_='really-height').get_text()                     # type: ignore
            location: str = event_soup.find('div', class_='event-venue').get_text(', ', strip=True)          # type: ignore
            print(summary)

            multiple_dates = event_soup.find('div', attrs={'data-opm':'buybox'})
            
            if multiple_dates:
                assert isinstance(multiple_dates, Tag) 
                for item in multiple_dates.find_all('div', class_='item'):
                    date_raw = item.find('p', class_='date').get_text(strip=True).split(',')[1].split(' ')
                    start_time_end_time_raw = item.find('p', class_='time').get_text(strip=True).split(' - ')
                    start_datetime = process_datetime(date_raw, start_time_end_time_raw[0]) 
                    end_datetime   = process_datetime(date_raw, start_time_end_time_raw[1]) 
                    
                    event_raw = Event(summary, description, location, event_url, start_datetime, end_datetime) 
                    events.append(event_raw)
                    print(start_datetime)
            else:
                datetime_raw = event_soup.find('div', class_='event-time').get_text(strip=True).split('(')   # type: ignore
                date_raw                = datetime_raw[0].split(',')[1].split(' ')
                start_time_end_time_raw = datetime_raw[1][:-1].split(' - ')
                start_datetime = process_datetime(date_raw, start_time_end_time_raw[0]) 
                end_datetime   = process_datetime(date_raw, start_time_end_time_raw[1]) 

                event_raw = Event(summary, description, location, event_url, start_datetime, end_datetime) 
                events.append(event_raw)
                print(start_datetime)

        except:
            logging.error(traceback.format_exc())
            print('Unable to get event data from ' + event_url)

        sleep(1)
    
    return events

if __name__ == "__main__":
    for event in scrape_ticketbox():
        print(event.summary, event.start['dateTime'], event.end['dateTime'], sep='\n') 