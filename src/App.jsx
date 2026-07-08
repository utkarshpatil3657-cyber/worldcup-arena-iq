import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OpsDashboard from './components/OpsDashboard';
import AIAssistant from './components/AIAssistant';
import IncidentDispatcher from './components/IncidentDispatcher';
import AnalyticsSustainability from './components/AnalyticsSustainability';
import FloatingChatbot from './components/FloatingChatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [simulation, setSimulation] = useState('normal');
  const [toasts, setToasts] = useState([]);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('modern');
  
  // Real-time Google AI Studio Gemini API Key stored securely in localStorage
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('arena_iq_gemini_api_key') || '';
  });

  // Shared incidents state
  const [incidents, setIncidents] = useState([
    {
      id: 'inc-1',
      title: 'Gate C scanner barcode errors',
      sector: 'S103',
      severity: 'critical',
      description: 'Multiple fans reporting scanning error code 404 at primary ticket checkpoints.',
      status: 'assigned',
      assignedTo: 'Maria Gonzalez',
      time: '10 mins ago'
    },
    {
      id: 'inc-2',
      title: 'Water spill near VIP suites',
      sector: 'S104',
      severity: 'warning',
      description: 'A large liquid spill is present on the main corridor carpet. Hazard warning cones required.',
      status: 'assigned',
      assignedTo: 'Pierre Dubois',
      time: '24 mins ago'
    }
  ]);

  // Shared dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    occupancy: '74%',
    waitTime: '12 min',
    activeIncidents: 2,
    volunteers: 148
  });

  // Sync theme attribute in DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync text direction attribute in DOM for RTL languages like Arabic
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
  }, [language]);

  // Sync API Key to localStorage
  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem('arena_iq_gemini_api_key', geminiApiKey);
    } else {
      localStorage.removeItem('arena_iq_gemini_api_key');
    }
  }, [geminiApiKey]);

  // Helper to add toast banners
  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    
    // Clear toast after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Helper to append a new incident
  const addIncident = (incidentData) => {
    const newInc = {
      id: `inc-${Date.now()}`,
      title: incidentData.title || 'Spill hazard reported by AI',
      sector: incidentData.sector || 'S102',
      severity: incidentData.severity || 'warning',
      description: incidentData.desc || 'Incident logged via AI Assistant.',
      status: 'assigned',
      assignedTo: 'Amina Al-Mansoor',
      time: 'Just now'
    };
    setIncidents(prev => [newInc, ...prev]);
    addToast(`AI-Assigned Task: "${newInc.title}" dispatched.`);
  };

  // Callback to clear waste bins via custom events
  const handleClearBin = (binId) => {
    window.dispatchEvent(new CustomEvent('clear-bin', { detail: { binId } }));
  };

  // Central command parser that executes instructions hidden in AI responses
  const handleAIResponseCommand = (text) => {
    if (!text) return '';
    let cleanText = text;

    // 1. Theme Commands
    if (cleanText.includes('[COMMAND: SET_THEME classic]')) {
      setTheme('classic');
      addToast(language === 'ar' ? 'تم تفعيل المظهر الكلاسيكي بواسطة الذكاء الاصطناعي' : 'Classic theme activated by AI.');
    } else if (cleanText.includes('[COMMAND: SET_THEME modern]')) {
      setTheme('modern');
      addToast(language === 'ar' ? 'تم تفعيل المظهر العصري بواسطة الذكاء الاصطناعي' : 'Modern theme activated by AI.');
    }

    // 2. Simulation Commands
    if (cleanText.includes('[COMMAND: SET_SIMULATION rush]')) {
      setSimulation('rush');
      addToast(language === 'ar' ? 'تفعيل محاكاة ساعة الذروة بواسطة الذكاء الاصطناعي' : 'Simulation: Rush Hour activated by AI.');
    } else if (cleanText.includes('[COMMAND: SET_SIMULATION gateC]')) {
      setSimulation('gateC');
      addToast(language === 'ar' ? 'تفعيل تنبيه البوابة C بواسطة الذكاء الاصطناعي' : 'Simulation: Gate C Surge activated by AI.');
    } else if (cleanText.includes('[COMMAND: SET_SIMULATION normal]')) {
      setSimulation('normal');
      addToast(language === 'ar' ? 'إعادة ضبط التدفق للوضع الطبيعي بواسطة الذكاء الاصطناعي' : 'Simulation: Normal Flow restored by AI.');
    } else if (cleanText.includes('[COMMAND: SET_SIMULATION exit]')) {
      setSimulation('exit');
      addToast(language === 'ar' ? 'تفعيل محاكاة الخروج بواسطة الذكاء الاصطناعي' : 'Simulation: Exit Flow activated by AI.');
    }

    // 3. Clear Waste Bin Commands: [COMMAND: CLEAR_BIN b3]
    const binRegex = /\[COMMAND:\s*CLEAR_BIN\s+(b\d+)\]/i;
    const binMatch = cleanText.match(binRegex);
    if (binMatch) {
      handleClearBin(binMatch[1]);
    }

    // 4. Incident Log Commands: [COMMAND: REPORT_INCIDENT title="..." sector="..." severity="..." desc="..."]
    const incRegex = /\[COMMAND:\s*REPORT_INCIDENT\s+title="([^"]+)"\s+sector="([^"]+)"\s+severity="([^"]+)"\s+desc="([^"]+)"\]/i;
    const incMatch = cleanText.match(incRegex);
    if (incMatch) {
      addIncident({
        title: incMatch[1],
        sector: incMatch[2],
        severity: incMatch[3],
        desc: incMatch[4]
      });
    }

    // Strip all [COMMAND: ...] tags out so they don't show up in speech bubbles
    cleanText = cleanText.replace(/\[COMMAND:[^\]]+\]/gi, '');
    return cleanText.trim();
  };

  // Sync active incident metrics
  useEffect(() => {
    const activeCount = incidents.filter(i => i.status !== 'resolved').length;
    setDashboardStats(prev => ({ ...prev, activeIncidents: activeCount }));
  }, [incidents]);

  // Render view components
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OpsDashboard 
            incidents={incidents}
            setIncidents={setIncidents}
            simulation={simulation}
            setSimulation={setSimulation}
            addToast={addToast}
            dashboardStats={dashboardStats}
            setDashboardStats={setDashboardStats}
            lang={language}
            theme={theme}
          />
        );
      case 'chat':
        return (
          <AIAssistant 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            simulation={simulation}
            setSimulation={setSimulation}
            addToast={addToast}
            addIncident={addIncident}
            lang={language}
            geminiApiKey={geminiApiKey}
            setGeminiApiKey={setGeminiApiKey}
            handleAIResponseCommand={handleAIResponseCommand}
          />
        );
      case 'incidents':
        return (
          <IncidentDispatcher 
            incidents={incidents}
            setIncidents={setIncidents}
            addToast={addToast}
            lang={language}
          />
        );
      case 'analytics':
        return (
          <AnalyticsSustainability 
            addToast={addToast}
            simulation={simulation}
            lang={language}
          />
        );
      default:
        return (
          <div style={{ padding: '32px' }}>
            <h2>Tab not found</h2>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        liveIncidentCount={incidents.filter(i => i.status !== 'resolved').length}
        lang={language}
        setLang={setLanguage}
        theme={theme}
        setTheme={setTheme}
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
      />

      {/* Main Panel View */}
      {renderTabContent()}

      {/* Persistent Floating Chatbot widget */}
      <FloatingChatbot 
        lang={language}
        theme={theme}
        setTheme={setTheme}
        simulation={simulation}
        setSimulation={setSimulation}
        addToast={addToast}
        addIncident={addIncident}
        onClearBin={handleClearBin}
        activeTab={activeTab}
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
        handleAIResponseCommand={handleAIResponseCommand}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <i className="fa-solid fa-bell" style={{ color: 'var(--color-pitch)' }}></i>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
