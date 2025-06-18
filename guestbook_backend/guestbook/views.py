from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
from datetime import datetime
from bson import ObjectId

# Convert ObjectId to string
def serialize_message(message):
    return {
        'id': str(message['_id']),
        'name': message['name'],
        'content': message['content'],
        'timestamp': message['timestamp'],
        'reactions': message.get('reactions', {'like': 0, 'love': 0, 'funny': 0})
    }

@csrf_exempt
def submit_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = {
            'name': data['name'],
            'content': data['content'],
            'timestamp': datetime.utcnow(),
            'reactions': {'like': 0, 'love': 0, 'funny': 0}  # Add default reactions
        }
        settings.MONGO_COLLECTION.insert_one(message)
        return JsonResponse({'status': 'Message saved!'})

def get_messages(request):
    messages = list(settings.MONGO_COLLECTION.find().sort("timestamp", -1))
    return JsonResponse([serialize_message(msg) for msg in messages], safe=False)

@csrf_exempt
def react_message(request, msg_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            reaction_type = data.get('type')
            if reaction_type in ['like', 'love', 'funny']:
                result = settings.MONGO_COLLECTION.update_one(
                    {'_id': ObjectId(msg_id)},
                    {'$inc': {f'reactions.{reaction_type}': 1}}
                )
                if result.modified_count > 0:
                    return JsonResponse({'status': 'Reaction updated!'})
            return JsonResponse({'status': 'Invalid reaction or message not found'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
