from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        connect to server, create a room and add player to the room
        """
        self.room_name = None

        # loop 1000 times to find a room
        for i in range(1000):
            name = "room-%d" % i
            # if room not exists or room is not full
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break

        if not self.room_name:  # no room available
            return
        
        await self.accept()  # build connection

        # create room if not exists
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)  # set expire time to 1 hour

        # send message to all players in the room
        for player in cache.get(self.room_name):
            await self.send(
                text_data=json.dumps(
                    {
                        "event": "create_player",  # create player event
                        "uuid": player["uuid"],  # player uuid
                        "username": player["username"],  # player username
                        "photo": player["photo"],  # player photo
                    }
                )
            )

        # add the currently connected channel to a specified group.
        # the channel_name is the unique identifier for a websocket connection accepted by server 
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        print("disconnect")
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):
        """
        when the event is create player, create the player according to the data
        """
        players = cache.get(self.room_name) # get players in the room
        players.append({
            'uuid': data["uuid"],
            'username': data["username"],
            'photo': data["photo"],
        }) # add new player to the room
        cache.set(self.room_name, players, 3600)  # set expire time to 1 hour  

        # send message to all players in the room
        # 当这个事件被发送后，组中的所有通道都会收到这个事件，并调用group_send_event方法来处理这个事件。
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "group_send_event",
                "event": "create_player",  # create player event
                "uuid": data["uuid"],  # player uuid
                "username": data["username"],  # player username
                "photo": data["photo"],  # player photo
            }
        )   

    async def move_to(self, data):
        """
        send to all players to move the player to the specified position
        """
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "group_send_event",
                "event": "move_to",  # move to event
                "uuid": data["uuid"],  # player uuid
                "tx": data["tx"],  # player x position
                "ty": data["ty"],  # player y position
            }
        )

    async def shoot_fireball(self, data):
        """
        send to all players to shoot a fireball
        """
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "group_send_event",
                "event": "shoot_fireball",  # shoot fireball event
                "uuid": data["uuid"],  # player uuid
                "tx": data["tx"],  # target x position
                "ty": data["ty"],  # target y position
                "ball_uuid": data["ball_uuid"],  # fireball uuid
            }
        )

    async def attack(self, data):
        """
        send to all players to attack
        """
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "group_send_event",
                "event": "attack",  # attack event
                "uuid": data["uuid"],  # player uuid
                "attackee_uuid": data["attackee_uuid"],  # attackee uuid
                "x": data["x"],  # target x position
                "y": data["y"],  # target y position
                "angle": data["angle"],  # attack angle
                "damage": data["damage"],  # attack damage
                "ball_uuid": data["ball_uuid"],  # fireball uuid
            }
        )

    async def blink(self, data):
        """
        send to all players to blink
        """
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "group_send_event",
                "event": "blink",  # blink event
                "uuid": data["uuid"],  # player uuid
                "tx": data["tx"],  # target x position
                "ty": data["ty"],  # target y position
            }
        )

    async def group_send_event(self, data):
        """
        send message to all players in one room
        """
        await self.send(text_data=json.dumps(data)) # send message to client

    async def receive(self, text_data):
        """
        receive message from client
        """
        data = json.loads(text_data)
        event = data['event']
        if event == "create_player":
            await self.create_player(data)
        elif event == "move_to":
            await self.move_to(data)
        elif event == "shoot_fireball":
            await self.shoot_fireball(data)
        elif event == "attack":
            await self.attack(data)
        elif event == "blink":
            await self.blink(data)

