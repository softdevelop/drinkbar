from channels.generic.websockets import WebsocketDemultiplexer
from channels.routing import route_class
from channels.routing import route

from Manager.bindings import OrderBinding

class APIDemultiplexer(WebsocketDemultiplexer):

    consumers = {
      'orders': OrderBinding.consumer
    }

channel_routing = [	
    route_class(APIDemultiplexer),
]
