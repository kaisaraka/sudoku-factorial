import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from sudoku_engine import generate_sudoku
from datetime import date
import random

# 1. Настройка хеширования
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="NeoDoku Logic Engine")

# 2. РАЗРЕШАЕМ CORS (Критически важно для Vercel!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Разрешаем запросы с любых сайтов
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Инициализация Базы Данных SQLite
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

# --- СХЕМЫ ДАННЫХ (Pydantic) ---
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SudokuResponse(BaseModel):
    difficulty: str
    puzzle: list[list[int]]
    solution: list[list[int]]
    seed: str


# --- ЭНДПОИНТЫ АВТОРИЗАЦИИ ---
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


# --- ЭНДПОИНТЫ ИГРЫ (СУДОКУ) ---
@app.get("/")
async def root():
    return {"status": "System Online", "version": "2.0", "modules": ["Auth", "SudokuEngine"]}

@app.get("/api/sudoku/generate", response_model=SudokuResponse)
async def get_sudoku(difficulty: str = "medium", is_daily: bool = False):
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Invalid protocol.")
    
    # Уровень 4: Daily Challenge Seed
    if is_daily:
        random.seed(date.today().isoformat())
    else:
        random.seed()
        
    puzzle, solution = generate_sudoku(difficulty)
    
    return {
        "difficulty": difficulty,
        "puzzle": puzzle,
        "solution": solution,
        "seed": date.today().isoformat() if is_daily else "random"
    }

@app.get("/api/sudoku/hint")
async def get_ai_hint(row: int, col: int, correct_value: int):
    reasons = [
        f"By elimination in the 3x3 quadrant, {correct_value} is the only logical fit.",
        f"Cross-referencing Row {row+1} and Column {col+1} leaves {correct_value} as the absolute value.",
        f"Cognitive analysis confirms {correct_value} resolves the grid tension here."
    ]
    return {"hint": random.choice(reasons)}