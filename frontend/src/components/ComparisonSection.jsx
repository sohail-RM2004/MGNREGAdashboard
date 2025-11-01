import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './ComparisonSection.css';

export default function ComparisonSection({ currentDistrict, districts, states }) {
  const { t, i18n } = useTranslation();
  const [compareWith, setCompareWith] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [stateStats, setStateStats] = useState(null);
  
  const speakSection = () => {
    const text = i18n.language === 'hi'
      ? 'तुलना अनुभाग। अपने जिले के प्रदर्शन की तुलना अन्य जिलों या राज्य के औसत से करें।'
      : 'Comparison section. Compare your district performance with other districts or state average.';
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = i18n.language === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    if (currentDistrict?.district?.state?.stateCode) {
      api.getStateStats(currentDistrict.district.state.stateCode)
        .then(setStateStats)
        .catch(console.error);
    }
  }, [currentDistrict]);

  const handleCompare = async () => {
    if (!compareWith || !currentDistrict) return;
    
    try {
      if (compareWith === 'state') {
        // Compare with state average
        const current = currentDistrict.latest;
        const state = stateStats;
        
        setComparisonData({
          current: {
            name: current.district.districtName,
            avgWage: current.avgWageRatePerDayPerPerson,
            avgDays: current.avgDaysOfEmploymentPerHH,
            totalExp: current.totalExp,
            completedWorks: current.completedWorks
          },
          compare: {
            name: 'State Average',
            avgWage: state._avg?.avgWageRatePerDayPerPerson || 0,
            avgDays: state._avg?.avgDaysOfEmploymentPerHH || 0,
            totalExp: state._avg?.totalExp || 0,
            completedWorks: state._sum?.completedWorks || 0
          }
        });
      } else {
        // Compare with another district
        const data = await api.compareDistricts(currentDistrict.latest.district.districtCode, compareWith);
        const other = data.districtB[0];
        
        if (other) {
          setComparisonData({
            current: {
              name: currentDistrict.latest.district.districtName,
              avgWage: currentDistrict.latest.avgWageRatePerDayPerPerson,
              avgDays: currentDistrict.latest.avgDaysOfEmploymentPerHH,
              totalExp: currentDistrict.latest.totalExp,
              completedWorks: currentDistrict.latest.completedWorks
            },
            compare: {
              name: other.district?.districtName || 'Other District',
              avgWage: other.avgWageRatePerDayPerPerson,
              avgDays: other.avgDaysOfEmploymentPerHH,
              totalExp: other.totalExp,
              completedWorks: other.completedWorks
            }
          });
        }
      }
    } catch (error) {
      console.error('Comparison failed:', error);
    }
  };

  const chartData = comparisonData ? [
    {
      metric: 'Avg Wage (₹)',
      current: comparisonData.current.avgWage,
      compare: comparisonData.compare.avgWage
    },
    {
      metric: 'Avg Days/HH',
      current: comparisonData.current.avgDays,
      compare: comparisonData.compare.avgDays
    },
    {
      metric: 'Total Exp (₹)',
      current: comparisonData.current.totalExp / 1000, // Convert to thousands
      compare: comparisonData.compare.totalExp / 1000
    },
    {
      metric: 'Completed Works',
      current: comparisonData.current.completedWorks,
      compare: comparisonData.compare.completedWorks
    }
  ] : [];

  return (
    <div className="comparison-section">
      <div className="section-header">
        <h3>⚖️ {t('comparative_insights') || 'Comparative Insights'}</h3>
        <button onClick={speakSection} className="section-tts" title="Listen to section description">
          🔊
        </button>
      </div>
      
      <div className="comparison-controls">
        <select 
          value={compareWith} 
          onChange={(e) => setCompareWith(e.target.value)}
          className="compare-select"
        >
          <option value="">Select comparison</option>
          <option value="state">State Average</option>
          {districts.filter(d => d.districtCode !== currentDistrict?.latest?.district?.districtCode)
            .map(d => (
              <option key={d.districtCode} value={d.districtCode}>
                {d.districtName}
              </option>
            ))}
        </select>
        <button onClick={handleCompare} className="compare-btn">
          Compare
        </button>
      </div>

      {comparisonData && (
        <div className="comparison-results">
          <div className="comparison-cards">
            <div className="comparison-card">
              <h4>{comparisonData.current.name}</h4>
              <div className="stats">
                <div>Avg Wage: ₹{comparisonData.current.avgWage?.toFixed(2)}</div>
                <div>Avg Days: {comparisonData.current.avgDays?.toFixed(1)}</div>
                <div>Total Exp: ₹{comparisonData.current.totalExp?.toLocaleString()}</div>
                <div>Works: {comparisonData.current.completedWorks}</div>
              </div>
            </div>
            
            <div className="vs">VS</div>
            
            <div className="comparison-card">
              <h4>{comparisonData.compare.name}</h4>
              <div className="stats">
                <div>Avg Wage: ₹{comparisonData.compare.avgWage?.toFixed(2)}</div>
                <div>Avg Days: {comparisonData.compare.avgDays?.toFixed(1)}</div>
                <div>Total Exp: ₹{comparisonData.compare.totalExp?.toLocaleString()}</div>
                <div>Works: {comparisonData.compare.completedWorks}</div>
              </div>
            </div>
          </div>

          <div className="comparison-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#8884d8" name={comparisonData.current.name} />
                <Bar dataKey="compare" fill="#82ca9d" name={comparisonData.compare.name} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}