import React from "react";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { GameState } from "../../types/index";

export default function SudokuControls(props: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  handleQuitGame: () => void;
  handlePauseGame: () => void;
  handleResumeGame: () => void;
}) {
  const { gameState, handleQuitGame, handlePauseGame, handleResumeGame } =
    props;

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
