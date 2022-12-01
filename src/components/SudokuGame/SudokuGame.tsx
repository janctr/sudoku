import { Dispatch, KeyboardEventHandler, SetStateAction, SyntheticEvent } from "react";
import { Cell, CellValue, GameState, SudokuPuzzle } from "../../types";
import SudokuCell from "./SudokuCell";

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

  let hoveredCellCol: number, hoveredCellRow: number, hoveredCellValue: number;

  if (hoveredCell) {
    hoveredCellCol = hoveredCell[0];
    hoveredCellRow = hoveredCell[1];

    hoveredCellValue = sudokuPuzzleState[hoveredCellCol][hoveredCellRow].value;
  } else {
    hoveredCellValue = 0;
  }

  const cells = sudokuPuzzleState.map((col, colIndex) => {
    return col.map((cell, rowIndex) => (
      <SudokuCell
        isTakingNotes={isTakingNotes}
        coordinate={[colIndex, rowIndex]}
        cellValue={cell}
        selectCell={selectCell}
        selectedCell={selectedCell}
        clearSelectedCell={clearSelectedCell}
        hoveredCell={hoveredCell}
        setHoveredCell={setHoveredCell}
        hoveredCellValue={hoveredCellValue}
      />
    ));
  });

  const numberControls = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => {
    const handleOnClick = () => {
      console.log('y')
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
    setSelectedCellValue(0);
  }

  const clearControl = <span className="sudoku-control" onClick={handleClearCellValue}>Clear</span>

  return (
    <div className="sudoku-game">
      <div className="sudoku-grid">{cells}</div>
      <div className="sudoku-controls">{numberControls} {clearControl}</div>
    </div>
  );
}
