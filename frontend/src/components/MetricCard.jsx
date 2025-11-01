import React from "react";
import { useTranslation } from 'react-i18next';
import './MetricCard.css';

export default function MetricCard({ icon, label, hindiLabel, value, suffix, color = "#3b82f6" }) {
  const { i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  
  const toggleSpeech = () => {
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
      return;
    }
    
    const currentLang = i18n.language;
    const textToSpeak = currentLang === 'hi' && hindiLabel ? hindiLabel : label;
    const text = `${textToSpeak} ${value} ${suffix || ''}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="metric-card" style={{ '--card-color': color }}>
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <button onClick={toggleSpeech} className="tts" title={window.speechSynthesis.speaking ? (window.speechSynthesis.paused ? "Resume" : "Pause") : "Listen to this metric"}>
          {window.speechSynthesis.speaking ? (window.speechSynthesis.paused ? "▶️" : "⏸️") : "🔊"}
        </button>
      </div>
      <div className="metric-label">{label}</div>
      {hindiLabel && <div className="metric-hindi">{hindiLabel}</div>}
      <div className="metric-value" data-suffix={suffix}>
        {value?.toLocaleString?.() ?? value}
      </div>
    </div>
  );
}
