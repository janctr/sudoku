export default function GameCompleteScreen(props: {
  onStartEasyGame: () => void;
  onStartMediumGame: () => void;
  onStartHardGame: () => void;
}) {
  const { onStartEasyGame, onStartMediumGame, onStartHardGame } = props;

  return (
    <div className="complete-screen">
      <h3>Yay you did it. Want a cookie? &#127850;</h3>
      <h2>Your time: 6:51</h2>
      <button>Home</button>

      <h3>Start another game</h3>
      <button onClick={onStartEasyGame}>Easy</button>
      <button onClick={onStartMediumGame}>Medium</button>
      <button onClick={onStartHardGame}>Hard</button>
    </div>
  );
}
