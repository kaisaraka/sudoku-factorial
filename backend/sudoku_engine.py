import random
import copy

def is_valid(board, row, col, num):
    for i in range(9):
        if board[row][i] == num or board[i][col] == num:
            return False
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True

def fill_board(board):
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                nums = list(range(1, 10))
                random.shuffle(nums)
                for num in nums:
                    if is_valid(board, i, j, num):
                        board[i][j] = num
                        if fill_board(board):
                            return True
                        board[i][j] = 0
                return False
    return True

def generate_sudoku(difficulty="medium"):
    board = [[0 for _ in range(9)] for _ in range(9)]
    fill_board(board)
    solution = copy.deepcopy(board)
    
    holes = 45 # Medium
    if difficulty == "easy":
        holes = 35
    elif difficulty == "hard":
        holes = 55
        
    puzzle = copy.deepcopy(board)
    cells = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(cells)
    
    for r, c in cells[:holes]:
        puzzle[r][c] = 0
        
    return puzzle, solution