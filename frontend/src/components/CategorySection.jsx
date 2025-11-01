import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import './CategorySection.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function CategorySection({ summary, trendData = [] }) {
  const { t, i18n } = useTranslation();
  
  if (!summary?.workerComposition) return null;
  
  const speakSection = () => {
    const text = i18n.language === 'hi'
      ? 'श्रेणीवार प्रदर्शन अनुभाग। लिंग और सामाजिक श्रेणियों के आधार पर कामगार संरचना और व्यय विभाजन दिखाता है।'
      : 'Category wise performance section. Shows worker composition by gender and social categories, and expenditure breakdown.';
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = i18n.language === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(msg);
  };

  const workerData = [
    { name: t('women') || 'Women', value: summary.workerComposition.women, color: '#FF6B9D' },
    { name: t('sc_category') || 'SC', value: summary.workerComposition.sc, color: '#4ECDC4' },
    { name: t('st_category') || 'ST', value: summary.workerComposition.st, color: '#45B7D1' },
    { name: t('others') || 'Others', value: summary.workerComposition.others, color: '#96CEB4' }
  ];

  const expenditureData = [
    { name: t('wages') || 'Wages', value: summary.expenditureBreakdown.wages },
    { name: t('material_skilled') || 'Material & Skilled', value: summary.expenditureBreakdown.material },
    { name: t('admin') || 'Admin', value: summary.expenditureBreakdown.admin },
    { name: t('agriculture_allied') || 'Agriculture/Allied', value: summary.expenditureBreakdown.agriculture },
    { name: t('nrm') || 'NRM', value: summary.expenditureBreakdown.nrm }
  ];

  const differentlyAbledData = trendData.map(d => ({
    period: `${d.month} ${d.finYear}`,
    count: d.differentlyAbled
  }));

  return (
    <div className="category-section">
      <div className="section-header">
        <h3>👩🌾 {t('category_performance') || 'Category-Wise Performance'}</h3>
        <button onClick={speakSection} className="section-tts" title="Listen to section description">
          🔊
        </button>
      </div>
      
      <div className="category-grid">
        <div className="chart-container">
          <h4>{t('worker_composition') || 'Worker Composition (%)'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {workerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>♿ {t('differently_abled_worked') || 'Differently Abled Persons Worked'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={differentlyAbledData}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name={t('count') || 'Count'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>🧾 {t('expenditure_breakdown') || 'Expenditure Breakdown (%)'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenditureData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenditureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}