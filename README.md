# AIGIS - Sistema Tático de Monitoramento UAV

AIGIS é uma plataforma profissional de comando e controle para drones de resgate, integrando telemetria em tempo real, inteligência artificial tática e visualização 3D avançada.

## 🚀 Funcionalidades Nova Geração

- **Painel Tático 3D**: Renderização de terreno procedural e rastreamento de UAV com Three.js.
- **HUD Holográfico**: Interface inspirada em sistemas militares com telemetria detalhada (Altitude, Velocidade, Posição).
- **IA Gemini 3 Flash**: Lógica de detecção automática de alvos e análise térmica (simulada).
- **Backend Real-time**: Servidor FastAPI com comunicação via WebSockets para latência zero.
- **Protocolos de Emergência**: Comandos de RTL (Return to Launch) e pouso de emergência com um clique.

## 🛠️ Stack Tecnológica

- **Frontend**: React 19, Three.js, @react-three/fiber, Lucide React.
- **Backend**: Python 3.13, FastAPI, WebSockets.
- **Design**: Glassmorphism, Estética CRT/Cyberpunk.

## 🏁 Como Executar

### 1. Iniciar o Servidor de Telemetria (Backend)
```bash
cd backend
pip install fastapi uvicorn websockets
python main.py
```

### 2. Iniciar a Central de Comando (Frontend)
```bash
cd aigis-uav-system
npm install --legacy-peer-deps
npm run dev
```

## 📡 Arquitetura de Comunicação
O sistema utiliza um loop de 10Hz no backend para simular a dinâmica de voo e detecção de alvos, enviando pacotes JSON via WebSocket para o frontend React, garantindo que o radar esteja sempre sincronizado com o drone.

---
**Desenvolvido para Missões Críticas e Operações de Resgate.**
