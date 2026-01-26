# Objetivo:
Este projeto teve como objetivo o desenvolvimento de um sistema de radar para monitoramento, rastreamento e controle de drones de resgate utilizando o Gemini 3 Flash no Google AntiGravity 
para um hackathon de IA e vibecoding com foco em Gemini 3.

# Funcionalidades:

O sistema é uma central de comando e controle (C2) para drones de busca e resgate, que utiliza a velocidade do Gemini 3 Flash para processar trajetórias complexas e análise de sensores em tempo real.

1. Visualização Tática 3D (Core Engine)
Projeção de Trajetória em Tempo Real: Utiliza um motor gráfico customizado via Canvas API para projetar coordenadas 3D (X, Y, Z) em uma visão tática de perspectiva.
Flight Path History (Rastro de Voo): Renderização de um rastro luminoso que permite aos operadores visualizar todo o caminho percorrido pelo drone durante a missão.
Simulação de Altitude Dinâmica: O drone opera em diferentes níveis de altura, com linhas de projeção ortogonais e sombras dinâmicas no solo para percepção espacial precisa.

2. Sistema de Radar e Detecção de Alvos
Dual-View Mode: Interface dividida entre uma visão 3D ampla e um mini-radar 2D no estilo circular clássico para varredura de proximidade.
Detecção de Assinaturas Térmicas: Simulação de sensores de infravermelho que identificam alvos (Civis e Heatsigs) durante a varredura circular.
Scanner Sweep: Efeito visual de varredura que atualiza a posição dos objetos detectados conforme a frequência da antena do UAV.

3. Integração com Gemini 3 Flash
AI Intelligence Feed: Um console dedicado que exibe o processamento contínuo da IA Gemini 3 Flash.
Otimização de Rota: Mensagens de log que simulam a IA recalculando trajetórias para evitar obstáculos e economizar energia.
Análise de Sensores: O Gemini atua como um co-piloto, identificando anomalias térmicas e sugerindo padrões de busca em setores específicos.
4. Painel de Telemetria e Controle
Monitoramento de Status: Exibição em tempo real de bateria (com consumo simulado), altitude (m), velocidade (km/h) e coordenadas geográficas.
Interface de Comando: Botões interativos para execução de protocolos críticos:
Area Scan: Varredura profunda de setor.
3D Mapping: Geração de nuvem de pontos do terreno.
Emergency RTL: Protocolo de "Return to Launch" para retorno seguro à base.
5. Design e Experiência do Usuário (UX/UI)
Estética Cyber-Militar: Interface em modo escuro com alto contraste em Ciano (Primary High-Tech).
Efeito CRT/Monitor Tático: Filtros visuais que simulam monitores de campo antigos para maior imersão.
Glassmorphism HUD: Painéis translúcidos com desfoque de fundo, garantindo que a telemetria não obstrua a visão 3D principal.
6. Arquitetura Técnica (Performance)
Zero-Dependency Core: Construído inteiramente em Vanilla JavaScript e HTML5 Canvas, garantindo que o sistema funcione em qualquer dispositivo (mobile/desktop) com latência próxima de zero, ideal para situações de resgate reais.


https://github.com/user-attachments/assets/39d6f367-b3e8-4ee2-b022-532f9bb5a5ca


