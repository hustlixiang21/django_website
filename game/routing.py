from django.urls import path
from game.consumers.multiplayer.index import MultiPlayer

websocket_urlpatterns = [
    path("wss/mutiplayer/", MultiPlayer.as_asgi(), name="wss_multiplayer"),
]
