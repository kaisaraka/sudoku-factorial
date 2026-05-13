from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sudoku_engine import generate_sudoku

app = FastAPI(title="NeoDoku Logic Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SudokuResponse(BaseModel):
    difficulty: str
    puzzle: list[list[int]]
    solution: list[list[int]]

@app.get("/")
async def root():
    return {"status": "System Online"}

@app.get("/api/sudoku/generate", response_model=SudokuResponse)
async def get_sudoku(difficulty: str = "medium"):
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Invalid protocol.")
    
    puzzle, solution = generate_sudoku(difficulty)
    
    return {
        "difficulty": difficulty,
        "puzzle": puzzle,
        "solution": solution
    }