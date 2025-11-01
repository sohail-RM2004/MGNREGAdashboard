import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import './EfficiencySection.css';

export default function EfficiencySection({ summary, trendData = [] }) {
  const { t, i18n } = useTranslation();
  
  if (!summary?.efficiency) return null;
  
  const speakSection = () => {
    const text = i18n.language === 'hi'
      ? 'दक्षता अनुभाग। कार्यक्रम की समयबद्धता, भुगतान दक्षता, और ध्यान देने वाले क्षेत्र दिखाता है।'
      : 'Efficiency section. Shows program timeliness, payment efficiency, and areas needing attention.';
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = i18n.language === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(msg);
  };

  const paymentsData = trendData.map(d => ({
    period: `${d.month} ${d.finYear}`,
    percentage: d.paymentsWithin15Days
  }));

  const efficiencyMetrics = [
    {
      metric: t('payments_within_15_days') || 'Payments within 15 days',
      value: summary.efficiency.paymentsWithin15Days,
      target: 100,
      color: summary.efficiency.paymentsWithin15Days >= 90 ? '#10b981' : '#ef4444'
    },
    {
      metric: t('category_b_works') || 'Category B Works',
      value: summary.efficiency.categoryBWorks,
      target: 60,
      color: summary.efficiency.categoryBWorks >= 50 ? '#10b981' : '#f59e0b'
    }
  ];

  return (
    <div className="efficiency-section">
      <div className="section-header">
        <h3>⏱ {t('program_efficiency') || 'Program Efficiency & Timeliness'}</h3>
        <button onClick={speakSection} className="section-tts" title="Listen to section description">
          🔊
        </button>
      </div>
      
      <div className="efficiency-grid">
        <div className="chart-container">
          <h4>{t('payment_timeliness') || 'Payment Timeliness Trend'}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentsData}>
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#8884d8" name={t('percent_payments_15_days') || '% Payments within 15 days'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="efficiency-metrics">
          <h4>{t('efficiency_indicators') || 'Efficiency Indicators'}</h4>
          {efficiencyMetrics.map((metric, index) => (
            <div key={index} className="efficiency-metric">
              <div className="metric-info">
                <span className="metric-name">{metric.metric}</span>
                <span className="metric-value" style={{ color: metric.color }}>
                  {metric.value?.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(metric.value, 100)}%`,
                    backgroundColor: metric.color 
                  }}
                />
              </div>
              <div className="target">{t('target') || 'Target'}: {metric.target}%</div>
            </div>
          ))}
          
          <div className="alert-metric">
            <h5>🚫 {t('gps_nil_expenditure') || 'GPs with NIL Expenditure'}</h5>
            <div className="alert-value">
              {summary.efficiency.gpsWithNilExp || 0} {t('gram_panchayats') || 'Gram Panchayats'}
            </div>
            {summary.efficiency.gpsWithNilExp > 0 && (
              <div className="alert-message">
                ⚠️ {t('areas_need_attention') || 'These areas need attention for program activation'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}