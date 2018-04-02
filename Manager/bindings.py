
from channels_api.bindings import ResourceBinding
from pprint import pprint
from .models import *
from .serializer import OrderMachineSerializer

class OrderBinding(ResourceBinding):
    model = Order
    stream = "orders"
    serializer_class = OrderMachineSerializer
    queryset = Order.objects.exclude(status=Order.STATUS_TOOK).order_by('creation_date')
