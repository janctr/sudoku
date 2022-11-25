import { Dispatch, SetStateAction } from "react";
import { CellValue, GameState, SudokuPuzzle } from "../../types";
import Cell from "./Cell";

export default function SudokuGame(props: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  sudokuPuzzleState: SudokuPuzzle;
  setSudokuPuzzleState: Dispatch<SetStateAction<SudokuPuzzle>>;
  isTakingNotes: boolean;
  setIsTakingNotes: Dispatch<SetStateAction<boolean>>;
  selectCell: (col: number, row: number) => void;
  clearSelectedCell: () => void;
  selectedCell: [number, number] | null;
  setSelectedCellValue: (value: CellValue) => void;
  hoveredCell: [number, number] | null;
  setHoveredCell: Dispatch<SetStateAction<[number, number] | null>>
}) {
  const {
    gameState,
    setGameState,
    sudokuPuzzleState,
    setSudokuPuzzleState,
    isTakingNotes,
    selectCell,
    clearSelectedCell,
    selectedCell,
    setSelectedCellValue,
    hoveredCell,
    setHoveredCell
  } = props;

  const cells = sudokuPuzzleState.map((col, i) => {
    return col.map((row, j) => (
      <Cell
        isTakingNotes={isTakingNotes}
        coordinate={[i, j]}
        value={row}
        selectCell={selectCell}
        selectedCell={selectedCell}
        clearSelectedCell={clearSelectedCell}
        hoveredCell={hoveredCell}
        setHoveredCell={setHoveredCell}
      />
    ));
  });

  const numberControls = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => {
    const handleOnClick = () => {
      setSelectedCellValue(value);
    };
    return (
      <span
        key={`number-control-${index}`}
        className="sudoku-control number-control"
        onClick={handleOnClick}
      >
        {value}
      </span>
    );
  });

  function handleClearCellValue() {
    setSelectedCellValue('');
  }

  const clearControl = <span className="sudoku-control" onClick={handleClearCellValue}>Clear</span>

  return (
    <div className="sudoku-game">
      <div className="sudoku-grid">{cells}</div>
      <div className="sudoku-controls">{numberControls} {clearControl}</div>
    </div>
  );
}
