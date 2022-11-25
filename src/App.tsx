import React, { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import SudokuGame from "./components/SudokuGame/SudokuGame";
import { createSudokuPuzzle, deepCopy } from "./sudokuController";
import { CellValue, GameState } from "./types/index";

import "./App.sass";

function App() {
  const [isTakingNotes, setIsTakingNotes] = useState(false);
  const [gameState, setGameState] = useState(GameState.NOT_PLAYING);
  const [sudokuPuzzleState, setSudokuPuzzleState] = useState(
    createSudokuPuzzle()
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null)

  function selectCell(col: number, row: number) {
    setSelectedCell([col, row])
  }

  function clearSelectedCell() {
    setSelectedCell(null);
  }

  function getSelectedCell() {
    if (selectedCell) {
      const [col, row] = selectedCell;
      return `${col}, ${row}`
    } else {
      return 'No selection'
    }
  }

  function setSelectedCellValue(value: CellValue) {
    if (selectedCell) {
      const [selectedCol, selectedRow] = selectedCell;

      const newPuzzle = deepCopy(sudokuPuzzleState);

      newPuzzle[selectedCol][selectedRow] = value;

      setSudokuPuzzleState(newPuzzle);
    }
  }

  return (
    <div id="app">
      <header>
        <h1>Sudoku</h1>
        <p><small>by Jan</small></p>
        <p>Selected cell: { getSelectedCell() }</p>
      </header>

      <main>
        <div className="sudoku-game-container">
          <GameInfo gameState={gameState} setGameState={setGameState} />
          <SudokuGame
            gameState={gameState}
            setGameState={setGameState}
            sudokuPuzzleState={sudokuPuzzleState}
            setSudokuPuzzleState={setSudokuPuzzleState}
            isTakingNotes={isTakingNotes}
            setIsTakingNotes={setIsTakingNotes}
            selectedCell={selectedCell}
            selectCell={selectCell}
            clearSelectedCell={clearSelectedCell}
            setSelectedCellValue={setSelectedCellValue}
            hoveredCell={hoveredCell}
            setHoveredCell={setHoveredCell}
          />
        </div>
      </main>
    </div>
  );
}

function GameInfo(props: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}) {
  return (
    <div className="game-info">
      <div className="controls">
        <Controls
          gameState={props.gameState}
          setGameState={props.setGameState}
        />
      </div>
    </div>
  );
}

function Controls(props: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}) {
  const { gameState, setGameState } = props;

  if (gameState === GameState.NOT_PLAYING) {
    return (
      <button onClick={() => setGameState(GameState.PLAYING)}>
        Start Game
      </button>
    );
  } else if (gameState === GameState.PLAYING) {
    return (
      <>
        <button onClick={() => setGameState(GameState.PAUSED)}>Pause</button>
        <button onClick={() => setGameState(GameState.NOT_PLAYING)}>
          Quit
        </button>
      </>
    );
  } else if (gameState === GameState.PAUSED) {
    return (
      <>
        <button onClick={() => setGameState(GameState.PLAYING)}>Unpause</button>
        <button onClick={() => setGameState(GameState.NOT_PLAYING)}>
          Quit
        </button>
      </>
    );
  } else {
    console.error("Error!!!!");
    return <div>ERROR WITH CONTROL BUTTON</div>;
  }
}

export default App;
