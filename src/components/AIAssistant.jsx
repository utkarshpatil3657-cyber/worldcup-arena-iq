import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../utils/translations';

export default function AIAssistant({ 
  activeTab, 
  setActiveTab, 
  simulation, 
  setSimulation, 
  addToast, 
  addIncident, 
  lang,
  geminiApiKey,
  handleAIResponseCommand
}) {
  const [role, setRole] = useState('fan'); // fan, volunteer, staff
  const [input, setInput] = useState('');
  const t = translations[lang] || translations.en;

  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      role: 'fan',
      content: t.initFanMessage,
      thought: null
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingThought, setTypingThought] = useState('');
  const messagesEndRef = useRef(null);

  // Sync initial message on language change
  useEffect(() => {
    setMessages([
      {
        id: `msg-init-${role}-${lang}`,
        sender: 'ai',
        role: role,
        content: role === 'fan' ? t.initFanMessage : t.welcomeMessage,
        thought: null
      }
    ]);
  }, [lang, role]);

  // Suggested questions based on role and language
  const getTranslatedSuggestions = () => {
    if (lang === 'es') {
      return {
        fan: [
          { text: "¿Dónde está la sala sensorial más cercana?", label: "Acceso a Sala Sensorial" },
          { text: "¿Ruta más rápida a la Sección 103 desde la Puerta B?", label: "Navegación de Ruta" },
          { text: "Traducir '¿Dónde está la estación de primeros auxilios?' al francés", label: "Traducción al Francés" },
          { text: "¿Dónde puedo reciclar mi vaso conmemorativo?", label: "Reciclaje Ecológico" }
        ],
        volunteer: [
          { text: "Generar informe previo al partido España vs Alemania.", label: "Informe de Partido" },
          { text: "¿Cómo solicito asistencia en silla de ruedas para la Puerta D?", label: "Solicitud de Silla de Ruedas" },
          { text: "Traducir 'Tenga listo el código de barras de su boleto' al español", label: "Traducción de Boleto" }
        ],
        staff: [
          { text: "¿Cuál es la predicción de la IA para el bloqueo de la Puerta C?", label: "Análisis de Puerta C" },
          { text: "Optimizar rutas de autobús para el flujo de salida.", label: "Optimización de Autobuses" },
          { text: "Borrador de anuncio de desbordamiento de basura en sector 203.", label: "Anuncio de Personal" }
        ]
      };
    }
    if (lang === 'fr') {
      return {
        fan: [
          { text: "Où se trouve la salle sensorielle la plus proche ?", label: "Accès Salle Sensorielle" },
          { text: "Itinéraire le plus rapide vers la section 103 depuis la porte B ?", label: "Navigation" },
          { text: "Traduire 'Où est le poste de secours ?' en français", label: "Traduction en Français" },
          { text: "Où recycler ma tasse commémorative ?", label: "Recyclage Éco" }
        ],
        volunteer: [
          { text: "Générer le briefing d'avant-match Espagne vs Allemagne.", label: "Briefing Match" },
          { text: "Comment demander une assistance en fauteuil roulant pour la porte D ?", label: "Fauteuil Roulant" },
          { text: "Traduire 'Préparez votre code-barres' en espagnol", label: "Traduction Ticket" }
        ],
        staff: [
          { text: "Quelle est la prédiction de l'IA pour le blocage de la porte C ?", label: "Analyse Porte C" },
          { text: "Optimiser les navettes pour la sortie de foule.", label: "Optimisation Navettes" },
          { text: "Rédiger l'annonce pour le débordement de poubelle au secteur 203.", label: "Annonce Personnel" }
        ]
      };
    }
    if (lang === 'de') {
      return {
        fan: [
          { text: "Wo ist der nächste sensorische Raum?", label: "Sensorik-Raum Zugang" },
          { text: "Schnellster Weg zu Sektor 103 von Tor B?", label: "Routen-Navigation" },
          { text: "Übersetze 'Wo ist die Erste-Hilfe-Station?' ins Französische", label: "Französisch-Übersetzung" },
          { text: "Wo kann ich meinen Becher recyceln?", label: "Öko-Recycling" }
        ],
        volunteer: [
          { text: "Erstelle Vorbericht für Spanien vs. Deutschland.", label: "Spielbericht" },
          { text: "Wie beantrage ich Rollstuhlunterstützung für Tor D?", label: "Rollstuhl-Anforderung" },
          { text: "Übersetze 'Bitte halten Sie Ihr Ticket bereit' ins Spanische", label: "Ticket-Übersetzung" }
        ],
        staff: [
          { text: "Was ist die KI-Prognose für eine Sperrung von Tor C?", label: "Tor C Analyse" },
          { text: "Shuttle-Routen für den Abfluss optimieren.", label: "Shuttle-Optimierung" },
          { text: "Entwurf einer Durchsage für Müllüberlauf in Sektor 203.", label: "Entwurf Ankündigung" }
        ]
      };
    }
    if (lang === 'ar') {
      return {
        fan: [
          { text: "أين تقع الغرفة الحسية القريبة؟", label: "الغرفة الحسية" },
          { text: "ما هو أسرع مسار للقطاع 103 من البوابة B؟", label: "توجيه المسار" },
          { text: "ترجم 'أين تقع عيادة الإسعافات الأولية؟' إلى الفرنسية", label: "ترجمة فرنسية" },
          { text: "أين يمكنني إعادة تدوير الكوب الخاص بي؟", label: "تدوير بيئي" }
        ],
        volunteer: [
          { text: "أنتج ملخصاً لمباراة إسبانيا وألمانيا قبل اللعب.", label: "ملخص المباراة" },
          { text: "كيف أطلب مساعدة كرسي متحرك للبوابة D؟", label: "كرسي متحرك" },
          { text: "ترجم 'يرجى تجهيز الرمز الشريطي للتذكرة' إلى الإسبانية", label: "ترجمة التذاكر" }
        ],
        staff: [
          { text: "ما هي توقعات الذكاء الاصطناعي لإغلاق البوابة C؟", label: "تحليل البوابة C" },
          { text: "حسن مسارات الحافلات لتدفق خروج الجماهير.", label: "تحسين الحافلات" },
          { text: "صغ إعلاناً للموظفين حول امتلاء حاويات النفايات في القطاع 203.", label: "صياغة إعلان" }
        ]
      };
    }
    return {
      fan: [
        { text: "Where is the nearest sensory room?", label: "Sensory Room Access" },
        { text: "Fastest route to Section 103 from Gate B?", label: "Route Navigation" },
        { text: "Translate 'Where is the first aid station?' to French", label: "French Translation" },
        { text: "Where can I recycle my commemorative cup?", label: "Eco recycling" }
      ],
      volunteer: [
        { text: "Generate Spain vs Germany pre-match briefing.", label: "Match Briefing" },
        { text: "How do I request wheelchair assistance for Gate D?", label: "Wheelchair Request" },
        { text: "Translate 'Please have your ticket barcode ready' to Spanish", label: "Ticket Translation" }
      ],
      staff: [
        { text: "What is the AI prediction for Gate C lockout?", label: "Gate C Analysis" },
        { text: "Optimize shuttle routes for exit crowd flow.", label: "Shuttle Optimization" },
        { text: "Draft alert announcement for sector 203 trash overflow.", label: "Draft Staff Announcement" }
      ]
    };
  };

  const suggestions = getTranslatedSuggestions();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, typingThought]);

  // Handle Role change
  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  // Localized mock answers map (simulation mode)
  const getMockAnswer = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('sensory') || q.includes('حسية') || q.includes('sala sensorial')) {
      return {
        text: lang === 'ar' 
          ? 'تقع أقرب غرفة حسية في **مستوى الممر 1، بالقرب من القطاع 112**. إنها عازلة تماماً للصوت ومجهزة بوسائل دعم حسي.\n\nهل ترغب في تحديد القطاع 112 على الخريطة؟'
          : 'The nearest Sensory Room is located in **Concourse Level 1, near Section 112**. It is fully soundproofed and equipped with sensory items. \n\nWould you like me to highlight Section 112 on the stadium map?',
        thought: [
          'Accessing stadium floor accessibility database...',
          'Pinpointing user current sector...',
          'Finding closest designated quiet sensory zone...'
        ],
        action: { label: 'Highlight Map', tab: 'dashboard', sim: 'normal' }
      };
    }
    
    if (q.includes('route') || q.includes('section 103') || q.includes('مسار') || q.includes('قطاع 103') || q.includes('ruta')) {
      return {
        text: lang === 'ar'
          ? 'للوصول إلى **القطاع 103 من البوابة B**، امشِ مباشرة عبر بوابات فحص التذاكر، وانعطف يساراً إلى الممر الرئيسي متجاوزاً مناطق الخدمات ومنافذ بيع الأطعمة. يستغرق ذلك **3 دقائق مشياً** تقريباً.\n\n*ملاحظة: كثافة الجماهير في القطاع 103 طبيعية حالياً (45٪).*'
          : 'To get to **Section 103 from Gate B**, head straight through the Gate B ticketing scanners, turn left onto the Main Concourse, and walk past Concessions A-F. It is approximately a **3-minute walk**. \n\n*Note: Concourse crowd levels near Sector 103 are currently normal (45% capacity).*',
        thought: [
          'Checking current GPS navigation graph...',
          'Interpreting crowd levels in Sector 102 and Sector 103...'
        ],
        action: { label: 'Show Heatmap', tab: 'dashboard', sim: 'rush' }
      };
    }
    
    if (q.includes('first aid') || q.includes('french') || q.includes('secours') || q.includes('إسعافات') || q.includes('فرنسية')) {
      return {
        text: lang === 'ar'
          ? 'الترجمة إلى الفرنسية:\n**"Où se trouve le poste de premier secours ?"**\n\n*معلومات:* أقرب مركز طبي يقع عند القطاع 109. إذا كان هذا وضعاً طارئاً، يمكنني استدعاء فريق طبي عاجل فوراً.'
          : 'Translation into French: \n**"Où se trouve le poste de premier secours ?"**\n\n*General Info:* The nearest medical clinic is at Section 109. If this is an emergency, I can immediately dispatch a medical response team.',
        thought: [
          'Invoking multilingual translation module (ENG -> FRA)...',
          'Querying medical facility coordinates...'
        ],
        action: { label: 'Report Incident', tab: 'incidents', incident: { title: 'Medical Assist Request', sector: 'Sector 102', severity: 'critical', desc: 'Medical assist requested via translation portal.' } }
      };
    }
    
    if (q.includes('recycle') || q.includes('cup') || q.includes('تعديل') || q.includes('تدوير') || q.includes('reciclar')) {
      return {
        text: lang === 'ar'
          ? 'جميع الأكواب التذكارية لكأس العالم 2026 قابلة للتحلل وإعادة التدوير بنسبة **100٪**. \n\nيمكنك إلقاؤها في أي **حاوية بيئية خضراء عند مداخل القطاعات**.'
          : 'All commemorative cups at the FIFA World Cup 2026 are **100% biodegradable and recyclable**. \n\nYou can drop them off at any **Green Eco-Bin located in every Section entry point**.',
        thought: [
          'Accessing sustainability and waste protocols...',
          'Retrieving Eco-Bin locations...'
        ]
      };
    }

    if (q.includes('spain') || q.includes('briefing') || q.includes('إسبانيا') || q.includes('ملخص') || q.includes('españa')) {
      return {
        text: lang === 'ar'
          ? '### ملخص وردية مباراة إسبانيا وألمانيا\n- **التوقعات**: مباراة عالية الكثافة، التذاكر مباعة بالكامل (82,500 مشجع).\n- **الطقس**: صافٍ، 24 درجة مئوية.\n- **مناطق التركيز**: نتوقع كثافة عالية من مشجعي ألمانيا عند البوابة C.'
          : '### Spain vs Germany Shift Briefing\n- **Expectancy**: High intensity, Sold Out (82,500 fans).\n- **Weather**: Clear, 24°C.\n- **Focus Areas**: Gate C is anticipating heavy German fan clubs. Ensure multilingual support is active near gate C.',
        thought: [
          'Aggregating live tournament database for Spain vs Germany...',
          'Extracting weather, ticket sales, and gate flow predictions...'
        ]
      };
    }

    return {
      text: lang === 'ar'
        ? `أهلاً بك! كوني مساعد عمليات ArenaIQ، قمت بتحليل استفسارك: "${query}". يرجى سؤالي عن الغرف الحسية، أو النقل، أو الاتجاهات، أو إدارة المتطوعين لتزويدك ببيانات فورية.`
        : `Hello! As your ArenaIQ assistant, I processed: "${query}". You can query me about sensory rooms, transport, volunteer logs, or stadium routes to get immediate answers.`,
      thought: ['Evaluating general query intent...', 'Retrieving related stadium data...']
    };
  };

  // Google AI Studio Gemini API Fetcher
  const fetchGeminiResponse = async (userQuery) => {
    const systemInstruction = `You are ArenaIQ, the Generative AI assistant for stadium operations at the FIFA World Cup 2026, MetLife Stadium.
You are chatting with a user whose active role is: ${role}.
The active language is: ${lang}.
The active crowd simulation is: ${simulation}.

You can control the dashboard by embedding one of the following exact command tags in your response. Only output commands if the user explicitly asks for them or if they are highly relevant to resolving the issue:
- To set the styling theme: [COMMAND: SET_THEME classic] or [COMMAND: SET_THEME modern]
- To toggle crowd simulations: [COMMAND: SET_SIMULATION rush] or [COMMAND: SET_SIMULATION gateC] or [COMMAND: SET_SIMULATION normal] or [COMMAND: SET_SIMULATION exit]
- To empty/clear waste bins (b1 to b8, where b3 is Sector 103, b7 is Sector 203): [COMMAND: CLEAR_BIN b3]
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

  const handleSend = async (textToSend = null) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTypingThought(lang === 'ar' ? 'البحث عن الحلول الأمثل واسترجاع البيانات الجغرافية...' : 'Calculating optimal routes and querying geographic data...');

    try {
      if (geminiApiKey) {
        // Run Real Gemini API
        const rawResponse = await fetchGeminiResponse(queryText);
        setIsTyping(false);
        setTypingThought('');

        const cleanResponse = handleAIResponseCommand(rawResponse);
        
        const thoughts = [
          'Sending telemetry context payload to Gemini API...',
          'Real-time parsing of systemInstruction attributes...',
          'Evaluating output for COMMAND triggers...',
          'Rendering structured text layout...'
        ];

        const aiMsg = {
          id: `msg-${Date.now()}-ai`,
          sender: 'ai',
          content: cleanResponse,
          thought: thoughts,
          action: null
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Fallback simulation mode
        setTimeout(() => {
          const result = getMockAnswer(queryText);
          setIsTyping(false);
          setTypingThought('');

          const cleanResponse = handleAIResponseCommand(result.text);

          const aiMsg = {
            id: `msg-${Date.now()}-ai`,
            sender: 'ai',
            content: cleanResponse,
            thought: result.thought,
            action: result.action
          };

          setMessages(prev => [...prev, aiMsg]);
        }, 1200);
      }
    } catch (err) {
      setIsTyping(false);
      setTypingThought('');
      addToast('Gemini API Error: Check API key validity.');
      
      const aiMsg = {
        id: `msg-${Date.now()}-err`,
        sender: 'ai',
        content: lang === 'ar'
          ? 'حدث خطأ أثناء الاتصال بـ Gemini API. يرجى التحقق من صحة مفتاح API الخاص بك في الإعدادات.'
          : 'Error querying Gemini API. Please review your API Key in the Sidebar Settings.',
        thought: ['Error resolving REST query...']
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const handleActionClick = (action) => {
    if (action.tab) {
      setActiveTab(action.tab);
    }
    if (action.sim) {
      setSimulation(action.sim);
    }
    if (action.incident) {
      addIncident(action.incident);
    }
    addToast(lang === 'ar' ? `تم تفعيل الإجراء الموصى به: ${action.label}` : `AI Action Executed: ${action.label}`);
  };

  return (
    <div className="chat-container">
      {/* Sidebar Roles */}
      <div className="chat-sidebar">
        <div>
          <h3 className="chat-sidebar-section-title">
            {lang === 'ar' ? 'اختر دور المستخدم للتفاعل' : 'Select User Context'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div 
              className={`persona-select-card ${role === 'fan' ? 'active' : ''}`}
              onClick={() => handleRoleChange('fan')}
            >
              <div className="persona-avatar">
                <i className="fa-solid fa-user-tag"></i>
              </div>
              <div className="persona-details">
                <h4>{lang === 'ar' ? 'مساعد المشجعين' : 'Fan Concierge'}</h4>
                <p>{lang === 'ar' ? 'التذاكر، الاتجاهات، والخدمات' : 'Ticketing, WC, and navigation'}</p>
              </div>
            </div>

            <div 
              className={`persona-select-card ${role === 'volunteer' ? 'active' : ''}`}
              onClick={() => handleRoleChange('volunteer')}
            >
              <div className="persona-avatar">
                <i className="fa-solid fa-hands-helping"></i>
              </div>
              <div className="persona-details">
                <h4>{lang === 'ar' ? 'مركز المتطوعين' : 'Volunteer Hub'}</h4>
                <p>{lang === 'ar' ? 'مهام الوردية والترجمة' : 'Shift briefs, translation assist'}</p>
              </div>
            </div>

            <div 
              className={`persona-select-card ${role === 'staff' ? 'active' : ''}`}
              onClick={() => handleRoleChange('staff')}
            >
              <div className="persona-avatar">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="persona-details">
                <h4>{lang === 'ar' ? 'موظف العمليات' : 'Venue Operator'}</h4>
                <p>{lang === 'ar' ? 'التحليلات والتنبؤ بالازدحام' : 'Ops telemetry & predictive logs'}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-globe" style={{ color: 'var(--color-pitch)' }}></i>
            <span>{lang === 'ar' ? 'يدعم الترجمة الفورية' : 'Multilingual translation active'}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="chat-window">
        {/* API Key Missing Info Banner */}
        {!geminiApiKey && (
          <div style={{ 
            backgroundColor: 'var(--color-warning-light)', 
            borderBottom: '1px solid var(--color-warning)', 
            padding: '10px 32px', 
            fontSize: '0.8rem',
            color: 'var(--color-warning)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-circle-info"></i>
            <span>
              {lang === 'ar' 
                ? 'وضع محاكاة المساعد نشط. أدخل مفتاح Google AI Studio API في إعدادات الشريط الجانبي لتفعيل الردود الفورية الحقيقية.'
                : 'Chatbot simulation active. Configure a Google AI Studio API Key in the Sidebar Settings to enable actual live Gemini responses!'}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages-area">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
              
              {/* AI Thought logs */}
              {msg.sender === 'ai' && msg.thought && (
                <details className="ai-thought-box">
                  <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-gears" style={{ fontSize: '0.8rem' }}></i>
                    <span>{t.thoughtProcess} ({msg.thought.length} steps)</span>
                  </summary>
                  <ul style={{ paddingLeft: '18px', paddingRight: '18px', marginTop: '6px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {msg.thought.map((tText, idx) => (
                      <li key={idx}>{tText}</li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="bubble-content">
                {msg.content.split('\n').map((line, idx) => {
                  let formatted = line;
                  const isBullet = line.startsWith('- ');
                  if (isBullet) formatted = line.substring(2);

                  const parts = formatted.split('**');
                  const renderedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: 'inherit', fontWeight: 'bold' }}>{part}</strong> : part);

                  if (line.startsWith('### ')) {
                    return <h4 key={idx} style={{ marginTop: '10px', marginBottom: '6px', fontWeight: 800, color: 'inherit' }}>{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('> ')) {
                    return <blockquote key={idx} style={{ borderLeft: '3px solid white', borderRight: '3px solid white', padding: '0 10px', fontStyle: 'italic', margin: '8px 0' }}>{line.replace('> ', '')}</blockquote>;
                  }

                  return (
                    <div key={idx} style={{ marginBottom: '6px' }}>
                      {isBullet && '• '}
                      {renderedLine}
                    </div>
                  );
                })}

                {/* Inline Action Buttons */}
                {msg.sender === 'ai' && msg.action && (
                  <div style={{ marginTop: '12px' }}>
                    <button 
                      className="btn-primary" 
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.75rem'
                      }}
                      onClick={() => handleActionClick(msg.action)}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i> {msg.action.label}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble ai">
              <div className="ai-thought-box">
                <div className="thought-header">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>{typingThought}</span>
                </div>
              </div>
              <div className="bubble-content" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          {/* Quick suggestions chips */}
          <div className="suggestions-row">
            {suggestions[role]?.map((s, idx) => (
              <div 
                key={idx} 
                className="suggestion-chip"
                onClick={() => handleSend(s.text)}
              >
                {s.label}
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="chat-input-wrapper">
            <input 
              type="text" 
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'ar' ? `اسأل المساعد الذكي كـ ${role}...` : `Ask the AI Concierge as a ${role}...`}
              disabled={isTyping}
            />
            <button type="submit" className="chat-send-btn" disabled={isTyping}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
