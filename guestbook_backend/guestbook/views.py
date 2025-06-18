from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
from datetime import datetime

@csrf_exempt
def submit_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = {
            'name': data['name'],
            'content': data['content'],
            'timestamp': datetime.utcnow()
        }
        settings.MONGO_COLLECTION.insert_one(message)
        return JsonResponse({'status': 'Message saved!'})

def get_messages(request):
    messages = list(settings.MONGO_COLLECTION.find({}, {'_id': 0}).sort("timestamp", -1))
    return JsonResponse(messages, safe=False)
