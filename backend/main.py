import os
import asyncio
import json
import random
import time
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# AIGIS Core Drivers
from backend.drivers.mavlink_driver import MAVLinkDriver

app = FastAPI(title="AIGIS UAV Backend - Tactical Command & Control")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIGISystemHAL:
    """
    Tactical Hardware Abstraction Layer.
    Orchestrates between Real Hardware (MAVLink) and AI Simulation.
    """
    def __init__(self):
        self.simulation_mode = True
        self.hw_driver = MAVLinkDriver(connection_string=os.environ.get("DRONE_PORT"))
        self.sim_pos = {"x": 0, "y": 5, "z": 0}
        self.battery = 100.0
        self.status = "IDLE"
        self.targets = [
            {"id": 1, "x": 12, "y": 0, "z": 8, "type": "CIVILIAN", "detected": False, "priority": "HIGH"},
            {"id": 2, "x": -18, "y": 0, "z": -12, "type": "HAZARD", "detected": False, "priority": "CRITICAL"},
            {"id": 3, "x": 5, "y": 0, "z": -25, "type": "STRUCTURE", "detected": False, "priority": "MEDIUM"}
        ]
        self.start_time = time.time()
        self.last_ai_msg = "SYSTEM INITIALIZED: STANDBY"

    async def initialize(self):
        # Professional Cold Boot Sequence
        print("[AIGIS] Initializing AI Systems...")
        if os.environ.get("AUTO_CONNECT_HW") == "1":
            success = self.hw_driver.connect()
            if success:
                self.simulation_mode = False
                self.last_ai_msg = "HARDWARE LINK ESTABLISHED (MAVLINK)"
            else:
                self.last_ai_msg = "HARDWARE NOT DETECTED - FALLING BACK TO AI SIMULATION"

    def update(self):
        if self.simulation_mode:
            self._update_sim()
        else:
            self._sync_hardware()

    def _sync_hardware(self):
        hw_telemetry = self.hw_driver.get_data()
        # Map MAVLink coordinates to AIGIS Radar view (X, Y, Z translation)
        self.sim_pos["x"] = (hw_telemetry['lng'] - 0) * 100000  # Offset-based scaling
        self.sim_pos["z"] = (hw_telemetry['lat'] - 0) * 100000
        self.sim_pos["y"] = hw_telemetry['alt']
        self.battery = hw_telemetry['battery_remaining']
        self.status = hw_telemetry['mode']

    def _update_sim(self):
        if self.status in ["FLYING", "RETURNING"]:
            self.sim_pos["x"] += random.uniform(-0.15, 0.15)
            self.sim_pos["z"] += random.uniform(-0.15, 0.15)
            self.sim_pos["y"] = 120 + random.uniform(-1, 1)
            self.battery -= 0.012
        else:
            self.sim_pos["y"] = 5 + (0.3 * (random.random() - 0.5))
            self.battery -= 0.001
        
        # AI Detection Loop
        for target in self.targets:
            dist = ((self.sim_pos["x"] - target["x"])**2 + (self.sim_pos["z"] - target["z"])**2)**0.5
            if dist < 12 and not target["detected"]:
                target["detected"] = True
                self.last_ai_msg = f"GEMINI_3: Detected {target['type']} at {target['priority']} alert level."

    def get_telemetry(self):
        return {
            "position": self.sim_pos,
            "status": {
                "battery": round(self.battery, 2),
                "state": self.status,
                "ai_alert": self.last_ai_msg,
                "mission_time": round(time.time() - self.start_time, 0),
                "hardware_link": not self.simulation_mode
            },
            "targets": self.targets
        }

hal = AIGISystemHAL()

@app.on_event("startup")
async def startup_event():
    await hal.initialize()

@app.get("/")
async def read_index():
    return FileResponse("index.html")

@app.get("/app")
async def read_app():
    return FileResponse("aigis-uav-system/dist/index.html")

if os.path.exists("aigis-uav-system/dist"):
    app.mount("/static", StaticFiles(directory="aigis-uav-system/dist"), name="static")

@app.get("/api/status")
async def get_status():
    return hal.get_telemetry()

@app.post("/api/command/{cmd}")
async def send_command(cmd: str):
    if not hal.simulation_mode:
        hal.hw_driver.send_command(cmd)
    
    # Still update HAL state for tracking
    if cmd == "takeoff": hal.status = "FLYING"
    elif cmd == "land": hal.status = "LANDED"
    elif cmd == "rtl": hal.status = "RETURNING"
    
    return {"status": "dispatched", "target": "hardware" if not hal.simulation_mode else "simulator"}

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            hal.update()
            await websocket.send_json(hal.get_telemetry())
            await asyncio.sleep(0.1) 
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
