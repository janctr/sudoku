import { SudokuPuzzle, SudokuPuzzleBasic } from "./types";
import { makepuzzle, solvepuzzle, ratepuzzle } from "sudoku";

const puzzleA = [
  [2, 3, 0, 4, 1, 5, 0, 6, 8],
  [0, 8, 0, 2, 3, 6, 5, 1, 9],
  [1, 6, 0, 9, 8, 7, 2, 3, 4],
  [3, 1, 7, 0, 9, 4, 0, 2, 5],
  [4, 5, 8, 1, 2, 0, 6, 9, 7],
  [9, 2, 6, 0, 5, 8, 3, 0, 1],
  [0, 0, 0, 5, 0, 0, 1, 0, 2],
  [0, 0, 0, 8, 4, 2, 9, 0, 3],
  [5, 9, 2, 3, 7, 1, 4, 8, 6],
];

const puzzleAAnswer = [
  [2, 3, 9, 4, 1, 5, 7, 6, 8],
  [7, 8, 4, 2, 3, 6, 5, 1, 9],
  [1, 6, 5, 9, 8, 7, 2, 3, 4],
  [3, 1, 7, 6, 9, 4, 8, 2, 5],
  [4, 5, 8, 1, 2, 3, 6, 9, 7],
  [9, 2, 6, 7, 5, 8, 3, 4, 1],
  [8, 4, 3, 5, 6, 9, 1, 7, 2],
  [6, 7, 1, 8, 4, 2, 9, 5, 3],
  [5, 9, 2, 3, 7, 1, 4, 8, 6],
];

export function createSudokuPuzzleTest(): {
  puzzle: SudokuPuzzle;
  answer: SudokuPuzzle;
} {
  const puzzle = createSudokuPuzzle();

  return { puzzle, answer: convertSudokuPuzzle(puzzleAAnswer) };
}

function convertSudokuPuzzle(regularPuzzle: number[][]): SudokuPuzzle {
  const convertedPuzzle = initEmptyGrid();

  for (let col = 0; col < regularPuzzle.length; col++) {
    for (let row = 0; row < regularPuzzle[col].length; row++) {
      convertedPuzzle[col][row] =
        regularPuzzle[col][row] === 0
          ? {
              value: 0,
              set: false,
              notes: [],
            }
          : {
              value: regularPuzzle[col][row],
              set: true,
              notes: [],
            };
    }
  }

  return convertedPuzzle;
}

export function createSudokuPuzzle(): SudokuPuzzle {
  const puzzle = makepuzzle();

  for (let col = 0; col < puzzleA.length; col++) {
    for (let row = 0; row < puzzleA[col].length; row++) {
      puzzle[col][row] =
        puzzleA[col][row] === 0
          ? {
              value: 0,
              set: false,
              notes: [],
            }
          : {
              value: puzzleA[col][row],
              set: true,
              notes: [],
            };
    }
  }
  return puzzle;
}

export function deepCopy(puzzle: SudokuPuzzle): SudokuPuzzle {
  return JSON.parse(JSON.stringify(puzzle));
}

export function deepCopyBasic(puzzle: SudokuPuzzleBasic): SudokuPuzzleBasic {
  return JSON.parse(JSON.stringify(puzzle));
}

export default class SudokuController {
  rows: number;
  cols: number;
  grid: SudokuPuzzle;

  constructor(N: number) {
    this.rows = N;
    this.cols = N;
    this.grid = initEmptyGrid();
  }

  initEmptyGrid(): SudokuPuzzle {
    const puzzle = new Array(9);

    for (let i = 0; i < puzzle.length; i++) {
      puzzle[i] = new Array(9);
    }

    for (let col = 0; col < puzzle.length; col++) {
      for (let row = 0; row < puzzle[col].length; row++) {
        puzzle[col][row] = 0;
      }
    }

    return puzzle;
  }
}

/** Check if a SudokuPuzzle is valid */
export function isValidSudoku(
  puzzle: SudokuPuzzle,
  answer: SudokuPuzzle
): boolean {
  for (let col = 0; col < puzzle.length; col++) {
    for (let row = 0; row < puzzle[col].length; row++) {
      if (puzzle[col][row].value !== answer[col][row].value) {
        return false;
      }
    }
  }

  return true;
}

export function initEmptyGrid(): SudokuPuzzle {
  const puzzle = new Array(9);

  for (let i = 0; i < puzzle.length; i++) {
    puzzle[i] = new Array(9);
  }

  for (let col = 0; col < puzzle.length; col++) {
    for (let row = 0; row < puzzle[col].length; row++) {
      puzzle[col][row] = 0;
    }
  }

  return puzzle;
}
