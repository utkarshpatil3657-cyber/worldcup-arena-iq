import React, { useState, useEffect } from 'react';
import { translations } from '../utils/translations';

export default function AnalyticsSustainability({ addToast, simulation, lang }) {
  const t = translations[lang] || translations.en;

  const [wasteBins, setWasteBins] = useState([
    { id: 'b1', sector: 'S101', type: 'Recycling', fill: 45, status: 'normal' },
    { id: 'b2', sector: 'S102', type: 'Compost', fill: 60, status: 'normal' },
    { id: 'b3', sector: 'S103', type: 'Recycling', fill: 88, status: 'critical' },
    { id: 'b4', sector: 'S104', type: 'Landfill', fill: 35, status: 'normal' },
    { id: 'b5', sector: 'S201', type: 'Recycling', fill: 20, status: 'normal' },
    { id: 'b6', sector: 'S202', type: 'Compost', fill: 40, status: 'normal' },
    { id: 'b7', sector: 'S203', type: 'Recycling', fill: 92, status: 'critical' },
    { id: 'b8', sector: 'S204', type: 'Landfill', fill: 15, status: 'normal' }
  ]);

  const [shuttles, setShuttles] = useState([
    { id: 's1', name: 'Downtown Express (Route A)', status: 'Active', count: 12, frequency: '5 min', avgWait: '4 min' },
    { id: 's2', name: 'West Parking Hub (Route B)', status: 'Active', count: 8, frequency: '8 min', avgWait: '7 min' },
    { id: 's3', name: 'Metropolitan Rail Link (Route C)', status: 'Active', count: 15, frequency: '3 min', avgWait: '3 min' }
  ]);

  // Hook up chatbot command event listener for bin clearing
  useEffect(() => {
    const handleClearBinEvent = (e) => {
      const { binId } = e.detail;
      const binToClear = wasteBins.find(bin => bin.id === binId);
      if (binToClear) {
        setWasteBins(prev => prev.map(bin => bin.id === binId ? { ...bin, fill: 10, status: 'normal' } : bin));
        addToast(lang === 'ar' ? `تم إفراغ حاوية ${t[binToClear.sector]}` : `Emptied bin at ${t[binToClear.sector]} via AI command.`);
      }
    };

    window.addEventListener('clear-bin', handleClearBinEvent);
    return () => {
      window.removeEventListener('clear-bin', handleClearBinEvent);
    };
  }, [wasteBins, lang]);

  const handleDispatchEcoCrew = (id, sectorCode) => {
    setWasteBins(prev => prev.map(bin => bin.id === id ? { ...bin, fill: 10, status: 'normal' } : bin));
    const sectorName = t[sectorCode] || sectorCode;
    addToast(lang === 'ar' ? `تم إرسال فريق النظافة إلى ${sectorName}.` : `Eco bin dispatch squad deployed to ${sectorName}.`);
  };

  const handleAddShuttle = (id, name) => {
    setShuttles(prev => prev.map(shuttle => shuttle.id === id ? { ...shuttle, count: shuttle.count + 1, frequency: 'Reduced' } : shuttle));
    addToast(lang === 'ar' ? `تم إرسال حافلة إضافية إلى ${name}.` : `Additional bus dispatched to ${name}.`);
  };

  // Adjust values based on simulation
  const getSentimentStats = () => {
    if (simulation === 'rush') {
      return { positive: 65, neutral: 20, negative: 15 };
    }
    if (simulation === 'gateC') {
      return { positive: 45, neutral: 30, negative: 25 };
    }
    return { positive: 82, neutral: 12, negative: 6 };
  };

  const sentiment = getSentimentStats();

  return (
    <div className="main-content">
      {/* Header */}
      <header className="top-header">
        <div className="header-title-section">
          <div className="badge-world-cup">
            <i className="fa-solid fa-seedling"></i>
            <span>{t.ecoIntel}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-headings)' }}>{t.ecoTitle}</h2>
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="analytics-grid animate-fade-in">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* AI waste management */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-trash-can" style={{ color: 'var(--color-pitch)' }}></i>
                {t.wasteGrid}
              </h3>
              <span className="badge-world-cup" style={{ borderColor: 'transparent', backgroundColor: 'var(--color-pitch-light)', color: 'var(--color-pitch-dark)' }}>
                {t.ecoIntel} Telemetry
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              {t.wasteSubtitle}
            </p>

            <div className="waste-grid-vis">
              {wasteBins.map(bin => (
                <div key={bin.id} className="waste-bin-cell">
                  <div className="bin-icon">
                    {bin.fill > 80 ? (
                      <i className="fa-solid fa-dumpster" style={{ color: 'var(--color-danger)' }}></i>
                    ) : (
                      <i className="fa-solid fa-trash" style={{ color: 'var(--color-pitch)' }}></i>
                    )}
                  </div>
                  
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t[bin.sector] || bin.sector}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{bin.type}</div>
                  
                  <div className="bin-fill-indicator">
                    <div 
                      className="bin-fill-bar" 
                      style={{ 
                        width: `${bin.fill}%`, 
                        backgroundColor: bin.fill > 80 ? 'var(--color-danger)' : bin.fill > 50 ? 'var(--color-warning)' : 'var(--color-pitch)'
                      }}
                    ></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{bin.fill}% {t.fill}</div>

                  {bin.fill > 70 && (
                    <button 
                      className="btn-primary"
                      style={{ padding: '4px 8px', fontSize: '0.7rem', marginTop: '6px', backgroundColor: 'var(--color-danger)' }}
                      onClick={() => handleDispatchEcoCrew(bin.id, bin.sector)}
                    >
                      {t.clearBin}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transportation Intelligence */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-bus"></i>
                {t.transitTitle}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {shuttles.map(shuttle => (
                <div 
                  key={shuttle.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{shuttle.name}</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {t.activeShuttles}: <strong>{shuttle.count}</strong> • {t.targetFrequency}: <strong>{shuttle.frequency}</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>{t.avgWait}</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-sports-blue)' }}>{shuttle.avgWait}</strong>
                    </div>

                    <button 
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--color-sports-blue)', color: 'var(--color-sports-blue)' }}
                      onClick={() => handleAddShuttle(shuttle.id, shuttle.name)}
                    >
                      + {t.addBus}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sentiment & Eco stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Sentiment Tracker */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-heart" style={{ color: 'var(--color-danger)' }}></i>
                {t.sentimentTitle}
              </h3>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {t.sentimentSubtitle}
            </p>

            <div className="sentiment-bar-container">
              <div className="sentiment-row">
                <span className="sentiment-label">😀 {t.positive}</span>
                <div className="sentiment-track">
                  <div className="sentiment-fill positive" style={{ width: `${sentiment.positive}%` }}></div>
                </div>
                <span className="sentiment-pct">{sentiment.positive}%</span>
              </div>

              <div className="sentiment-row">
                <span className="sentiment-label">😐 {t.neutral}</span>
                <div className="sentiment-track">
                  <div className="sentiment-fill neutral" style={{ width: `${sentiment.neutral}%` }}></div>
                </div>
                <span className="sentiment-pct">{sentiment.neutral}%</span>
              </div>

              <div className="sentiment-row">
                <span className="sentiment-label">😡 {t.negative}</span>
                <div className="sentiment-track">
                  <div className="sentiment-fill negative" style={{ width: `${sentiment.negative}%` }}></div>
                </div>
                <span className="sentiment-pct">{sentiment.negative}%</span>
              </div>
            </div>

            <div style={{ 
              marginTop: '20px', 
              backgroundColor: 'var(--bg-main)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '14px', 
              fontSize: '0.8rem',
              color: 'var(--text-primary)'
            }}>
              <strong>AI Recommendation:</strong> 
              {simulation === 'gateC' ? (
                <span> {lang === 'ar' ? 'أخطاء قراءة التذاكر عند البوابة C ترفع الاستياء في قطاع 103. يرجى توجيه متطوعين فوراً.' : 'Ticket scan failure rate at Gate C is driving negative sentiment in Sector 103. Divert volunteers immediately.'}</span>
              ) : (
                <span> {lang === 'ar' ? 'مشاعر الجماهير العامة إيجابية ومستقرة. حافظ على معدلات الخدمة الحالية.' : 'Overall fan sentiment is highly positive. Maintain current concession service rates and shuttle frequency.'}</span>
              )}
            </div>
          </div>

          {/* Eco-Score Tracker */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-award" style={{ color: 'var(--color-warning)' }}></i>
                {lang === 'ar' ? 'مؤشر استدامة الملعب' : 'Stadium Sustainability Index'}
              </h3>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-pitch)', fontFamily: 'var(--font-headings)' }}>
                94.8 <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'مسار شهادة الفئة أ الذهبية للاستدامة' : 'Category A Gold Certification Track'}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{lang === 'ar' ? 'استخدام الشبكة الشمسية الدقيقة' : 'Solar Microgrid Utilization'}</span>
                <strong>68% Grid Load</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{lang === 'ar' ? 'معدل فلترة المياه وتكريرها' : 'Water Reuse Filtration Rate'}</span>
                <strong>92,000 Gallons Today</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{lang === 'ar' ? 'معدل تحويل النفايات وإعادة التدوير' : 'Zero-Waste Diversion Rate'}</span>
                <strong>88.4% Material Reuse</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
