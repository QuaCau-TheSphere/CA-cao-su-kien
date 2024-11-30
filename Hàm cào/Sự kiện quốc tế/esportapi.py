import logging, traceback
import requests
from datetime import datetime, timedelta
# from utils import Event
from modules.utils import Event


def scrape_esportapi():
    now = datetime.now() 
    dates_in_one_month_from_now = [now+timedelta(days=x) for x in range(30)]
    events = [] 
    try:
        for date in dates_in_one_month_from_now:
            url = f'https://esportapi1.p.rapidapi.com/api/esport/matches/{date.day}/{date.month}/{date.year}'
            print(f'{date.day}/{date.month}', url)

            headers = {
                "X-RapidAPI-Key": "qVHjLr3CYhmsh40TIssVVBh9jRPJp1t1CCCjsnesWqiyfGfCUr",
                "X-RapidAPI-Host": "esportapi1.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers)
            matches = response.json()['events']

            # seen = set()
            # uniq = []
            for match in matches:
                tournament_name = match['tournament']['name'] 
                tournament_category = match['tournament']['category']['name'] 
                season = match['season']['name'] 
                event_name = f'[{tournament_category}] {tournament_name} {season}'
                
                start_date = datetime.fromtimestamp(match['startTimestamp']) 
                end_date = datetime.fromtimestamp(match['startTimestamp']) + timedelta(hours=1) 

                source_url = f'https://www.google.com/search?q={event_name}'
                esportapi_match = Event(event_name, '', '', source_url, start_date, end_date)

                events.append(esportapi_match)

                # if event_name not in seen:
                #     uniq.append(event_name)
                #     seen.add(event_name)
                

            # url = "https://esportapi1.p.rapidapi.com/api/esport/tournament/16026"
            # response = requests.get(url, headers=headers)

            # print(response.json())
    except:
        logging.error(traceback.format_exc())
        print('Unable to get event data from ' + url) #type: ignore
    
    return events
# for event in scrape_esportapi():
#     print(event)