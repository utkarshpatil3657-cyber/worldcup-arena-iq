import React, { useState } from 'react';
import { translations } from '../utils/translations';

export default function IncidentDispatcher({ incidents, setIncidents, addToast, lang }) {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('S103');
  const [severity, setSeverity] = useState('warning');
  const [description, setDescription] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const t = translations[lang] || translations.en;

  // Simulated volunteers base
  const volunteers = [
    { name: 'Maria Gonzalez', id: 'v1', languages: ['Spanish', 'English'], location: 'S103', activeTask: 'None', score: 98, specialty: 'Ticketing / Gate Entry' },
    { name: 'Pierre Dubois', id: 'v2', languages: ['French', 'English'], location: 'S104', activeTask: 'None', score: 85, specialty: 'Accessibility Escort' },
    { name: 'Yuki Tanaka', id: 'v3', languages: ['Japanese', 'English'], location: 'S101', activeTask: 'Assisting fan', score: 60, specialty: 'Info Booth Coordinator' },
    { name: 'Hans Miller', id: 'v4', languages: ['German', 'English'], location: 'S201', activeTask: 'None', score: 72, specialty: 'First Aid Support' },
    { name: 'Amina Al-Mansoor', id: 'v5', languages: ['Arabic', 'English'], location: 'S203', activeTask: 'None', score: 90, specialty: 'Crowd Flow Support' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast(lang === 'ar' ? 'يرجى تعبئة كافة التفاصيل.' : 'Please fill out all incident details.');
      return;
    }

    const assignedVol = volunteers.find(v => v.location === sector);
    const newIncident = {
      id: `inc-${Date.now()}`,
      title,
      sector,
      severity,
      description,
      status: 'assigned',
      assignedTo: assignedVol ? assignedVol.name : 'Unassigned',
      time: 'Just now'
    };

    setIncidents([newIncident, ...incidents]);
    addToast(lang === 'ar' ? `تم تسجيل البلاغ: ${title} في النظام.` : `Incident Reported: ${title} registered in operations system.`);
    
    // Reset Form
    setTitle('');
    setDescription('');
  };

  const handleResolve = (id, incTitle) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'resolved' } : inc));
    addToast(lang === 'ar' ? `تم حل البلاغ: ${incTitle}` : `Incident Resolved: ${incTitle}`);
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(null);
    }
  };

  const getSeverityBadgeClass = (sev) => {
    if (sev === 'critical') return 'incident-badge critical';
    if (sev === 'warning') return 'incident-badge warning';
    return 'incident-badge info';
  };

  const getSectorLabel = (secId) => {
    return t[secId] || secId;
  };

  return (
    <div className="main-content">
      {/* Header */}
      <header className="top-header">
        <div className="header-title-section">
          <div className="badge-world-cup">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{t.fifaWorldCup}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-headings)' }}>{t.incidentLog}</h2>
        </div>
      </header>

      {/* Grid */}
      <div className="dispatcher-grid animate-fade-in">
        {/* Left: Report Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fa-solid fa-plus-circle"></i>
                {t.logNewIncident}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t.incidentTitle}</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder={lang === 'ar' ? 'مثال: تسرب مياه عند ماسحات البوابة B' : 'e.g., Water Spill near Gate B scanners'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>{t.locationSector}</label>
                  <select 
                    className="form-control"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                  >
                    <option value="S101">{t.S101}</option>
                    <option value="S102">{t.S102}</option>
                    <option value="S103">{t.S103}</option>
                    <option value="S104">{t.S104}</option>
                    <option value="S201">{t.S201}</option>
                    <option value="S202">{t.S202}</option>
                    <option value="S203">{t.S203}</option>
                    <option value="S204">{t.S204}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t.severityLevel}</label>
                  <select 
                    className="form-control"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="critical">{t.critical}</option>
                    <option value="warning">{t.warning}</option>
                    <option value="info">{t.info}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{t.detailsContext}</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder={lang === 'ar' ? 'صف المشكلة. سيقوم نظام الذكاء الاصطناعي تلقائياً بتحليل التفاصيل ومطابقتها.' : 'Describe the issue. ArenaIQ GenAI will automatically categorize details.'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                <i className="fa-solid fa-paper-plane"></i> {t.logIncidentButton}
              </button>
            </form>
          </div>

          {/* AI Volunteer Recommendation list */}
          {selectedIncident && selectedIncident.status !== 'resolved' && (
            <div className="dashboard-card" style={{ border: '1px solid var(--border-focus)' }}>
              <div className="card-header" style={{ borderBottomColor: 'var(--border-color)' }}>
                <h3 className="card-title" style={{ color: 'var(--color-pitch)' }}>
                  <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--color-pitch)' }}></i>
                  {t.volunteerMatch}
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {lang === 'ar' ? 'مطابقة الحادثة لـ: ' : 'Match evaluation for: '} <strong>{selectedIncident.title}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {volunteers
                  .filter(v => v.languages.some(l => selectedIncident.title.toLowerCase().includes(l.toLowerCase())) || v.location === selectedIncident.sector)
                  .sort((a,b) => b.score - a.score)
                  .map(vol => (
                    <div key={vol.id} className="volunteer-match-card" style={{ backgroundColor: 'var(--color-pitch-light)', borderColor: 'var(--border-color)' }}>
                      <div className="volunteer-match-info" style={{ color: 'var(--text-primary)' }}>
                        <h6 style={{ color: 'var(--color-pitch-dark)', fontWeight: 700 }}>{vol.name} ({vol.specialty})</h6>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          {lang === 'ar' ? 'القطاع' : 'Sector'}: {getSectorLabel(vol.location)} • {t.languages}: {vol.languages.join(', ')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: 800, 
                          color: 'var(--color-pitch-dark)',
                          display: 'block' 
                        }}>
                          {vol.score}% Match
                        </span>
                        <button 
                          className="btn-primary"
                          style={{ padding: '4px 10px', fontSize: '0.7rem', marginTop: '4px' }}
                          onClick={() => {
                            setIncidents(prev => prev.map(inc => inc.id === selectedIncident.id ? { ...inc, assignedTo: vol.name } : inc));
                            addToast(lang === 'ar' ? `تم تعيين المتطوع ${vol.name} للحادثة.` : `Assigned volunteer ${vol.name} to incident.`);
                            setSelectedIncident(prev => ({ ...prev, assignedTo: vol.name }));
                          }}
                        >
                          {lang === 'ar' ? 'تعيين' : 'Assign'}
                        </button>
                      </div>
                    </div>
                  ))}
                {volunteers.filter(v => v.languages.some(l => selectedIncident.title.toLowerCase().includes(l.toLowerCase())) || v.location === selectedIncident.sector).length === 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px' }}>
                    {lang === 'ar' ? 'لا توجد مطابقة مثالية في هذا القطاع. نقترح إرسال دعم احتياطي من قطاع 101.' : 'No perfect match in the immediate sector. Recommending backup from Sector 101.'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Incidents Log */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fa-solid fa-list-check"></i>
              {lang === 'ar' ? 'سجل البلاغات النشطة' : 'Active Incidents Telemetry'}
            </h3>
          </div>

          <div className="incidents-list">
            {incidents.map(inc => (
              <div 
                key={inc.id} 
                className={`incident-row ${inc.severity}`}
                style={{ 
                  cursor: 'pointer',
                  borderColor: selectedIncident?.id === inc.id ? 'var(--color-pitch)' : '',
                  opacity: inc.status === 'resolved' ? 0.6 : 1
                }}
                onClick={() => setSelectedIncident(inc)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={getSeverityBadgeClass(inc.severity)}>
                      {inc.severity === 'critical' ? t.critical : inc.severity === 'warning' ? t.warning : t.info}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inc.time}</span>
                  </div>
                  <h5 style={{ textDecoration: inc.status === 'resolved' ? 'line-through' : 'none' }}>{inc.title}</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الموقع' : 'Location'}: <strong>{getSectorLabel(inc.sector)}</strong> • {t.assignedTo}: <strong>{inc.assignedTo}</strong>
                  </p>
                </div>
                
                <div className="incident-status-container">
                  {inc.status !== 'resolved' ? (
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--color-pitch)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(inc.id, inc.title);
                      }}
                    >
                      {t.resolve}
                    </button>
                  ) : (
                    <span style={{ color: 'var(--color-pitch)', fontWeight: 700, fontSize: '0.8rem' }}>
                      <i className="fa-solid fa-circle-check"></i> {t.resolved}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {incidents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '2.5rem', color: 'var(--color-pitch)', marginBottom: '12px' }}></i>
                <p>No active incidents reported. Stadium operations running smoothly.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
