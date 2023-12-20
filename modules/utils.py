from datetime import datetime

class Event:
    def __init__(self, summary:str, description:str, location:str, url: str, startDate:datetime, endDate:datetime):
        self.summary = summary
        self.description = description
        self.location = location
        self.source = {
            'title': url,
            'url': url
        } 

        self.startDate = startDate
        self.endDate = endDate

    def __str__(self):
        '''To read on REPL'''
        try:
            return f'{self.summary}\t{self.startDate.strftime("%Y-%m-%d %H:%M")}'
        except:
            return f'{self.summary}\t{self.start["dateTime"]}'

    
    def gcal(self):
        self.start = {
            'dateTime': self.startDate.strftime("%Y-%m-%dT%H:%M:%S"),
            'timeZone': 'Asia/Ho_Chi_Minh'
        } 
        self.end   = {
            'dateTime': self.endDate.strftime("%Y-%m-%dT%H:%M:%S"),
            'timeZone': 'Asia/Ho_Chi_Minh'
        } 
        delattr(self, "startDate") 
        delattr(self, "endDate") 
        return self
    
    