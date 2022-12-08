import websocket
import json
from json import dumps

f=open('test.json')
data = json.load(f)
# Connect to WebSocket server
ws = websocket.WebSocket()
ws.connect("ws://192.168.0.15")
print("Connected to WebSocket server")

# Ask the user for some input and transmit it

text = dumps(data)
ws.send(text)
#print(str)
# Wait for server to respond and print it
result = ws.recv()
print("Received: " + result)

# Gracefully close WebSocket connection
ws.close()