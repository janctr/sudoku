export default function StartScreen(props: {
  onStartEasyGame: () => void;
  onStartMediumGame: () => void;
  onStartHardGame: () => void;
}) {
  const { onStartEasyGame, onStartMediumGame, onStartHardGame } = props;

  return (
    <div className="start-screen">
      <h3>Start game</h3>
      <button onClick={onStartEasyGame}>Easy</button>
      <button onClick={onStartMediumGame}>Medium</button>
      <button onClick={onStartHardGame}>Hard</button>
    </div>
  );
}
