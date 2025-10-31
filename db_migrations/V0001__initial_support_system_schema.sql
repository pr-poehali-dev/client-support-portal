-- Создание таблицы сотрудников
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'okk', 'operator', 'editor', 'jira_processor')),
    status VARCHAR(50) DEFAULT 'offline' CHECK (status IN ('online', 'jira', 'rest', 'training', 'offline')),
    skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы клиентов
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(phone)
);

-- Создание таблицы чатов
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    assigned_employee_id INTEGER REFERENCES employees(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'postponed')),
    resolution VARCHAR(50) CHECK (resolution IN ('solved', 'nto', 'postponed')),
    employee_comment TEXT,
    client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
    qc_score INTEGER CHECK (qc_score >= 0 AND qc_score <= 100),
    qc_comment TEXT,
    qc_reviewer_id INTEGER REFERENCES employees(id),
    qc_reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    postponed_until TIMESTAMP,
    assigned_at TIMESTAMP,
    timer_extended_at TIMESTAMP
);

-- Создание таблицы сообщений
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id),
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('client', 'employee')),
    sender_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы корпоративных чатов
CREATE TABLE IF NOT EXISTS corporate_chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Участники корпоративных чатов
CREATE TABLE IF NOT EXISTS corporate_chat_members (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES corporate_chats(id),
    employee_id INTEGER REFERENCES employees(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chat_id, employee_id)
);

-- Сообщения в корпоративных чатах
CREATE TABLE IF NOT EXISTS corporate_messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES corporate_chats(id),
    employee_id INTEGER REFERENCES employees(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Смены сотрудников
CREATE TABLE IF NOT EXISTS shifts (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jira задачи
CREATE TABLE IF NOT EXISTS jira_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_by INTEGER REFERENCES employees(id),
    assigned_to INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- База знаний
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    created_by INTEGER REFERENCES employees(id),
    updated_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Новости
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка супер админа
INSERT INTO employees (login, password, full_name, role, status) 
VALUES ('123', '803254', 'Супер Администратор', 'super_admin', 'online')
ON CONFLICT (login) DO NOTHING;