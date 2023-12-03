from bs4 import BeautifulSoup
import json
import requests
from datetime import datetime, timedelta

class Event:
    def __init__(self, summary, description, location, startDate, endDate):
        self.summary = summary
        self.description = description
        self.location = location

        self.start = {'dateTime': startDate} 
        self.end   = {'dateTime': endDate} 

html = open("ticketbox.html", "r") 
soup = BeautifulSoup(html, 'html5lib')

ticketbox_events = json.loads(soup.find_all('script', attrs={"type": "application/ld+json"})[1].text) 
