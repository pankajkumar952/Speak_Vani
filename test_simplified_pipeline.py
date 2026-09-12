import requests
import json

print('=== 1. Test Categories ===')
cats = requests.get('http://localhost:8085/api/categories').json()
print(f'Fetched {len(cats)} categories. First: {cats[0]["name"]}')

print('\n=== 2. Test Random Topic ===')
topic = requests.get('http://localhost:8085/api/topics/random?categoryId=cat-1').json()
print(f'Random Topic: {topic["name"]} (ID: {topic["id"]})')

print('\n=== 3. Test AI Topic Information ===')
info = requests.get(f'http://localhost:8085/api/topics/{topic["id"]}/information').json()
print(f'Topic Summary: {info.get("summary")}')
print(f'Key Points count: {len(info.get("keyPoints", []))}')

print('\n=== 4. Test Create Practice Session ===')
session = requests.post('http://localhost:8085/api/sessions', json={
    'categoryId': 'cat-1',
    'topicId': topic['id'],
    'mode': 'SELF'
}).json()
session_id = session['sessionId']
print(f'Created Session ID: {session_id} | Status: {session["status"]} | Mode: {session["mode"]}')

print('\n=== 5. Test Upload Recording ===')
dummy_bytes = b'RIFF1234WAVEfmt 16000data1234'
resp = requests.post(f'http://localhost:8085/api/sessions/{session_id}/recording', files={
    'file': ('take.webm', dummy_bytes, 'video/webm')
})
print('Upload Recording Status:', resp.status_code)
completed_session = resp.json()
print('Completed Session:', json.dumps(completed_session, indent=2))

print('\n=== 6. Test Get Session ===')
get_resp = requests.get(f'http://localhost:8085/api/sessions/{session_id}').json()
print(f'Get Session ID: {get_resp["sessionId"]} | Status: {get_resp["status"]}')
