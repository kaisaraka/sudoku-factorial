from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sudoku_engine import generate_sudoku
from datetime import date
import random

app = FastAPI(title="NeoDoku Logic Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Разрешаем всем (нужно для Vercel)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SudokuResponse(BaseModel):
    difficulty: str
    puzzle: list[list[int]]
    solution: list[list[int]]
    seed: str

@app.get("/")
async def root():
    return {"status": "System Online", "version": "1.0", "ai_module": "Active"}

@app.get("/api/sudoku/generate", response_model=SudokuResponse)
async def get_sudoku(difficulty: str = "medium", is_daily: bool = False):
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Invalid protocol.")
    
    # Уровень 4: Daily Challenge Seed
    if is_daily:
        random.seed(date.today().isoformat())
    else:
        random.seed() # Случайный сид
        
    puzzle, solution = generate_sudoku(difficulty)
    
    return {
        "difficulty": difficulty,
        "puzzle": puzzle,
        "solution": solution,
        "seed": date.today().isoformat() if is_daily else "random"
    }

@app.get("/api/sudoku/hint")
async def get_ai_hint(row: int, col: int, correct_value: int):
    # Уровень 4: AI Coach объяснения
    reasons = [
        f"By elimination in the 3x3 quadrant, {correct_value} is the only logical fit.",
        f"Cross-referencing Row {row+1} and Column {col+1} leaves {correct_value} as the absolute value.",
        f"Cognitive analysis confirms {correct_value} resolves the grid tension here."
    ]
    return {"hint": random.choice(reasons)}