from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
import time
from typing import List

app = FastAPI(title="AIGIS UAV Backend")

# CORS configuration for frontend communication
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
            {"id": 1, "x": 10, "y": 0, "z": 10, "type": "CIVILIAN", "detected": False},
            {"id": 2, "x": -15, "y": 0, "z": -5, "type": "HAZARD", "detected": False},
            {"id": 3, "x": 5, "y": 0, "z": -20, "type": "STRUCTURE", "detected": False}
        ]
        self.start_time = time.time()

    def update(self):
        # Basic flight dynamics simulation
        if self.status == "FLYING":
            self.x += random.uniform(-0.1, 0.1)
            self.z += random.uniform(-0.1, 0.1)
            self.y = 120 + random.uniform(-1, 1)
            self.battery -= 0.01
            self.velocity = 15.5 + random.uniform(-0.5, 0.5)
        else:
            self.y = 5 + (0.2 * (random.random() - 0.5))
            self.velocity = 0.0
            self.battery -= 0.001

        self.signal = -45 + random.randint(-5, 5)

        # AI Detection simulation
        for target in self.targets:
            dist = ((self.x - target["x"])**2 + (self.z - target["z"])**2)**0.5
            if dist < 15:
                target["detected"] = True

    def get_telemetry(self):
        return {
            "position": {"x": self.x, "y": self.y, "z": self.z},
            "status": {
                "battery": round(self.battery, 2),
                "signal": self.signal,
                "velocity": round(self.velocity, 2),
                "mission_time": round(time.time() - self.start_time, 0),
                "state": self.status
            },
            "targets": self.targets
        }

drone = DroneSimulator()

@app.get("/")
async def root():
    return {"message": "AIGIS Tactical UAV Server Running"}

@app.get("/status")
async def get_status():
    return drone.get_telemetry()

@app.post("/command/{cmd}")
async def send_command(cmd: str):
    if cmd == "takeoff":
        drone.status = "FLYING"
    elif cmd == "land":
        drone.status = "LANDED"
    elif cmd == "rtl":
        drone.status = "RETURNING"
    elif cmd == "emergency":
        drone.status = "EMERGENCY"
    
    return {"status": "success", "command": cmd, "drone_state": drone.status}

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            drone.update()
            await websocket.send_json(drone.get_telemetry())
            await asyncio.sleep(0.1) # 10Hz telemetry
    except WebSocketDisconnect:
        print("Frontend disconnected from telemetry")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
