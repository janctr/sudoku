import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from "react";

/** Components */
import SudokuGame from "./components/SudokuGame/SudokuGame";
import SudokuControls from "./components/SudokuGame/SudokuControls";
import StartScreen from "./components/StartScreen/StartScreen";
import GameCompleteScreen from "./components/GameCompleteScreen/GameCompleteScreen";

/** Hooks */
import { useTimer } from "./hooks/Timer";

/** Util */
import {
  createSudokuPuzzle,
  deepCopy,
  isValidSudoku,
  initEmptyGrid,
} from "./sudokuController";
import { formatTimeElapsed } from "./util";

/** Types/Enums */
import { CellValue, Difficulty, GameState, SudokuPuzzle } from "./types/index";

/** Stylesheets */
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

  const { secondsElapsed, startTimer, pauseTimer, resumeTimer, clearTimer } =
    useTimer();

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
    const numberToInt = parseInt(number);

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

    startTimer();
    setGameState(GameState.PLAYING);
  }

  function pauseGame() {
    if (gameState !== GameState.PLAYING) {
      throw new Error("Game state must be PLAYING to pause game");
    }

    setGameState(GameState.PAUSED);

    pauseTimer();
  }

  function resumeGame() {
    if (gameState !== GameState.PAUSED) {
      throw new Error("Game state must be PAUSED to resume game");
    }

    setGameState(GameState.PLAYING);

    resumeTimer();
  }

  function quitGame() {
    if (!(gameState === GameState.PLAYING || gameState === GameState.PAUSED)) {
      throw new Error("Game state must be PLAYING or PAUSED to quit game");
    }

    setGameState(GameState.NOT_PLAYING);

    clearTimer();
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
            onStartEasyGame={() => startGame(Difficulty.EASY)}
            onStartMediumGame={() => startGame(Difficulty.MEDIUM)}
            onStartHardGame={() => startGame(Difficulty.HARD)}
          />
        );
    }
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
            timeElapsed={secondsElapsed}
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
        <SudokuControls
          gameState={props.gameState}
          setGameState={props.setGameState}
          handleQuitGame={handleQuitGame}
          handlePauseGame={handlePauseGame}
          handleResumeGame={handleResumeGame}
        />
        {(gameState === GameState.PLAYING ||
          gameState === GameState.PAUSED) && (
          <span className="time-elapsed">
            {formatTimeElapsed(props.timeElapsed)}
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
