import { useEffect, useState } from "react";

export function useTimer() {
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  //const [millisecondsElapsed, setMillisecondsElapsed] = useState(0);

  useEffect(() => {
    console.log("secondsElapsed: ", secondsElapsed);
  }, [secondsElapsed]);

  const startTimer = () => {
    console.log("Starting timer.");

    setIntervalId(
      setInterval(() => {
        setSecondsElapsed((secondsElapsed) => secondsElapsed + 1);
        //console.log(secondsElapsed)
      }, 1000)
    );
  };

  function pauseTimer() {
    console.log("Pausing timer...");
    clearInterval(intervalId);
  }

  function resumeTimer() {
    console.log("Resuming timer...");

    setIntervalId(
      setInterval(() => {
        setSecondsElapsed((secondsElapsed) => secondsElapsed + 1);
        //console.log(secondsElapsed)
      }, 1000)
    );
  }

  function clearTimer() {
    console.log("Resetting timer");
    clearInterval(intervalId);
    setSecondsElapsed(0);
  }

  return { secondsElapsed, startTimer, pauseTimer, resumeTimer, clearTimer };
}
