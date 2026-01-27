# AIGIS // Tactical 3D Trajectory & Radar System
### Google Gemini 3 Hackathon Submission

AIGIS is a professional-grade UAV (Unmanned Aerial Vehicle) monitoring and control system designed for high-stakes search and rescue missions. It integrates real-time telemetry, 3D tactical visualization, and Google's Gemini 3 (AI) reasoning to provide mission commanders with unparalleled situational awareness.

## 🚀 Key Features

- **Gemini 3 Flash Tactical Reasoning**: Real-time mission analysis using Gemini 3 Flash. The AI evaluates telemetry data and provides tactical insights (e.g., thermal signature validation, power management alerts).
- **Hifi 3D Radar Scene**: A full 3D environment built with Three.js (React-Three-Fiber) featuring procedural terrain, drone flight trails, and tactical target marking.
- **Dual-Mode Backend**: Supports both **Simulation Mode** (for demonstrations) and **MAVLink Hardware Sync** (for real drone integration via Serial/Network).
- **Aerospace Grade UI**: A premium HUD (Heads-Up Display) with CRT effects, glassmorphism, and MIL-SPEC telemetry visualizations.
- **Scenario Injects**: Interactive scenario buttons to demonstrate AI behavior under rescue or emergency conditions.

## 🛠️ Tech Stack

- **Frontend**: React, Three.js (@react-three/fiber, @react-three/drei), Vite, Lucide React.
- **Backend**: Python, FastAPI, WebSockets, MAVLink (PyMavlink).
- **AI Engine**: Google Gemini 3 Flash API.

## 🚦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google API Key (for Gemini reasoning)

### Installation

1. **Clone and Setup Backend**
```bash
pip install -r backend/requirements.txt
set GOOGLE_API_KEY=your_key_here
python backend/main.py
```

2. **Frontend Setup**
```bash
cd aigis-uav-system
npm install
npm run dev
```

## 🧠 AI Insight Examples
- *"GEMINI-3 FLASH ⚡ // THINKING: Humanoid heat signature detected. Probability 98%. Flagging Sector 2 as 'STABLE RESCUE'."*
- *"GEMINI-3 FLASH ⚡ // ALERT: CRITICAL POWER DEPLETION. PROTOCOL 412: EMERGENCY DESCENT INITIATED."*

## 📜 Achievements Summary 
Successfully developed **AIGIS**, an advanced AI-UAV Tactical Command System. 
- Integrated **Google Gemini 3** for real-time mission reasoning.
- Developed a high-performance **3D Radar Engine** using Three.js.
- Implemented a robust **WebSocket-based Telemetry Link** for sub-100ms latency.
- Created a **Military-grade HUD** for aerospace-level situational awareness.

---
**Raciocínio Tático Gemini 3 : Análise de missão em tempo real usando o Gemini 3 Flash. A IA avalia dados de telemetria e fornece informações táticas (por exemplo, validação de assinatura térmica, alertas de gerenciamento de energia).**

**Desenvolvido para Missões Críticas e Operações de Resgate.**

<img width="1024" height="768" alt="image" src="https://github.com/user-attachments/assets/ac9be685-e2a6-430d-af0e-b6d17eb69706" />

*Developed for Google DeepMind Gemini 3 Hackathon.*

