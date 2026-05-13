import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext # pip install "passlib[bcrypt]"

# Настройка хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Создаем базу данных и таблицу пользователей при старте
def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/api/auth/register")
async def register(user: UserRegister):
    hashed_password = pwd_context.hash(user.password)
    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
                       (user.username, user.email, hashed_password))
        conn.commit()
        return {"status": "success", "message": "Operator initialized"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Callsign or Email already active")
    finally:
        conn.close()

@app.post("/api/auth/login")
async def login(user: UserLogin):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password FROM users WHERE email = ?", (user.email,))
    db_user = cursor.fetchone()
    conn.close()

    if db_user and pwd_context.verify(user.password, db_user[2]):
        return {"status": "success", "user_id": db_user[0], "username": db_user[1]}
    
    raise HTTPException(status_code=401, detail="Authentication failed")