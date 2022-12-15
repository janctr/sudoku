import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from "react";
import SudokuGame from "./components/SudokuGame/SudokuGame";
import {
  createSudokuPuzzle,
  deepCopy,
  isValidSudoku,
  initEmptyGrid,
} from "./sudokuController";

import { CellValue, Difficulty, GameState, SudokuPuzzle } from "./types/index";

import "./App.sass";
import StartScreen from "./components/StartScreen/StartScreen";
import GameCompleteScreen from "./components/GameCompleteScreen/GameCompleteScreen";
import { useTimer } from "./hooks/Timer";

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

  // const { secondsElapsed, startTimer, pauseTimer, resumeTimer, clearTimer } =
  //   useTimer();

  useEffect(() => {
    createSudokuPuzzle().then(({ puzzle, answer }) => {
      setSudokuPuzzleState(puzzle);
      setSudokuPuzzleAnswer(answer);
    });
  }, []);

  function selectCell(col: number, row: number) {
    setSelectedCell([col, row]);
  }

  function clearSelectedCell() {
    setSelectedCell(null);
  }

  function getSelectedCellString() {
    if (selectedCell !== null) {
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

      // TODO: Only call this if the board has 0 cells to fill
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

  /* Navigation in sudoku grid */
  function handleOnKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    console.log(event.key);

    // TODO: Make Alt + `direction` jump 2 spaces

    switch (event.key) {
      case "ArrowRight":
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowDown":
        handleArrowEvent(event.key);
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        handleNumberEvent(event.key);
        break;
      case "Backspace":
        setSelectedCellValue(0);
        break;
      case "Escape":
        clearSelectedCell();
        break;
      default:
        console.log("Irrelevant key event");
        break;
    }
  }

  function handleArrowEvent(direction: string) {
    if (!selectedCell) return;

    let [selectedCellCol, selectedCellRow] = selectedCell;

    switch (direction) {
      case "ArrowRight":
        if (selectedCellRow >= 0 && selectedCellRow < 8) selectedCellRow++;
        break;
      case "ArrowLeft":
        if (selectedCellRow > 0 && selectedCellRow <= 8) selectedCellRow--;
        break;
      case "ArrowUp":
        if (selectedCellCol > 0 && selectedCellCol <= 8) selectedCellCol--;
        break;
      case "ArrowDown":
        if (selectedCellCol >= 0 && selectedCellCol < 8) selectedCellCol++;
        break;
    }

    setSelectedCell([selectedCellCol, selectedCellRow]);
  }

  function handleNumberEvent(number: string) {
    let numberToInt = parseInt(number);

    setSelectedCellValue(numberToInt);
  }

  /****************************/

  async function startGame(difficulty: Difficulty) {
    if (gameState !== GameState.NOT_PLAYING) {
      throw new Error("Game state must be NOT_PLAYING to start game.");
    }

    console.log("Initializing game with " + difficulty + " difficulty");

    const { puzzle, answer } = await createSudokuPuzzle(difficulty);

    setSudokuPuzzleState(puzzle);
    setSudokuPuzzleAnswer(answer);

    //startTimer();
    setGameState(GameState.PLAYING);
  }

  function pauseGame() {
    if (gameState !== GameState.PLAYING) {
      throw new Error("Game state must be PLAYING to pause game");
    }

    setGameState(GameState.PAUSED);

    //pauseTimer();
  }

  function resumeGame() {
    if (gameState !== GameState.PAUSED) {
      throw new Error("Game state must be PAUSED to resume game");
    }

    setGameState(GameState.PLAYING);

    //resumeTimer();
  }

  function quitGame() {
    if (gameState !== GameState.PLAYING) {
      throw new Error("Game state must be PLAYING to quit game");
    }

    setGameState(GameState.NOT_PLAYING);

    //clearTimer();
  }

  function dummyFunc() {
    setGameState(GameState.PLAYING);
  }

  function ViewController(props: { gameState: GameState }): JSX.Element {
    const { gameState } = props;

    switch (gameState) {
      case GameState.NOT_PLAYING:
        return (
          <StartScreen
            onStartEasyGame={() => startGame(Difficulty.EASY)}
            onStartMediumGame={() => startGame(Difficulty.MEDIUM)}
            onStartHardGame={() => startGame(Difficulty.HARD)}
          />
        );
      case GameState.PLAYING:
      case GameState.PAUSED:
        return (
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
        );
      case GameState.COMPLETE:
        return (
          <GameCompleteScreen
            onStartEasyGame={dummyFunc}
            onStartMediumGame={dummyFunc}
            onStartHardGame={dummyFunc}
          />
        );
    }

    return (
      <div className="error-screen">
        <h1>ERROR</h1>
      </div>
    );
  }

  return (
    <div id="app" tabIndex={0} onKeyDown={handleOnKeyDown}>
      {/* <header>
        <h1>Sudoku</h1>
        <p>
          <small>by Jan</small>
        </p>
      </header> */}

      <main>
        <div className="sudoku-game-container">
          <GameInfo
            gameState={gameState}
            setGameState={setGameState}
            //timeElapsed={secondsElapsed}
            handleQuitGame={quitGame}
            handlePauseGame={pauseGame}
            handleResumeGame={resumeGame}
          />
          <ViewController gameState={gameState} />
        </div>
      </main>
    </div>
  );
}

function GameInfo(props: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  timeElapsed?: number;
  handleQuitGame: () => void;
  handlePauseGame: () => void;
  handleResumeGame: () => void;
}) {
  const { gameState, handleQuitGame, handlePauseGame, handleResumeGame } =
    props;

  return (
    <div className="game-info">
      <div className="controls">
        <Controls
          gameState={props.gameState}
          setGameState={props.setGameState}
          handleQuitGame={handleQuitGame}
          handlePauseGame={handlePauseGame}
          handleResumeGame={handleResumeGame}
        />
        {(gameState === GameState.PLAYING ||
          gameState === GameState.PAUSED) && (
          <span className="time-elapsed">{formatTimeElapsed(props.timeElapsed)}</span>
        )}
      </div>
    </div>
  );
}

function formatTimeElapsed(timeElapsed: number | null | undefined): string {
  if (!timeElapsed) return "00:00";

  const seconds = timeElapsed % 60;

  const minutes = Math.floor(timeElapsed / 60);

  return `${minutes === 0 ? "00" : minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
}

function Controls(props: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  handleQuitGame: () => void;
  handlePauseGame: () => void;
  handleResumeGame: () => void;
}) {
  const {
    gameState,
    setGameState,
    handleQuitGame,
    handlePauseGame,
    handleResumeGame,
  } = props;

  if (gameState === GameState.NOT_PLAYING) {
    return <></>;
  } else if (gameState === GameState.PLAYING) {
    return (
      <>
        <button onClick={handlePauseGame}>Pause</button>
        <button onClick={handleQuitGame}>Quit</button>
      </>
    );
  } else if (gameState === GameState.PAUSED) {
    return (
      <>
        <button onClick={handleResumeGame}>Resume</button>
        <button onClick={handleQuitGame}>Quit</button>
      </>
    );
  } else if (gameState === GameState.COMPLETE) {
    return <></>;
  } else {
    console.error("Error!!!!");
    return <div>ERROR WITH CONTROL BUTTON</div>;
  }
}

export default App;
