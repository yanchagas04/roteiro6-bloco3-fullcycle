from flask import Flask, request, jsonify
import redis
import os

app = Flask(__name__)

redis_host = os.getenv('REDIS_HOST', 'redis-db')
redis_port = int(os.getenv('REDIS_PORT', 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

@app.route('/')
def home():
    visits = redis_client.incr('visits')
    return jsonify({
        'message': 'Flask + Redis Backend (Ubuntu 22.04)',
        'visits': visits,
        'status': 'running'
    })

@app.route('/health')
def health():
    try:
        redis_client.ping()
        return jsonify({'status': 'healthy', 'redis': 'connected'})
    except:
        return jsonify({'status': 'unhealthy', 'redis': 'disconnected'}), 500

@app.route('/messages', methods=['GET'])
def get_messages():
    messages = []
    keys = redis_client.keys('message:*')
    for key in keys:
        message = redis_client.get(key)
        messages.append({'id': key, 'content': message})
    return jsonify({'messages': messages})

@app.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    
    message_id = redis_client.incr('message_counter')
    key = f'message:{message_id}'
    redis_client.set(key, data['content'])
    
    return jsonify({
        'id': key,
        'content': data['content'],
        'message': 'Message created successfully'
    }), 201

@app.route('/stats')
def stats():
    total_messages = len(redis_client.keys('message:*'))
    total_visits = redis_client.get('visits') or 0
    
    return jsonify({
        'total_messages': total_messages,
        'total_visits': int(total_visits),
        'redis_info': {'host': redis_host, 'port': redis_port}
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)