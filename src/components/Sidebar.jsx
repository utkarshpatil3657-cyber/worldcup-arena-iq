import React from 'react';
import { translations } from '../utils/translations';

export default function Sidebar({
  activeTab,
  setActiveTab,
  liveIncidentCount,
  lang,
  setLang,
  theme,
  setTheme
}) {
  const t = translations[lang] || translations.en;

  return (
    <div className="sidebar-panel">
      <div className="sidebar-brand">
        <div className="logo-badge">
          <i className="fa-solid fa-ranking-star"></i>
        </div>
        <div className="sidebar-brand-name">
          Arena<span>IQ</span>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <div 
          className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <i className="fa-solid fa-chart-line"></i>
          <span>{t.opsDashboard}</span>
        </div>
        
        <div 
          className={`sidebar-link ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <i className="fa-solid fa-robot"></i>
          <span>{t.aiConcierge}</span>
        </div>
        
        <div 
          className={`sidebar-link ${activeTab === 'incidents' ? 'active' : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>{t.incidents}</span>
          {liveIncidentCount > 0 && (
            <span style={{
              marginInlineStart: 'auto',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              {liveIncidentCount}
            </span>
          )}
        </div>
        
        <div 
          className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <i className="fa-solid fa-leaf"></i>
          <span>{t.ecoAnalytics}</span>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="sidebar-settings">
        <div className="sidebar-settings-title">{t.settings}</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{t.language}</label>
          <select 
            className="sidebar-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English (EN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="de">Deutsch (DE)</option>
            <option value="ar">العربية (AR)</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{t.theme}</label>
          <select 
            className="sidebar-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="modern">{t.modern}</option>
            <option value="classic">{t.classic}</option>
          </select>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <div className="sidebar-footer-title">{t.fifaWorldCup}</div>
        <div>{t.stadiumNode}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
          <span>{t.saasConnected}</span>
        </div>
      </div>
    </div>
  );
}
