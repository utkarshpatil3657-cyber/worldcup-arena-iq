import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../utils/translations';

export default function FloatingChatbot({
  lang,
  theme,
  setTheme,
  simulation,
  setSimulation,
  addToast,
  addIncident,
  onClearBin,
  activeTab,
  geminiApiKey,
  handleAIResponseCommand
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState('staff'); // Default to staff for operations command
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingThought, setTypingThought] = useState('');
  const messagesEndRef = useRef(null);
  
  const t = translations[lang] || translations.en;

  const [messages, setMessages] = useState([
    {
      id: 'float-msg-init',
      sender: 'ai',
      content: t.chatbotGreeting,
      thought: null
    }
  ]);

  // Contextual suggestions depending on active view
  const getContextSuggestions = () => {
    if (activeTab === 'analytics') {
      return [
        { text: lang === 'ar' ? 'تفريغ القطاع 103' : 'Clear Sector 103 trash', label: 'Clear S103' },
        { text: lang === 'ar' ? 'حافلة إضافية لسكك الحديد' : 'Add bus to Rail Link', label: 'Add Shuttle' },
        { text: lang === 'ar' ? 'تحليل المشاعر' : 'Show sentiment prediction', label: 'Sentiment' }
      ];
    }
    if (activeTab === 'incidents') {
      return [
        { text: lang === 'ar' ? 'إبلاغ عن تسرب مياه في 102' : 'Report spill in Sector 102', label: 'Spill incident' },
        { text: lang === 'ar' ? 'طلب كرسي متحرك للبوابة D' : 'Request wheelchair for Gate D', label: 'Wheelchair assist' },
        { text: lang === 'ar' ? 'أفضل متطوع للقطاع 103' : 'Who is best volunteer for S103?', label: 'Volunteer matches' }
      ];
    }
    return [
      { text: lang === 'ar' ? 'المظهر الكلاسيكي' : 'Set theme to classic', label: 'Theme Classic' },
      { text: lang === 'ar' ? 'محاكاة وقت الذروة' : 'Switch simulation to rush hour', label: 'Simulate Rush' },
      { text: lang === 'ar' ? 'تفريغ حاوية القطاع 203' : 'Clear Sector 203 trash', label: 'Clear S203' }
    ];
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, typingThought]);

  // Simulated commands fallback
  const processCommandFallback = (query) => {
    const q = query.toLowerCase();
    
    // Theme switching
    if (q.includes('classic') || q.includes('كلاسيكي') || q.includes('المظهر الكلاسيكي')) {
      setTheme('classic');
      addToast(lang === 'ar' ? 'تم تفعيل المظهر الكلاسيكي (الأزرق والذهبي)' : 'Classic theme activated via Chatbot Command.');
      return {
        text: lang === 'ar' ? 'تم تغيير مظهر النظام إلى المظهر الكلاسيكي العريق (الأزرق والذهبي) بنجاح!' : 'I have successfully updated the dashboard theme to the Classic (Royal Blue & Athletic Gold) design system!',
        thought: ['Interpreting client theme update...', 'Applying attributes: data-theme="classic" in document root...']
      };
    }
    if (q.includes('modern') || q.includes('عصري') || q.includes('المظهر العصري') || q.includes('green')) {
      setTheme('modern');
      addToast(lang === 'ar' ? 'تم تفعيل المظهر العصري (الأخضر)' : 'Modern pitch theme activated via Chatbot Command.');
      return {
        text: lang === 'ar' ? 'تمت إعادة مظهر النظام إلى المظهر العصري الرياضي (الأخضر) بنجاح!' : 'I have successfully restored the dashboard theme to the Modern Pitch Green design system!',
        thought: ['Interpreting client theme update...', 'Removing classic theme attributes in document root...']
      };
    }

    // Simulation commands
    if (q.includes('rush') || q.includes('ذروة') || q.includes('وقت الذروة')) {
      setSimulation('rush');
      addToast(lang === 'ar' ? 'تفعيل محاكاة تدفق الذروة' : 'Simulation changed to Rush Hour via Chatbot.');
      return {
        text: lang === 'ar' ? 'تم تفعيل سيناريو ساعة الذروة. نسبة الإشغال الآن 96٪ مع زيادة الضغط على البوابات.' : 'Rush Hour crowd scenario activated. Main stadium occupancy updated to 96% with high wait time projections.',
        thought: ['Modifying global simulation mode to "rush"...', 'Recalculating crowd density algorithms for all sectors...']
      };
    }
    if (q.includes('gate c') || q.includes('بوابة c') || q.includes('بوابة ج')) {
      setSimulation('gateC');
      addToast(lang === 'ar' ? 'تفعيل محاكاة ازدحام البوابة C' : 'Simulation changed to Gate C Surge.');
      return {
        text: lang === 'ar' ? 'تم تفعيل تنبيه البوابة C. هناك خلل في قراءة الرموز الشريطية يسبب عنق زجاجة.' : 'Gate C Surge alert activated. Scanner barcode errors are causing high localization delay in Sector 103.',
        thought: ['Modifying global simulation mode to "gateC"...', 'Focussing traffic bottleneck algorithms on Sector 103...']
      };
    }
    if (q.includes('normal') || q.includes('طبيعي') || q.includes('الوضع الطبيعي')) {
      setSimulation('normal');
      addToast(lang === 'ar' ? 'تفعيل الوضع التشغيلي الطبيعي' : 'Simulation restored to Normal.');
      return {
        text: lang === 'ar' ? 'تمت إعادة ضبط محاكاة الجماهير إلى الوضع التشغيلي الطبيعي.' : 'Crowd flow simulation restored to normal match-day operations.',
        thought: ['Resetting simulation mode to "normal"...', 'Averaging sector densities and resetting wait times...']
      };
    }

    // Eco commands
    if (q.includes('clear') || q.includes('تفريغ') || q.includes('clean')) {
      let sec = 'Sector 103';
      let binId = 'b3';
      if (q.includes('203') || q.includes('٢٠٣')) {
        sec = 'Sector 203';
        binId = 'b7';
      } else if (q.includes('101') || q.includes('١٠١')) {
        sec = 'Sector 101';
        binId = 'b1';
      }

      if (onClearBin) {
        onClearBin(binId);
        return {
          text: lang === 'ar' ? `تم إرسال فريق النظافة لتفريغ الحاويات في ${sec} فوراً!` : `Eco cleaning dispatch order sent! Bins in ${sec} have been emptied to 10% capacity.`,
          thought: ['Intercepting clear command...', `Invoking empty action for bin ID ${binId}...`]
        };
      }
    }

    // Incident creation commands
    if (q.includes('spill') || q.includes('تسرب') || q.includes('انسكاب')) {
      let sectorCode = 'S102';
      let sectorName = 'Sector 102';
      if (q.includes('103') || q.includes('١٠٣')) { sectorCode = 'S103'; sectorName = 'Sector 103'; }
      
      const newInc = {
        title: lang === 'ar' ? 'انسكاب سوائل تم الإبلاغ عنه بواسطة الروبوت' : 'Liquid Spill reported via AI Chatbot',
        sector: sectorCode,
        severity: 'warning',
        desc: lang === 'ar' ? `تم اكتشاف تسرب سوائل في ${sectorName}.` : `Liquid hazard detected in ${sectorName}.`
      };
      addIncident(newInc);
      return {
        text: lang === 'ar' ? `تم الإبلاغ عن حادثة الانسكاب في ${sectorName} بنجاح وتم تعيين متطوع.` : `Incident logged: Liquid spill reported in ${sectorName}. I have automatically created a dispatch ticket.`,
        thought: ['Parsing incident report details...', 'Generating new incident payload...']
      };
    }

    return {
      text: lang === 'ar' 
        ? `تلقيت طلبك: "${query}". كوني مساعد عمليات ArenaIQ، قمت بتحليل الطلب وهو جاهز للتنفيذ. هل تود أن أقوم بتغيير المظهر أو تفعيل سيناريوهات المحاكاة؟`
        : `I received: "${query}". As ArenaIQ operations intelligence, I have cross-referenced this request. If you want to trigger actions, try asking me to 'clear Sector 203' or 'set theme to classic'.`,
      thought: ['Parsing queries...', 'Evaluating text intent...']
    };
  };

  // Real Gemini API Fetcher
  const fetchGeminiResponse = async (userQuery) => {
    const systemInstruction = `You are ArenaIQ, the Generative AI assistant for stadium operations at the FIFA World Cup 2026, MetLife Stadium.
You are chatting with a user whose active role is: ${role}.
The active language is: ${lang}.
The active crowd simulation is: ${simulation}.

You can control the dashboard by embedding one of the following exact command tags in your response. Only output commands if the user explicitly asks for them or if they are highly relevant to resolving the issue:
- To set the styling theme: [COMMAND: SET_THEME classic] or [COMMAND: SET_THEME modern]
- To toggle crowd simulations: [COMMAND: SET_SIMULATION rush] or [COMMAND: SET_SIMULATION gateC] or [COMMAND: SET_SIMULATION normal] or [COMMAND: SET_SIMULATION exit]
- To empty/clear waste bins (b1 to b8, e.g. b3 is Sector 103, b7 is Sector 203): [COMMAND: CLEAR_BIN b3]
- To file a new operations incident: [COMMAND: REPORT_INCIDENT title="Incident Title" sector="SectorCode" severity="critical/warning/info" desc="details"] (Sectors are S101 to S104, S201 to S204).

Keep your answers concise and directly in the language (${lang}). If you trigger a command, mention it briefly in your text.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userQuery }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        }
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg = {
      id: `float-msg-${Date.now()}`,
      sender: 'user',
      content: userText,
      thought: null
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTypingThought(lang === 'ar' ? 'تحليل الطلب وجلب البيانات التشغيلية...' : 'Analyzing query & retrieving stadium telemetry...');

    try {
      if (geminiApiKey) {
        // Run Real Gemini API
        const rawResponse = await fetchGeminiResponse(userText);
        setIsTyping(false);
        setTypingThought('');
        
        const cleanResponse = handleAIResponseCommand(rawResponse);

        const thoughts = [
          'Forwarding operations string to Gemini API...',
          'Validating command tag structures...',
          'Updating global states accordingly...'
        ];

        const aiMsg = {
          id: `float-msg-${Date.now()}-ai`,
          sender: 'ai',
          content: cleanResponse,
          thought: thoughts
        };
        
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Fallback simulated commands
        setTimeout(() => {
          const result = processCommandFallback(userText);
          setIsTyping(false);
          setTypingThought('');
          
          const aiMsg = {
            id: `float-msg-${Date.now()}-ai`,
            sender: 'ai',
            content: result.text,
            thought: result.thought
          };
          
          setMessages(prev => [...prev, aiMsg]);
        }, 1200);
      }
    } catch (err) {
      setIsTyping(false);
      setTypingThought('');
      addToast('Gemini API Error: Check API key validity.');

      const aiMsg = {
        id: `float-msg-${Date.now()}-err`,
        sender: 'ai',
        content: lang === 'ar'
          ? 'حدث خطأ أثناء الاتصال بـ Gemini API. يرجى التحقق من صحة مفتاح API الخاص بك في الإعدادات.'
          : 'Error querying Gemini API. Please review your API Key in the Sidebar Settings.',
        thought: ['Error resolving REST query...']
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  return (
    <div className={`floating-chatbot-root ${isOpen ? 'open' : ''} ${lang === 'ar' ? 'rtl' : ''}`}>
      {/* Floating Action Button */}
      <button 
        className="floating-chatbot-fab" 
        onClick={() => setIsOpen(!isOpen)}
        title={t.chatbotTitle}
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark"></i>
        ) : (
          <i className="fa-solid fa-comment-dots"></i>
        )}
      </button>

      {/* Chat Drawer Box */}
      {isOpen && (
        <div className="floating-chatbot-box animate-fade-in">
          {/* Header */}
          <div className="chatbot-box-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="bot-avatar">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{t.chatbotTitle}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', opacity: 0.8 }}>
                  <span className="online-pulse"></span>
                  <span>{t.chatbotSubtitle}</span>
                </div>
              </div>
            </div>
            <button className="minimize-btn" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>

          {/* Quick context select */}
          <div className="chatbot-role-selector">
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Mode:
            </span>
            <button className={`role-chip-mini ${role === 'fan' ? 'active' : ''}`} onClick={() => setRole('fan')}>
              {t.fan}
            </button>
            <button className={`role-chip-mini ${role === 'volunteer' ? 'active' : ''}`} onClick={() => setRole('volunteer')}>
              {t.volunteer}
            </button>
            <button className={`role-chip-mini ${role === 'staff' ? 'active' : ''}`} onClick={() => setRole('staff')}>
              {t.staff}
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-box-messages">
            {/* Warning when API Key is unconfigured */}
            {!geminiApiKey && (
              <div style={{ 
                backgroundColor: 'var(--color-warning-light)', 
                border: '1px solid var(--color-warning)', 
                padding: '8px 12px', 
                fontSize: '0.72rem',
                color: 'var(--color-warning)',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className="fa-solid fa-circle-info"></i>
                <span>
                  {lang === 'ar' 
                    ? 'وضع محاكاة المساعد نشط. أدخل مفتاح API لتفعيل الذكاء الاصطناعي الحقيقي.'
                    : 'Simulation active. Enter an API Key in the settings to activate real Gemini responses.'}
                </span>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`float-bubble ${msg.sender}`}>
                {msg.thought && msg.thought.length > 0 && (
                  <div className="float-thought-box">
                    <div className="float-thought-header">
                      <i className="fa-solid fa-gears"></i>
                      <span>{t.thoughtProcess}</span>
                    </div>
                    {msg.thought.map((th, i) => (
                      <div key={i} style={{ fontSize: '0.7rem', marginBottom: '2px' }}>• {th}</div>
                    ))}
                  </div>
                )}
                <div className="float-bubble-content">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="float-bubble ai">
                {typingThought && (
                  <div className="float-thought-box">
                    <div className="float-thought-header">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>{typingThought}</span>
                    </div>
                  </div>
                )}
                <div className="float-bubble-content" style={{ padding: '8px 12px' }}>
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Suggestions Chips */}
          <div className="chatbot-suggestions">
            {getContextSuggestions().map((sug, idx) => (
              <button 
                key={idx} 
                className="chatbot-sug-chip"
                onClick={() => handleSuggestionClick(sug.text)}
              >
                {sug.text}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="chatbot-box-input">
            <input 
              type="text" 
              placeholder={t.chatPlaceholder} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
