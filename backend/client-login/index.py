import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Business: Client login or registration
    Args: event with httpMethod, body containing name, phone, email
    Returns: HTTP response with client data
    '''
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip() or None
    
    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Name and phone are required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT * FROM clients WHERE phone = %s", (phone,))
    client = cur.fetchone()
    is_new = False
    
    if not client:
        cur.execute(
            "INSERT INTO clients (name, phone, email) VALUES (%s, %s, %s) RETURNING *",
            (name, phone, email)
        )
        client = cur.fetchone()
        is_new = True
        
        cur.execute(
            "SELECT id FROM employees WHERE status = 'online' AND role IN ('operator', 'admin', 'super_admin') ORDER BY RANDOM() LIMIT 1"
        )
        operator = cur.fetchone()
        operator_id = operator['id'] if operator else None
        
        cur.execute(
            "INSERT INTO chats (client_id, assigned_employee_id, status, assigned_at) VALUES (%s, %s, 'active', NOW()) RETURNING id",
            (client['id'], operator_id)
        )
        chat = cur.fetchone()
        
        conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'client': dict(client), 'isNew': is_new}, default=str),
        'isBase64Encoded': False
    }