import { useState, useEffect } from "react";
const TIMER = 3000
export default function ProgressBar (){
    const [remainingTime, setRemainingTime] = useState(TIMER);

    useEffect(() => {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 50);
      }, 50);

      return () => {
        clearInterval(interval);
      };
    });

    return <progress value={remainingTime} max={TIMER} />;
}