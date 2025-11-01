import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import './TrendsSection.css';

export default function TrendsSection({ trendData = [] }) {
  const { t, i18n } = useTranslation();
  
  const speakSection = () => {
    const text = i18n.language === 'hi' 
      ? 'रुझान अनुभाग। चुने गए जिले के लिए समय के साथ रोजगार और मजदूरी के रुझान।'
      : 'Trends section. Employment and wage trends over time for the selected district.';
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = i18n.language === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(msg);
  };
  
  const employmentData = trendData.map(d => ({
    period: `${d.month} ${d.finYear}`,
    avgDays: d.avgDays,
    totalIndividuals: d.totalIndividuals
  }));

  const wageData = trendData.map(d => ({
    period: `${d.month} ${d.finYear}`,
    avgWage: d.avgWage
  }));

  const worksData = trendData.map(d => ({
    period: `${d.month} ${d.finYear}`,
    completed: d.completedWorks,
    ongoing: d.ongoingWorks
  }));

  const expenditureData = trendData.map(d => ({
    period: `${d.month} ${d.finYear}`,
    expenditure: d.totalExp
  }));

  return (
    <div className="trends-section">
      <div className="section-header">
        <h3>📈 {t('trends_over_time') || 'Trends Over Time'}</h3>
        <button onClick={speakSection} className="section-tts" title="Listen to section description">
          🔊
        </button>
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h4>{t('employment_trends') || 'Employment Trends'}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={employmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgDays" stroke="#8884d8" name={t('avg_days_hh') || 'Avg Days/HH'} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>💵 {t('wage_rate_trend') || 'Wage Rate Trend'}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={wageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgWage" stroke="#82ca9d" name={t('avg_wage_rs') || 'Avg Wage (₹)'} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>🧱 {t('works_completed_ongoing') || 'Works Completed vs Ongoing'}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={worksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#8884d8" name={t('completed') || 'Completed'} />
              <Bar dataKey="ongoing" fill="#82ca9d" name={t('ongoing') || 'Ongoing'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>🕰 {t('expenditure_trend') || 'Expenditure Trend'}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={expenditureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expenditure" fill="#ffc658" name={t('total_expenditure_rs') || 'Total Expenditure (₹)'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}