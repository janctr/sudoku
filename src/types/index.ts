import GameState from "./GameState";

type SudokuPuzzle = CellValue[][];
type CellValue = number | "" | CellEditValue;
type CellEditValue = number[];

export { GameState };

export type { CellValue, SudokuPuzzle };
