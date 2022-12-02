import Difficulty from "./Difficulty";
import GameState from "./GameState";

type SudokuPuzzle = Cell[][];
type SudokuPuzzleBasic = number[][];

export interface Cell {
    value: CellValue;
    set: boolean; // Determines if cell value is generated
    notes: CellEditValue
}

type CellValue = number;

type CellEditValue = number[];

export { GameState, Difficulty };

export type { CellValue, SudokuPuzzle, SudokuPuzzleBasic
 };
