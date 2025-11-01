import React from 'react';
import MetricCard from './MetricCard';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';

export default function Dashboard({ summary, onPlaySummary }) {
  const { t } = useTranslation();
  
  if (!summary?.latest) return null;
  
  const { latest } = summary;
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>{latest.district?.districtName}</h2>
          <p>{latest.district?.state?.stateName} • {latest.finYear} • {latest.month}</p>
        </div>
        <div className="dashboard-actions">
          <span className="last-updated">{t("last_updated")} {new Date(latest.createdAt).toLocaleDateString()}</span>
          <button onClick={() => onPlaySummary(latest)} className="play-btn">
            🔊 {t("play_summary")}
          </button>
        </div>
      </div>
      
      <div className="metric-grid">
        <MetricCard 
          icon="🧍‍♂️" 
          label={t("total_individuals_worked")} 
          value={latest.totalIndividualsWorked} 
          color="#3b82f6"
        />
        <MetricCard 
          icon="🏡" 
          label={t("total_households_worked")} 
          value={latest.totalHHWorked} 
          color="#10b981"
        />
        <MetricCard 
          icon="💰" 
          label={t("avg_wage_rate")} 
          value={latest.avgWageRatePerDayPerPerson} 
          suffix="₹" 
          color="#f59e0b"
        />
        <MetricCard 
          icon="📆" 
          label={t("avg_days_per_household")} 
          value={latest.avgDaysOfEmploymentPerHH} 
          color="#8b5cf6"
        />
        <MetricCard 
          icon="🧱" 
          label={t("completed_works")} 
          value={latest.completedWorks} 
          color="#06b6d4"
        />
        <MetricCard 
          icon="🧾" 
          label={t("total_expenditure")} 
          value={latest.totalExp} 
          suffix="₹" 
          color="#ef4444"
        />
      </div>
    </div>
  );
}