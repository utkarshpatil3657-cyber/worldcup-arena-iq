# WorldCup ArenaIQ - Stadium Operations & Fan Experience SaaS

**ArenaIQ** is a premium stadium operations command center and fan concierge dashboard designed for the **FIFA World Cup 2026** at MetLife Stadium. Built with React and styled with clean, high-performance CSS, it integrates generative AI intelligence to support stadium coordinators, volunteers, and fans in real time.

---

## 🌟 Key Features

1. **Multilingual Localization & RTL (Arabic) Support**
   - Fully localized UI strings supporting **English**, **Spanish (Español)**, **French (Français)**, **German (Deutsch)**, and **Arabic (العربية)**.
   - Dynamic direction layout mirroring: selecting Arabic automatically transitions the layout to **Right-to-Left (RTL)** mode, mirroring the sidebar, toast notifications, drawers, and chat bubbles for local compatibility.

2. **Dynamic "Classic" Theme Selector**
   - Customize dashboard styling on-the-fly. Switch between **Modern (Pitch Green)** and **Classic (Royal Blue & Athletic Gold)** themes.
   - Smooth global fade transitions applied to backgrounds and borders for a premium user experience.

3. **Google AI Studio Gemini Chatbot Integration**
   - Connect the chatbot systems to the official Google Gemini API (model `gemini-2.5-flash`) by configuring an API Key securely in the Settings panel (persisted locally via `localStorage`).
   - Chatbots suggest contextual operations queries based on active page tabs.

4. **Agentic Action Parsing Command Center**
   - Gemini responses are parsed by a central command loop to execute real-time operations on the dashboard.
   - The model can invoke commands by embedding structured tags:
     - Clear/empty trash bins: `[COMMAND: CLEAR_BIN b3]` (empties Sector 103 bin to 10%)
     - Change dashboard theme: `[COMMAND: SET_THEME classic]`
     - Trigger simulations: `[COMMAND: SET_SIMULATION rush]`
     - Dispatch new incidents: `[COMMAND: REPORT_INCIDENT title="Spill" sector="S102" severity="warning" desc="Liquid spill"]`

5. **Interactive Stadium Crowd Heatmap & Drawer**
   - Clicking on sector blocks in the stadium SVG map slides open a **Sector Details Drawer**.
   - Displays live sector crowd density, active incidents, and quick dispatch options (e.g. *Deploy Bypass Gate*, *Reroute Traffic*, *Increase Patrol*) to resolve crowds interactively.

---

## 📊 System Architecture & Flowchart

The following diagram illustrates how user actions, settings, the interactive map, and the Gemini API coordinate through the central state loop:

```mermaid
graph TD
  User((Venue Operator / Fan)) -->|Configures settings| Sidebar[Sidebar Settings]
  User -->|Clicks sectors| StadiumSVG[Stadium crowd SVG Map]
  User -->|Chats| Chatbot[Floating Chatbot / AI Concierge]

  Sidebar -->|Toggle Theme| ThemeState[Theme State: Modern/Classic]
  Sidebar -->|Toggle Language| LangState[Language State: EN/ES/FR/DE/AR]
  Sidebar -->|Provide Key| APIKeyState[Gemini API Key: localStorage]

  ThemeState -->|DOM data-theme| CSS[CSS Styling Variables]
  LangState -->|DOM dir="rtl"| RTLMirror[Arabic Layout Mirroring]
  LangState -->|Translate UI| TransUtils[translations.js Module]

  StadiumSVG -->|Triggers Click| SectorDrawer[Sector details drawer]
  SectorDrawer -->|Deploy actions| StateUpdate[Update Crowd density & active incidents]

  Chatbot -->|Query text| APIKeyCheck{API Key set?}
  APIKeyCheck -->|Yes| GeminiAPI[Google Gemini API v1beta]
  APIKeyCheck -->|No| SimulatedAnswers[Local mock answers]

  GeminiAPI -->|Response text + Commands| CommandParser[Central Command Parser in App.jsx]
  SimulatedAnswers -->|Response text| CommandParser

  CommandParser -->|Parse & execute commands| ActionExecutor[State changes: Clear Bins / Reports / Theme]
  CommandParser -->|Clean response text| ChatUI[Display chat speech bubble]
```

---

## 🛠️ Local Setup and Installation

### Prerequisites
Make sure you have Node.js (version 18 or later) installed on your system.

### Steps to Run
1. Clone the repository and navigate to the project directory:
   ```bash
   cd Project1
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local port in your browser (default: `http://localhost:5173/`).

---

## 🔑 AI Studio Key Setup

To activate real Gemini responses:
1. Obtain an API Key from [Google AI Studio](https://aistudio.google.com/).
2. In the ArenaIQ sidebar settings, locate the **Google AI Studio Key** field.
3. Paste your key. You can toggle the eye icon to verify or mask it.
4. Open the Floating Chatbot or the AI Concierge tab. The yellow "simulation fallback" alert will disappear, and you can chat with the real Gemini model!

---

## 🚀 CI/CD GitHub Actions Workflow

A GitHub Actions workflow is configured in `.github/workflows/ci.yml`. On every push and pull request, the continuous integration script:
- Provisions an environment with Node.js.
- Installs production dependencies via `npm ci`.
- Runs the Oxlint static code analyzer using `npm run lint`.
- Compiles the production-ready assets using `npm run build`.
