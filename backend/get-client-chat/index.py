import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Business: Get or create client chat with messages
    Args: event with queryStringParameters containing clientId
    Returns: HTTP response with chat and messages
    '''
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {})
    client_id = params.get('clientId')
    
    if not client_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'clientId is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT * FROM chats WHERE client_id = %s AND status = 'active' ORDER BY created_at DESC LIMIT 1", (client_id,))
    chat = cur.fetchone()
    
    if not chat:
        cur.execute(
            "SELECT id FROM employees WHERE status = 'online' AND role IN ('operator', 'admin', 'super_admin') ORDER BY RANDOM() LIMIT 1"
        )
        operator = cur.fetchone()
        operator_id = operator['id'] if operator else None
        
        cur.execute(
            "INSERT INTO chats (client_id, assigned_employee_id, status, assigned_at) VALUES (%s, %s, 'active', NOW()) RETURNING *",
            (client_id, operator_id)
        )
        chat = cur.fetchone()
        conn.commit()
    
    cur.execute("SELECT * FROM messages WHERE chat_id = %s ORDER BY created_at ASC", (chat['id'],))
    messages = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'chatId': chat['id'],
            'messages': [dict(m) for m in messages]
        }, default=str),
        'isBase64Encoded': False
    }
