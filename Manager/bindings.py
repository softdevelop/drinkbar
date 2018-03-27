
from channels_api.bindings import ResourceBinding
from pprint import pprint
from .models import *
from .serializer import OrderSerializer

class OrderBinding(ResourceBinding):
    model = Order
    stream = "orders"
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
