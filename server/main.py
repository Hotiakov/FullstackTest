import asyncio
import websockets

async def server(ws:str, path:int):
    inp = input('Client joined. Greet it. \nType ')
    await ws.send(inp)
    try: 
        async for message in ws:
            print("Message from ciletn: " + message)
    except websockets.exceptions.ConnectionClosed as e:
        print("A client just disconnected")
        
Server = websockets.serve(server, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(Server)
asyncio.get_event_loop().run_forever()