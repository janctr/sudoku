import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from "react";
import SudokuGame from "./components/SudokuGame/SudokuGame";
import {
  createSudokuPuzzle,
  createSudokuPuzzleTest,
  deepCopy,
  isValidSudoku,
  initEmptyGrid,
} from "./sudokuController";
import { CellValue, GameState, SudokuPuzzle } from "./types/index";

import "./App.sass";

function App() {
  const [isTakingNotes, setIsTakingNotes] = useState(false);
  const [gameState, setGameState] = useState(GameState.NOT_PLAYING);
  const [sudokuPuzzleState, setSudokuPuzzleState] = useState<SudokuPuzzle>(
    initEmptyGrid()
  );
  const [sudokuPuzzleAnswer, setSudokuPuzzleAnswer] = useState<SudokuPuzzle>();
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  useEffect(() => {
    const { puzzle, answer } = createSudokuPuzzleTest();

    setSudokuPuzzleState(puzzle);
    setSudokuPuzzleAnswer(answer);
  }, []);

  function selectCell(col: number, row: number) {
    setSelectedCell([col, row]);
  }

  function clearSelectedCell() {
    setSelectedCell(null);
  }

  function getSelectedCell() {
    if (selectedCell) {
      const [col, row] = selectedCell;
      return `${col}, ${row}`;
    } else {
      return "No selection";
    }
  }

  function setSelectedCellValue(value: CellValue) {
    if (selectedCell && gameState === GameState.PLAYING) {
      const [selectedCol, selectedRow] = selectedCell;

      if (sudokuPuzzleState[selectedCol][selectedRow].set) return;

      const newPuzzle = deepCopy(sudokuPuzzleState!);

      newPuzzle[selectedCol][selectedRow].value = value;


      if (isValidSudoku(newPuzzle, sudokuPuzzleAnswer!)) {
        console.log("DONE!");
        setGameState(GameState.COMPLETE);
      } else {
        console.log("WRONG");
      }

      for (const cellRow of newPuzzle) {
        cellRow.map((cell) => cell.value).join(", ");
      }

      setSudokuPuzzleState(newPuzzle);
    }
  }

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    console.log(event.key);

    switch(event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowDown':
        handleArrowEvent(event.key);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        handleNumberEvent(event.key);
        break;
      default:
        console.log('Irrelevant key event');
        break;
    }
  }

  function handleArrowEvent(direction: string) {
    if (!selectedCell) return;

    let [selectedCellCol, selectedCellRow] = selectedCell;

    switch(direction) {
      case 'ArrowRight':
        if (selectedCellRow >= 0 && selectedCellRow < 8) selectedCellRow++;
        break;
      case 'ArrowLeft':
        if (selectedCellRow > 0 && selectedCellRow <= 8) selectedCellRow--;
        break;
      case 'ArrowUp':
        if (selectedCellCol > 0 && selectedCellCol <= 8) selectedCellCol--;
        break;
      case 'ArrowDown':
        if (selectedCellCol >= 0 && selectedCellCol < 8) selectedCellCol++;
        break;
    }

    setSelectedCell([selectedCellCol, selectedCellRow]);
  }

  function handleNumberEvent(number: string) {
    let numberToInt = parseInt(number);

    setSelectedCellValue(numberToInt);
  }

  return (
    <div id="app" tabIndex={0} onKeyDown={handleOnKeyDown}>
      <header>
        <h1>Sudoku</h1>
        <p>
          <small>by Jan</small>
        </p>
        <p>Selected cell: {getSelectedCell()}</p>
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
  } else if (gameState === GameState.COMPLETE) {
    // TODO
    return (
      <>
        <button onClick={() => setGameState(GameState.PLAYING)}>
          Start Game
        </button>
      </>
    );
  } else {
    console.error("Error!!!!");
    return <div>ERROR WITH CONTROL BUTTON</div>;
  }
}

export default App;
