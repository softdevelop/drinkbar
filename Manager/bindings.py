
from channels_api.bindings import ResourceBinding
from pprint import pprint
from .models import *
from .serializer import OrderMachineSerializer

class OrderBinding(ResourceBinding):
    model = Order
    stream = "orders"
    serializer_class = OrderMachineSerializer
    queryset = Order.objects.filter(status=Order.STATUS_NEW).order_by('creation_date')
