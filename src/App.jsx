import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const PomodoroClock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [timerLabel, setTimerLabel] = useState('Session');
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    if (timeLeft === 0) {
      const audio = document.getElementById('beep');
      audio.play();
      if (isSession) {
        setTimerLabel('Break');
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel('Session');
        setTimeLeft(sessionLength * 60);
      }
      setIsSession(!isSession);
    }
  }, [timeLeft, isSession, breakLength, sessionLength]);

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    setTimerLabel('Session');
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  };
  
  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      if (!isRunning && !isSession) {
        setTimeLeft((breakLength + 1) * 60);
      }
    }
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      if (!isRunning && !isSession) {
        setTimeLeft((breakLength - 1) * 60);
      }
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning && isSession) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning && isSession) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="pomodoro-clock">
      <div className="length-controls">
        <div id="break-label">Break Length</div>
        <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={handleBreakIncrement}>+</button>
        <div id="session-label">Session Length</div>
        <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" onClick={handleSessionIncrement}>+</button>
      </div>
      <div className="timer">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
        <button id="reset" onClick={handleReset}>Reset</button>
        <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav" preload="auto"></audio>
      </div>
    </div>
  );
};

export default PomodoroClock;
