import { SudokuPuzzle, SudokuPuzzleBasic } from "./types";

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
]

export function createSudokuPuzzleTest(): { puzzle: SudokuPuzzle, answer: SudokuPuzzle } {
  const puzzle = createSudokuPuzzle();

  return { puzzle, answer: convertSudokuPuzzle(puzzleAAnswer)};
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
  const puzzle = initRandomGrid();

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

function initRandomGrid(): SudokuPuzzle {
  const puzzle = initEmptyGrid();

  for (let col = 0; col < puzzle.length; col++) {
    for (let row = 0; row < puzzle[col].length; row++) {
      puzzle[row][col] = { value: randomNumber(0, 9), set: false, notes: [] };
    }
  }

  return puzzle;
}

function initSequentialGrid(): SudokuPuzzle {
  const puzzle = initEmptyGrid();

  let num = 1;
  for (let col = 0; col < puzzle.length; col++) {
    for (let row = 0; row < puzzle[col].length; row++) {
      puzzle[row][col] = { value: num, set: false, notes: [] };
      num++;
    }
  }

  return puzzle;
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

export function initUnscrambledSudoku(): SudokuPuzzle {
  const puzzle = initEmptyGrid();

  let curr = 0;
  let i = 1;
  for (let col=0; col<puzzle.length; col++) {
    curr = i;
    for (let row=0; row<puzzle[col].length; row++) {
      puzzle[col][row] = {
        value: curr === 9 ? 9 : (curr % puzzle.length),
        set: true,
        notes: []
      }
      
      curr++;
    }

    i++;
  }

  return puzzle;
}

console.dir(initUnscrambledSudoku());

export function deepCopy(puzzle: SudokuPuzzle): SudokuPuzzle {
  return JSON.parse(JSON.stringify(puzzle));
}

export function deepCopyBasic(puzzle: SudokuPuzzleBasic): SudokuPuzzleBasic {
  return JSON.parse(JSON.stringify(puzzle));
}

function generateSudoku(): SudokuPuzzle {
  const grid = initEmptyGrid();

  // Fill all the diagonal 3x3 matrices.

  // Fill recursively rest of the non-diagonal matrices.
  //For every cell to be filled, we try all numbers until
  //we find a safe number to be placed.

  //Once matrix is fully filled, remove K elements
  //randomly to complete game.

  return grid;
}

function generateSudokuHelper(puzzle: SudokuPuzzle): SudokuPuzzle {
  return puzzle;
}

/**
function generateSudokuShitty(): SudokuPuzzle {
  const grid = initEmptyGrid();

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      let validNumbers = generateValidNumbers(grid, [col, row]);

      console.dir("Valid numbers: ", validNumbers);

      if (!(validNumbers.length > 0)) {
        // No valid moves
        // Avoid moving to next cell
        console.log(`Could not find any valid moves at ${col},${row}`);

        if (row === 0) {
          if (col !== 0) {
            grid[col - 1][8] = "";
            col = col - 1;
            row = 7;
          }
        } else if (row === 1) {
          if (col !== 0) {
            grid[col][0] = "";
            col = col - 1;
            row = 8;
          }
        } else {
          grid[col][row - 1] = "";
          row = row - 2;
        }
      } else {
        const randomIndex = getRandomInt(0, validNumbers.length);

        console.log(`Placed ${validNumbers[randomIndex]} at ${col},${row}`);
        grid[col][row] = validNumbers[randomIndex];
      }
    }
  }

  return grid;
}

 */

function generateSudokuBad(): SudokuPuzzle {
  const grid = initEmptyGrid();

  let freeCells: [number, number][] = [];
  let processedCells: [number, number][] = [];

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      freeCells.push([col, row]);
    }
  }

  function print() {
    for (const col of freeCells) {
      console.log(col);
    }
  }

  // Shuffle
  freeCells.sort((a, b) => 0.5 - Math.random());

  // Algorithm
  while (freeCells.length > 0) {
    const num = randomNumber(1, 9);
    const currCell = freeCells.pop()!;

    if (isValidMove(grid, num, currCell)) {
      const [col, row] = currCell;

      grid[col][row] = { value: num, set: false, notes: [] };

      processedCells.push(currCell);
    } else {
    }
  }
  return grid;
}

function randomNumber(floor: number, ceil: number): number {
  return Math.floor(Math.random() * ceil) + floor;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function isValidMove(
  puzzle: SudokuPuzzle,
  value: number,
  cellCoordinate: [number, number]
): boolean {
  const [col, row] = cellCoordinate;

  if (!Number.isNaN(value)) return false;

  if (!Number.isInteger(value)) return false;

  if (!(1 <= value && value <= 9)) return false;

  // Check column
  for (let checkRow = 0; checkRow < 9; checkRow++) {
    if (checkRow === row) continue;

    if (puzzle[col][checkRow].value === value) {
      return false;
    }
  }

  // Check row
  for (let checkCol = 0; checkCol < 9; checkCol++) {
    if (checkCol === row) continue;

    if (puzzle[checkCol][row].value === value) {
      return false;
    }
  }

  // Check box
  const submatrix = [Math.floor(col / 3), Math.floor(row / 3)];
  const [submatrixCol, submatrixRow] = submatrix;
  for (
    let colTemp = submatrixCol * 3;
    colTemp < submatrixCol * 3 + 3;
    colTemp++
  ) {
    for (
      let rowTemp = submatrixRow * 3;
      rowTemp < submatrixRow * 3 + 3;
      rowTemp++
    ) {
      if (col === colTemp && row === rowTemp) continue;

      if (puzzle[colTemp][rowTemp].value === value) {
        return false;
      }
    }
  }

  return true;
}

function generateValidNumbers(
  puzzle: SudokuPuzzle,
  coordinate: [number, number]
): number[] {
  const [col, row] = coordinate;

  let validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let existingNumbersSet = new Set<number>();

  for (let checkRow = 0; checkRow < 9; checkRow++) {
    if (checkRow === row) continue;

    const numAtCell = puzzle[col][checkRow];

    if (Number.isInteger(numAtCell)) existingNumbersSet.add(Number(numAtCell));
  }

  for (let checkCol = 0; checkCol < 9; checkCol++) {
    if (checkCol === row) continue;

    const numAtCell = puzzle[checkCol][row];

    if (Number.isInteger(numAtCell)) existingNumbersSet.add(Number(numAtCell));
  }

  const submatrix = [Math.floor(col / 3), Math.floor(row / 3)];
  const [submatrixCol, submatrixRow] = submatrix;
  for (
    let colTemp = submatrixCol * 3;
    colTemp < submatrixCol * 3 + 3;
    colTemp++
  ) {
    for (
      let rowTemp = submatrixRow * 3;
      rowTemp < submatrixRow * 3 + 3;
      rowTemp++
    ) {
      if (col === colTemp && row === rowTemp) continue;

      const numAtCell = puzzle[colTemp][rowTemp];

      if (Number.isInteger(numAtCell))
        existingNumbersSet.add(Number(numAtCell));
    }
  }

  const existingNumbersArr = Array.from(existingNumbersSet);

  validNumbers = validNumbers.filter(
    (value) => !(existingNumbersArr.indexOf(value) >= 0)
  );

  return validNumbers;
}

/** Check if a SudokuPuzzle is valid */
export function isValidSudoku(puzzle: SudokuPuzzle, answer: SudokuPuzzle): boolean {

  for (let col=0; col<puzzle.length; col++) {
    for (let row=0; row<puzzle[col].length; row++) {
      if (puzzle[col][row].value !== answer[col][row].value) {
        return false;
      }
    }
  }

  return true;
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