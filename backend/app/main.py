from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.sudoku_generator import generate_sudoku

app = FastAPI(
    title="Neuro-Sudoku API",
    description="Backend for the Cognitive Sudoku Trainer"
)

# Разрешаем фронтенду (порт 3000) общаться с нашим бэкендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API is running!"}

# Наш эндпоинт для генерации доски
@app.get("/api/sudoku/generate")
def get_sudoku(difficulty: str = "medium"):
    board_data = generate_sudoku(difficulty)
    return board_data