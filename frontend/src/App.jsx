import React, { useState, useEffect } from "react";
import LanguageSwitcher from "./components/LanguageSwitcher";
import DistrictSelect from "./components/DistrictSelect";
import Dashboard from "./components/Dashboard";
import TrendsSection from "./components/TrendsSection";
import CategorySection from "./components/CategorySection";
import ComparisonSection from "./components/ComparisonSection";
import EfficiencySection from "./components/EfficiencySection";
import ImageCarousel from "./components/ImageCarousel";
import SidebarImages from "./components/SidebarImages";
import SpeechControl from "./components/SpeechControl";
import api from "./services/api";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t, i18n } = useTranslation();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    api.getStates().then(setStates).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedState) {
      api.getDistrictsByState(selectedState.stateCode).then(setDistricts).catch(console.error);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      api.getDistrictSummary(selectedDistrict.districtCode).then(setSummary).catch(console.error);
      api.getDistrictTrend(selectedDistrict.districtCode).then(setTrendData).catch(console.error);
    }
  }, [selectedDistrict]);

  const speakSummary = (latest) => {
    const pieces = i18n.language === 'hi' ? [
      `जिला: ${latest.district?.districtName || ""}`,
      `कुल काम करने वाले व्यक्ति: ${latest.totalIndividualsWorked || 0}`,
      `काम करने वाले परिवार: ${latest.totalHHWorked || 0}`,
      `औसत मजदूरी: ${latest.avgWageRatePerDayPerPerson || 0} रुपये`,
      `प्रति परिवार औसत दिन: ${latest.avgDaysOfEmploymentPerHH || 0}`
    ] : [
      `District: ${latest.district?.districtName || ""}`,
      `Total individuals worked: ${latest.totalIndividualsWorked || 0}`,
      `Households worked: ${latest.totalHHWorked || 0}`,
      `Average wage: ${latest.avgWageRatePerDayPerPerson || 0} rupees`,
      `Average days per household: ${latest.avgDaysOfEmploymentPerHH || 0}`
    ];
    const msg = new SpeechSynthesisUtterance(pieces.join(". "));
    msg.lang = i18n.language === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <img src="/images/topleft.png" alt="MGNREGA Logo" className="mgnrega-logo" />
          <h1>MGNREGA District Performance</h1>
        </div>
        <div className="header-right">
          <LanguageSwitcher />
        </div>
      </header>
      
      <ImageCarousel />
      <SidebarImages />

      <main className="container">
        <section className="chooser">
          <div>
            <label>State</label>
            <select onChange={(e)=> setSelectedState(states.find(s=>s.stateCode===e.target.value))}>
              <option value="">Select State</option>
              {states.map(s => <option key={s.stateCode} value={s.stateCode}>{s.stateName}</option>)}
            </select>
          </div>

          <div>
            <label>District</label>
            <DistrictSelect districts={districts} onSelect={dc => setSelectedDistrict(dc)} />
          </div>
        </section>

        {summary && summary.latest ? (
          <>
            <nav className="tab-nav">
              <button 
                className={activeTab === 'dashboard' ? 'active' : ''} 
                onClick={() => setActiveTab('dashboard')}
              >
                🏙 Dashboard
              </button>
              <button 
                className={activeTab === 'trends' ? 'active' : ''} 
                onClick={() => setActiveTab('trends')}
              >
                📈 Trends
              </button>
              <button 
                className={activeTab === 'category' ? 'active' : ''} 
                onClick={() => setActiveTab('category')}
              >
                👩🌾 Categories
              </button>
              <button 
                className={activeTab === 'comparison' ? 'active' : ''} 
                onClick={() => setActiveTab('comparison')}
              >
                ⚖️ Compare
              </button>
              <button 
                className={activeTab === 'efficiency' ? 'active' : ''} 
                onClick={() => setActiveTab('efficiency')}
              >
                ⏱ Efficiency
              </button>
            </nav>

            <div className="tab-content">
              {activeTab === 'dashboard' && (
                <Dashboard summary={summary} onPlaySummary={speakSummary} />
              )}
              {activeTab === 'trends' && (
                <TrendsSection trendData={trendData} />
              )}
              {activeTab === 'category' && (
                <CategorySection summary={summary} trendData={trendData} />
              )}
              {activeTab === 'comparison' && (
                <ComparisonSection 
                  currentDistrict={summary} 
                  districts={districts} 
                  states={states} 
                />
              )}
              {activeTab === 'efficiency' && (
                <EfficiencySection summary={summary} trendData={trendData} />
              )}
            </div>
          </>
        ) : (
          <section className="empty">Select a district to view its dashboard</section>
        )}
      </main>
      
      <SpeechControl />
    </div>
  );
}


