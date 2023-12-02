import json
from datetime import datetime

now = datetime.now()
class Example:
    def __init__(self, a, b):
        self.a = a
        self.sub_obj = b
        # self.sub_obj = {'b': b} 

obj = Example('hi', 'ba')
data = json.dumps(obj.__dict__, default=str)
print(data)
