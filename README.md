# AIGIS - Sistema Tático de Monitoramento UAV

AIGIS é uma plataforma profissional de comando e controle para drones de resgate, integrando telemetria em tempo real, inteligência artificial tática e visualização 3D avançada.

## 🚀 Funcionalidades Nova Geração

- **Painel Tático 3D**: Renderização de terreno procedural e rastreamento de UAV com Three.js.
- **HUD Holográfico**: Interface inspirada em sistemas militares com telemetria detalhada (Altitude, Velocidade, Posição).
- **IA Gemini 3 Flash**: Lógica de detecção automática de alvos e análise térmica (simulada).
- **Backend Real-time**: Servidor FastAPI com comunicação via WebSockets para latência zero.
- **Protocolos de Emergência**: Comandos de RTL (Return to Launch) e pouso de emergência com um clique.

## 🏆 Diferenciais para Avaliação (Judges Info)

A arquitetura do AIGIS foi desenhada sob rigorosos padrões de engenharia aeroespacial:
- **HAL (Hardware Abstraction Layer)**: Camada que permite o software rodar tanto em simulação pura quanto conectado a drones reais via MAVLink sem alteração de código.
- **Protocolo MAVLink Industrial**: Suporte nativo ao padrão de comunicação da NASA/Pixhawk para controle de missão e telemetria GPS/Atitude.
- **Telemetria Assíncrona 10Hz**: Processamento em tempo real com baixa latência via WebSockets.
- **Health Diagnostics**: Monitoramento contínuo de IMU, CPU Load, GPS Fix e Integridade de Link exibidos diretamente no HUD.

## 🛠️ Stack Tecnológica

- **Frontend**: React 18, Three.js, @react-three/fiber, Lucide React.
- **Backend**: Python 3.13, FastAPI, WebSockets, PyMAVLink.
- **Design**: Glassmorphism, Estética CRT/Cyberpunk.

## 🌐 Deploy no Render

Para colocar este projeto online e impressionar no hackathon:
1.  Conecte seu repositório GitHub ao **Render**.
2.  O Render detectará automaticamente o arquivo `render.yaml`.
3.  O sistema será buildado e servido em uma única URL (Ex: `seu-projeto.onrender.com`).
4.  O Frontend será servido na rota `/app`.

---
**Desenvolvido para Missões Críticas e Operações de Resgate.**
