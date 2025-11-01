import React, { useState, useEffect } from 'react';
import './SpeechControl.css';

export default function SpeechControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkSpeechStatus = () => {
      setIsPlaying(window.speechSynthesis.speaking);
      setIsPaused(window.speechSynthesis.paused);
    };

    const interval = setInterval(checkSpeechStatus, 100);
    return () => clearInterval(interval);
  }, []);

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const pauseResumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.pause();
    }
  };

  if (!isPlaying) return null;

  return (
    <div className="speech-control">
      <button onClick={pauseResumeSpeech} className="speech-btn">
        {isPaused ? '▶️' : '⏸️'}
      </button>
      <button onClick={stopSpeech} className="speech-btn">
        ⏹️
      </button>
    </div>
  );
}