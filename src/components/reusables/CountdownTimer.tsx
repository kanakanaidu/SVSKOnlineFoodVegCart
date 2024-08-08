import React, { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const secondsRemaining = differenceInSeconds(targetDate, now);

      if (secondsRemaining <= 0) {
        clearInterval(interval);
        setTimeRemaining('00:00:00:00');
      } else {
        const hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
        const seconds = secondsRemaining % 60;
        const days = Math.floor(secondsRemaining / (60 * 60 * 24));

        setTimeRemaining(
          `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="text-4xl font-bold text-green-800">
      {timeRemaining}
    </div>
  );
};

export default CountdownTimer;