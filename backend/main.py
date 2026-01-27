import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import asyncio
import json
import random
import time
from typing import List

app = FastAPI(title="AIGIS UAV Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DroneSimulator:
    def __init__(self):
        self.x = 0
        self.y = 5
        self.z = 0
        self.battery = 100.0
        self.signal = -45
        self.velocity = 0.0
        self.status = "IDLE"
        self.targets = [
            {"id": 1, "x": 12, "y": 0, "z": 8, "type": "CIVILIAN", "detected": False, "priority": "HIGH"},
            {"id": 2, "x": -18, "y": 0, "z": -12, "type": "HAZARD", "detected": False, "priority": "CRITICAL"},
            {"id": 3, "x": 5, "y": 0, "z": -25, "type": "STRUCTURE", "detected": False, "priority": "MEDIUM"},
            {"id": 4, "x": -30, "y": 0, "z": 15, "type": "CIVILIAN", "detected": False, "priority": "HIGH"}
        ]
        self.start_time = time.time()
        self.last_ai_msg = ""

    def update(self):
        # Basic flight dynamics simulation
        if self.status in ["FLYING", "RETURNING"]:
            self.x += random.uniform(-0.15, 0.15)
            self.z += random.uniform(-0.15, 0.15)
            self.y = 120 + random.uniform(-1, 1)
            self.battery -= 0.012
            self.velocity = 18.5 + random.uniform(-1, 1)
        elif self.status == "EMERGENCY":
            self.y -= 0.5
            self.y = max(5, self.y)
            self.battery -= 0.05
        else:
            self.y = 5 + (0.3 * (random.random() - 0.5))
            self.velocity = 0.0
            self.battery -= 0.001

        self.signal = -45 + random.randint(-8, 8)
        self.battery = max(0, self.battery)

        # AI Detection simulation
        for target in self.targets:
            dist = ((self.x - target["x"])**2 + (self.z - target["z"])**2)**0.5
            if dist < 12 and not target["detected"]:
                target["detected"] = True
                self.last_ai_msg = f"GEMINI_3: Detected {target['priority']} priority {target['type']} at sector {random.choice(['A','B','C'])}{random.randint(1,9)}"

    def get_telemetry(self):
        return {
            "position": {"x": self.x, "y": self.y, "z": self.z},
            "status": {
                "battery": round(self.battery, 2),
                "signal": self.signal,
                "velocity": round(self.velocity, 2),
                "mission_time": round(time.time() - self.start_time, 0),
                "state": self.status,
                "ai_alert": self.last_ai_msg
            },
            "targets": self.targets
        }

drone = DroneSimulator()

# Serve static files from the root build
# We'll serve the main index.html at root
@app.get("/")
async def read_index():
    return FileResponse("index.html")

# Serve the legacy radar and other root assets
@app.get("/radar-standalone.html")
async def read_legacy():
    return FileResponse("radar-standalone.html")

# Mount the static directory for the React build
if os.path.exists("aigis-uav-system/dist"):
    app.mount("/static", StaticFiles(directory="aigis-uav-system/dist"), name="static")

@app.get("/app")
async def read_app():
    return FileResponse("aigis-uav-system/dist/index.html")

@app.get("/api/status")
async def get_status():
    return drone.get_telemetry()

@app.post("/api/command/{cmd}")
async def send_command(cmd: str):
    if cmd == "takeoff": drone.status = "FLYING"
    elif cmd == "land": drone.status = "LANDED"
    elif cmd == "rtl": drone.status = "RETURNING"
    elif cmd == "emergency": drone.status = "EMERGENCY"
    return {"status": "success", "command": cmd, "drone_state": drone.status}

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            drone.update()
            await websocket.send_json(drone.get_telemetry())
            await asyncio.sleep(0.1) # 10Hz
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
