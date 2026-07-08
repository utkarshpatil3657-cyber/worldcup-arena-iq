import React, { useState, useEffect } from 'react';
import { translations } from '../utils/translations';

export default function OpsDashboard({ 
  incidents, 
  setIncidents, 
  simulation, 
  setSimulation, 
  addToast,
  dashboardStats,
  setDashboardStats,
  lang,
  theme
}) {
  const t = translations[lang] || translations.en;
  
  const [selectedSector, setSelectedSector] = useState(null);
  
  const [activeRecs, setActiveRecs] = useState([
    {
      id: 'rec-1',
      priority: 'high',
      title: 'Gate C Bottleneck Escalation',
      text: 'GenAI detected a 45% surge in crowd density at Gate C ticket scanners due to language translation friction. AI recommends deploying 3 multilingual volunteers (English/Spanish/French) and opening Bypass Gate C-2.',
      time: 'Just now',
      status: 'pending'
    },
    {
      id: 'rec-2',
      priority: 'warning',
      title: 'Restroom Bin Overflow Risk',
      text: 'AI predictive analytics indicates waste bin accumulation in Sector 203 will reach 95% capacity in 10 minutes. AI recommends dispatching sanitation task #4.',
      time: '4 mins ago',
      status: 'pending'
    },
    {
      id: 'rec-3',
      priority: 'info',
      title: 'Eco-Grid Power Balancing',
      text: 'Stadium solar grid generation peak. ArenaIQ recommends dialing back chiller speeds by 1.5°C in unoccupied VIP lounges for optimal micro-grid sustainability.',
      time: '12 mins ago',
      status: 'pending'
    }
  ]);

  // Sector density levels (value out of 100) based on active simulation
  const [sectors, setSectors] = useState({
    S101: 30, // Gate A Area
    S102: 45, // Gate B Area
    S103: 85, // Gate C Area (Concessions/Food Court)
    S104: 40, // Gate D Area
    S201: 25, // Upper Tier North
    S202: 35, // Upper Tier East
    S203: 90, // Upper Tier South (Fan Zone)
    S204: 30  // Upper Tier West
  });

  // Calculate sector color based on crowd density
  const getSectorColor = (density) => {
    if (density > 80) return 'rgba(239, 68, 68, 0.75)'; // Red
    if (density > 50) return 'rgba(245, 158, 11, 0.75)'; // Amber
    return 'rgba(16, 185, 129, 0.75)'; // Pitch Green
  };

  // Run simulation updates
  useEffect(() => {
    let updatedSectors = { S101: 30, S102: 45, S103: 50, S104: 40, S201: 25, S202: 35, S203: 40, S204: 30 };
    let newStats = { occupancy: '74%', waitTime: '12 min', activeIncidents: incidents.filter(i => i.status !== 'resolved').length, volunteers: 148 };

    if (simulation === 'rush') {
      updatedSectors = { S101: 85, S102: 70, S103: 90, S104: 65, S201: 60, S202: 75, S203: 95, S204: 55 };
      newStats = { ...newStats, occupancy: '96%', waitTime: '28 min' };
    } else if (simulation === 'gateC') {
      updatedSectors = { S101: 20, S102: 25, S103: 98, S104: 30, S201: 15, S202: 20, S203: 45, S204: 25 };
      newStats = { ...newStats, occupancy: '62%', waitTime: '34 min' };
    } else if (simulation === 'exit') {
      updatedSectors = { S101: 95, S102: 90, S103: 75, S104: 85, S201: 15, S202: 10, S203: 20, S204: 15 };
      newStats = { ...newStats, occupancy: '45%', waitTime: '8 min' };
    }

    setSectors(updatedSectors);
    setDashboardStats(newStats);
  }, [simulation, incidents]);

  // Handle recommendation action
  const handleApproveRec = (id, title) => {
    setActiveRecs(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'approved' } : rec));
    
    // Dynamically localise toast
    const titleTrans = id === 'rec-1' ? t.deployBypassGate : id === 'rec-2' ? t.clearBin : t.opsDashboard;
    addToast(`${lang === 'ar' ? 'تم نشر الإجراء الموصى به' : 'Action Deployed'}: "${titleTrans}"`);
    
    // Dynamically update states
    if (id === 'rec-1') {
      setDashboardStats(prev => ({ ...prev, waitTime: '18 min' }));
      setSectors(prev => ({ ...prev, S103: 65 })); // Reduce crowd
    }
  };

  const handleDismissRec = (id) => {
    setActiveRecs(prev => prev.filter(rec => rec.id !== id));
  };

  const handleSectorClick = (sectorId) => {
    setSelectedSector(sectorId);
  };

  const handleQuickAction = (actionType) => {
    if (!selectedSector) return;
    const sectorName = t[selectedSector] || selectedSector;
    
    if (actionType === 'bypass') {
      setSectors(prev => ({
        ...prev,
        [selectedSector]: Math.max(prev[selectedSector] - 25, 20)
      }));
      addToast(lang === 'ar' ? `تم فتح البوابة الجانبية لـ ${sectorName}` : `Bypass Gate opened in ${sectorName}`);
    } else if (actionType === 'security') {
      addToast(lang === 'ar' ? `تم نشر عناصر الأمن في ${sectorName}` : `Increased Security Patrol deployed to ${sectorName}`);
    } else if (actionType === 'reroute') {
      setSectors(prev => ({
        ...prev,
        [selectedSector]: Math.max(prev[selectedSector] - 15, 20)
      }));
      addToast(lang === 'ar' ? `تم تغيير اتجاه المشاة في ${sectorName}` : `Pedestrians re-routed around ${sectorName}`);
    }
    
    setSelectedSector(null);
  };

  // Helper to translate recommendations text dynamically
  const getTranslatedRec = (rec) => {
    if (lang === 'en') return rec;
    
    if (rec.id === 'rec-1') {
      return {
        ...rec,
        title: lang === 'es' ? 'Escalada de cuello de botella en Puerta C' :
               lang === 'fr' ? 'Escalade du goulot d\'étranglement Porte C' :
               lang === 'de' ? 'Engpass-Eskalation an Tor C' :
               lang === 'ar' ? 'تصاعد أزمة الازدحام عند البوابة C' : rec.title,
        text: lang === 'es' ? 'La IA detectó un aumento del 45% en la densidad de multitud debido a fricciones de idioma. Se recomienda desplegar 3 voluntarios multilingües y abrir la Puerta de Derivación C-2.' :
              lang === 'fr' ? 'L\'IA a détecté une hausse de 45% de la densité due aux frictions de traduction. Recommandation : déployer 3 volontaires bilingues et ouvrir la Porte C-2.' :
              lang === 'de' ? 'KI hat einen Anstieg der Dichte um 45% aufgrund von Sprachbarrieren festgestellt. Empfehlung: 3 mehrsprachige Helfer einsetzen und Bypass-Tor C-2 öffnen.' :
              lang === 'ar' ? 'رصد الذكاء الاصطناعي زيادة بنسبة 45٪ في كثافة الجماهير عند ماسحات التذاكر بسبب صعوبات الترجمة. يوصى بنشر 3 متطوعين يتحدثون لغات متعددة وفتح بوابة الالتفاف C-2.' : rec.text
      };
    }
    if (rec.id === 'rec-2') {
      return {
        ...rec,
        title: lang === 'es' ? 'Riesgo de desbordamiento de contenedores' :
               lang === 'fr' ? 'Risque de débordement des poubelles' :
               lang === 'de' ? 'Mülltonnen-Überlaufrisiko' :
               lang === 'ar' ? 'خطر امتلاء حاويات النفايات' : rec.title,
        text: lang === 'es' ? 'Analíticas de la IA indican que el contenedor del Sector 203 alcanzará el 95% de capacidad en 10 minutos. Se recomienda despachar al equipo de limpieza #4.' :
              lang === 'fr' ? 'L\'analyse prédictive indique que la poubelle du Secteur 203 sera pleine à 95% dans 10 minutes. Recommandation : dépêcher l\'équipe de nettoyage #4.' :
              lang === 'de' ? 'Prognosen zeigen, dass die Mülltonne in Sektor 203 in 10 Minuten 95% Kapazität erreicht. Empfehlung: Reinigungsteam #4 entsenden.' :
              lang === 'ar' ? 'تشير تحليلات الذكاء الاصطناعي التنبؤية إلى أن حاويات النفايات في القطاع 203 ستصل إلى 95٪ من طاقتها الاستيعابية خلال 10 دقائق. يوصى بإرسال فريق التنظيف رقم 4.' : rec.text
      };
    }
    if (rec.id === 'rec-3') {
      return {
        ...rec,
        title: lang === 'es' ? 'Equilibrio de energía Eco-Grid' :
               lang === 'fr' ? 'Équilibrage du réseau Éco' :
               lang === 'de' ? 'Öko-Netz-Stromausgleich' :
               lang === 'ar' ? 'موازنة طاقة الشبكة البيئية' : rec.title,
        text: lang === 'es' ? 'Pico de generación solar. Se recomienda reducir la refrigeración en 1.5°C en las salas VIP desocupadas para una óptima sostenibilidad.' :
              lang === 'fr' ? 'Pic de production solaire. Recommandation : réduire la climatisation de 1,5°C dans les salons VIP inoccupés.' :
              lang === 'de' ? 'Spitze in Solarstromerzeugung. Empfehlung: Chiller-Temperatur in unbesetzten VIP-Lounges um 1,5°C senken für optimale Netznachhaltigkeit.' :
              lang === 'ar' ? 'ذروة توليد الطاقة الشمسية في الملعب. يوصي ArenaIQ بتقليل سرعة المبردات بمقدار 1.5 درجة مئوية في صالات كبار الشخصيات غير الشاغرة لتحقيق الاستدامة المثلى.' : rec.text
      };
    }
    return rec;
  };

  return (
    <div className="main-content">
      {/* Top Header */}
      <header className="top-header">
        <div className="header-title-section">
          <div className="badge-world-cup">
            <i className="fa-solid fa-trophy"></i>
            <span>{t.fifaWorldCup}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-headings)' }}>{t.opsCommandCenter}</h2>
        </div>
        <div className="user-profile-badge">
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            <span>{t.liveStadiumStream}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="ops-grid animate-fade-in">
        {/* Left Column: Map & Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* KPI Metrics */}
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-icon-box green">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <div className="metric-value">{dashboardStats.occupancy}</div>
                <div className="metric-label">{t.occupancy}</div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon-box blue">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <div className="metric-value">{dashboardStats.waitTime}</div>
                <div className="metric-label">{t.avgWait}</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box red">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <div className="metric-value">{dashboardStats.activeIncidents}</div>
                <div className="metric-label">{t.activeIncidentsLabel}</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box yellow">
                <i className="fa-solid fa-hands-helping"></i>
              </div>
              <div>
                <div className="metric-value">{dashboardStats.volunteers}</div>
                <div className="metric-label">{t.volunteersLabel}</div>
              </div>
            </div>
          </div>

          {/* Interactive Map Card */}
          <div className="dashboard-card" style={{ flex: 1 }}>
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-map-location-dot"></i>
                {t.stadiumHeatmap}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {lang === 'ar' ? 'انقر على قطاع لعرض إحصاءات الكثافة المباشرة' : 'Click a sector to view live density stats'}
              </div>
            </div>

            <div className="stadium-container">
              {/* Stadium SVG Drawing */}
              <div className="stadium-svg-wrapper">
                <svg viewBox="0 0 600 400" width="100%" height="100%">
                  {/* Soccer Pitch Center */}
                  <rect x="200" y="130" width="200" height="140" fill="#1e3a8a" stroke="#ffffff" strokeWidth="2" style={{ opacity: theme === 'classic' ? 0.35 : 0.8 }} />
                  {/* Center Circle */}
                  <circle cx="300" cy="200" r="30" fill="none" stroke="#ffffff" strokeWidth="2" />
                  <line x1="300" y1="130" x2="300" y2="270" stroke="#ffffff" strokeWidth="2" />
                  
                  {/* Sector 101 - West Entrance */}
                  <path 
                    d="M 130 90 L 200 130 L 200 270 L 130 310 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S101)} 
                    onClick={() => handleSectorClick('S101')}
                  />
                  <text x="160" y="205" fill="#ffffff" className="sector-label-text">101</text>
                  
                  {/* Sector 102 - North Entrance */}
                  <path 
                    d="M 150 70 L 450 70 L 400 130 L 200 130 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S102)} 
                    onClick={() => handleSectorClick('S102')}
                  />
                  <text x="300" y="105" fill="#ffffff" className="sector-label-text" textAnchor="middle">102</text>

                  {/* Sector 103 - East Entrance */}
                  <path 
                    d="M 400 130 L 470 90 L 470 310 L 400 270 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S103)} 
                    onClick={() => handleSectorClick('S103')}
                  />
                  <text x="430" y="205" fill="#ffffff" className="sector-label-text">103</text>

                  {/* Sector 104 - South Entrance */}
                  <path 
                    d="M 200 270 L 400 270 L 450 330 L 150 330 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S104)} 
                    onClick={() => handleSectorClick('S104')}
                  />
                  <text x="300" y="305" fill="#ffffff" className="sector-label-text" textAnchor="middle">104</text>

                  {/* Outer Tier Sectors */}
                  {/* Sector 201 - Upper North */}
                  <path 
                    d="M 100 40 L 500 40 L 450 70 L 150 70 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S201)} 
                    onClick={() => handleSectorClick('S201')}
                  />
                  <text x="300" y="55" fill="#ffffff" className="sector-label-text" textAnchor="middle">201</text>

                  {/* Sector 202 - Upper East */}
                  <path 
                    d="M 500 40 L 560 70 L 560 330 L 500 360 L 470 310 L 470 90 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S202)} 
                    onClick={() => handleSectorClick('S202')}
                  />
                  <text x="515" y="205" fill="#ffffff" className="sector-label-text">202</text>

                  {/* Sector 203 - Upper South */}
                  <path 
                    d="M 150 330 L 450 330 L 500 360 L 100 360 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S203)} 
                    onClick={() => handleSectorClick('S203')}
                  />
                  <text x="300" y="350" fill="#ffffff" className="sector-label-text" textAnchor="middle">203</text>

                  {/* Sector 204 - Upper West */}
                  <path 
                    d="M 40 70 L 100 40 L 130 90 L 130 310 L 100 360 L 40 330 Z" 
                    className="stadium-sector" 
                    fill={getSectorColor(sectors.S204)} 
                    onClick={() => handleSectorClick('S204')}
                  />
                  <text x="80" y="205" fill="#ffffff" className="sector-label-text">204</text>
                </svg>
              </div>

              {/* Simulation Selector */}
              <div className="simulator-panel">
                <button 
                  className={`sim-btn ${simulation === 'normal' ? 'active' : ''}`}
                  onClick={() => setSimulation('normal')}
                >
                  <i className="fa-solid fa-gamepad"></i> {t.normalMode}
                </button>
                <button 
                  className={`sim-btn ${simulation === 'rush' ? 'active' : ''}`}
                  onClick={() => setSimulation('rush')}
                >
                  <i className="fa-solid fa-bolt"></i> {t.rushHour}
                </button>
                <button 
                  className={`sim-btn ${simulation === 'gateC' ? 'active' : ''}`}
                  onClick={() => setSimulation('gateC')}
                >
                  <i className="fa-solid fa-triangle-exclamation"></i> {t.gateCSurge}
                </button>
                <button 
                  className={`sim-btn ${simulation === 'exit' ? 'active' : ''}`}
                  onClick={() => setSimulation('exit')}
                >
                  <i className="fa-solid fa-door-open"></i> {t.egressFlow}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Decision Support */}
        <div>
          <div className="dashboard-card" style={{ height: '100%' }}>
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-brain" style={{ color: 'var(--color-sports-blue)' }}></i>
                {t.genAIRecommendations}
              </h3>
              <span className="badge-world-cup" style={{ borderColor: 'transparent', backgroundColor: 'var(--color-pitch-light)', color: 'var(--color-pitch-dark)' }}>
                Active Advisor
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {lang === 'ar' 
                ? 'تقوم نماذج الذكاء الاصطناعي التوليدي باستمرار بتحليل الكاميرات ومعدلات الدخول لتقديم حلول استباقية.'
                : 'Real-time GenAI decision models continuously ingest camera feeds, scanner rates, and weather data to suggest preventative actions.'}
            </p>

            <div className="ai-recommendations-list">
              {activeRecs.map(rec => {
                const trRec = getTranslatedRec(rec);
                return (
                  <div key={trRec.id} className={`ai-recommendation-card priority-${trRec.priority}`}>
                    <div className="ai-header-badge">
                      <span className="ai-pill">
                        <i className="fa-solid fa-wand-magic-sparkles"></i> {trRec.priority} Action
                      </span>
                      <span className="rec-timestamp">{trRec.time}</span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {trRec.title}
                    </h4>

                    <p className="rec-content">{trRec.text}</p>

                    {trRec.status === 'pending' ? (
                      <div className="rec-actions">
                        <button 
                          className="btn-primary"
                          onClick={() => handleApproveRec(trRec.id, trRec.title)}
                        >
                          <i className="fa-solid fa-circle-check"></i> {t.approve}
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={() => handleDismissRec(trRec.id)}
                        >
                          {t.dismiss}
                        </button>
                      </div>
                    ) : (
                      <span className="action-success-badge">
                        <i className="fa-solid fa-square-check"></i> {t.approved}
                      </span>
                    )}
                  </div>
                );
              })}

              {activeRecs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-shield-halved" style={{ fontSize: '2rem', marginBottom: '12px' }}></i>
                  <p>All operations normal. No proactive GenAI recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sector details backdrop overlay */}
      <div 
        className={`sector-drawer-backdrop ${selectedSector ? 'open' : ''}`}
        onClick={() => setSelectedSector(null)}
      ></div>

      {/* Sector details drawer */}
      <div className={`sector-drawer ${selectedSector ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t.sectorDetails}</h3>
          <button 
            onClick={() => setSelectedSector(null)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {selectedSector && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div>
              <h4 style={{ color: 'var(--color-pitch)', fontWeight: 700, fontSize: '1.1rem' }}>
                {t[selectedSector]}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'الحالة: مراقبة مباشرة نشطة' : 'Status: Live monitoring active'}
              </p>
            </div>
            
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{t.crowdDensity}</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${sectors[selectedSector]}%`, 
                      height: '100%', 
                      backgroundColor: getSectorColor(sectors[selectedSector]),
                      transition: 'width 0.4s ease'
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{sectors[selectedSector]}%</span>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{t.activeIncidentsInSector}</h5>
              {incidents.filter(inc => inc.sector === selectedSector && inc.status !== 'resolved').length > 0 ? (
                incidents.filter(inc => inc.sector === selectedSector && inc.status !== 'resolved').map(inc => (
                  <div key={inc.id} style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '8px', borderLeft: '4px solid var(--color-danger)' }}>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>{inc.title}</strong>
                    <span style={{ color: 'var(--text-secondary)', display: 'block' }}>{inc.description}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      {t.assignedTo}: {inc.assignedTo}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'لا توجد بلاغات نشطة في هذا القطاع.' : 'No active incidents in this sector.'}
                </p>
              )}
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{t.quickActions}</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleQuickAction('bypass')}
                  style={{ justifyContent: 'center' }}
                >
                  <i className="fa-solid fa-shuffle"></i> {t.deployBypassGate}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => handleQuickAction('security')}
                  style={{ justifyContent: 'center' }}
                >
                  <i className="fa-solid fa-shield-halved"></i> {t.increaseSecurity}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => handleQuickAction('reroute')}
                  style={{ justifyContent: 'center' }}
                >
                  <i className="fa-solid fa-arrow-turn-down"></i> {t.reRoutePedestrians}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
