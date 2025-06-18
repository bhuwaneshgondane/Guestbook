from django.urls import path
from .views import submit_message, get_messages, react_message

urlpatterns = [
    path('submit/', submit_message),
    path('messages/', get_messages),
    path('react/<str:msg_id>/', react_message),
]
