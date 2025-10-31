import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''
    Business: Universal API handler for GET requests
    Args: event with httpMethod, path, queryStringParameters
    Returns: HTTP response based on endpoint
    '''
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters', {}) or {}
    body = json.loads(event.get('body', '{}')) if event.get('body') else {}
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    action = params.get('action') or body.get('action')
    
    try:
        if action == 'get-messages':
            chat_id = params.get('chatId')
            cur.execute("SELECT * FROM messages WHERE chat_id = %s ORDER BY created_at ASC", (chat_id,))
            messages = cur.fetchall()
            result = {'messages': [dict(m) for m in messages]}
        
        elif action == 'get-employee-chats':
            employee_id = params.get('employeeId')
            cur.execute("""
                SELECT c.*, cl.name as client_name, cl.phone as client_phone, cl.email as client_email
                FROM chats c
                JOIN clients cl ON c.client_id = cl.id
                WHERE c.assigned_employee_id = %s AND c.status = 'active'
                ORDER BY c.created_at DESC
            """, (employee_id,))
            chats = cur.fetchall()
            result = {'chats': [dict(c) for c in chats]}
        
        elif action == 'update-status' and method == 'POST':
            employee_id = body.get('employeeId')
            status = body.get('status')
            cur.execute("UPDATE employees SET status = %s, updated_at = NOW() WHERE id = %s", (status, employee_id))
            conn.commit()
            result = {'success': True}
        
        elif action == 'get-employees':
            cur.execute("SELECT * FROM employees ORDER BY created_at DESC")
            employees = cur.fetchall()
            result = {'employees': [dict(e) for e in employees]}
        
        elif action == 'add-employee' and method == 'POST':
            login = body.get('login')
            password = body.get('password')
            full_name = body.get('full_name')
            role = body.get('role', 'operator')
            skills = body.get('skills', '')
            cur.execute(
                "INSERT INTO employees (login, password, full_name, role, skills, status) VALUES (%s, %s, %s, %s, %s, 'offline') RETURNING *",
                (login, password, full_name, role, skills)
            )
            conn.commit()
            employee = cur.fetchone()
            result = {'employee': dict(employee)}
        
        elif action == 'get-clients':
            cur.execute("SELECT * FROM clients ORDER BY created_at DESC")
            clients = cur.fetchall()
            result = {'clients': [dict(c) for c in clients]}
        
        elif action == 'get-all-chats':
            cur.execute("""
                SELECT c.*, cl.name as client_name, cl.phone as client_phone, 
                       e.full_name as employee_name
                FROM chats c
                LEFT JOIN clients cl ON c.client_id = cl.id
                LEFT JOIN employees e ON c.assigned_employee_id = e.id
                ORDER BY c.created_at DESC
            """)
            chats = cur.fetchall()
            result = {'chats': [dict(c) for c in chats]}
        
        else:
            result = {'error': 'Unknown action'}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        cur.close()
        conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }