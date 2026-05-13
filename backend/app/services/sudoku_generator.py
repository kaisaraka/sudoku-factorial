import random
import copy

def is_valid(grid, row, col, num):
    for x in range(9):
        if grid[row][x] == num or grid[x][col] == num:
            return False
    start_row, start_col = row - row % 3, col - col % 3
    for i in range(3):
        for j in range(3):
            if grid[i + start_row][j + start_col] == num:
                return False
    return True

def solve_sudoku(grid):
    for i in range(9):
        for j in range(9):
            if grid[i][j] == 0:
                for num in range(1, 10):
                    if is_valid(grid, i, j, num):
                        grid[i][j] = num
                        if solve_sudoku(grid):
                            return True
                        grid[i][j] = 0
                return False
    return True

def generate_sudoku(difficulty="medium"):
    grid = [[0]*9 for _ in range(9)]
    
    # Заполняем 3 диагональных блока для рандомизации старта
    for i in range(0, 9, 3):
        nums = random.sample(range(1, 10), 9)
        idx = 0
        for r in range(3):
            for c in range(3):
                grid[i+r][i+c] = nums[idx]
                idx += 1
                
    # Решаем доску, чтобы получить полную картину (solution)
    solve_sudoku(grid)
    solution = copy.deepcopy(grid)

    # Удаляем числа в зависимости от сложности
    attempts = {"easy": 30, "medium": 45, "hard": 55}
    removals = attempts.get(difficulty, 45)

    while removals > 0:
        row = random.randint(0, 8)
        col = random.randint(0, 8)
        if grid[row][col] != 0:
            grid[row][col] = 0
            removals -= 1

    return {
        "puzzle": grid,
        "solution": solution,
        "difficulty": difficulty
    }