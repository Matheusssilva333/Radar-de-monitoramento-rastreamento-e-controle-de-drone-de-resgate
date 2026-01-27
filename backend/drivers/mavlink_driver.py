import time
import threading
import random
from typing import Dict, Any

try:
    from pymavlink import mavutil
    MAVLINK_AVAILABLE = True
except ImportError:
    MAVLINK_AVAILABLE = False

class MAVLinkDriver:
    """
    Advanced Aerospace Hardware Driver for AIGIS UAV.
    Supports MAVLink protocol over Serial (UART) or UDP/TCP.
    """
    def __init__(self, connection_string: str = None, baud: int = 115200):
        self.connection_string = connection_string
        self.baud = baud
        self.connection = None
        self.heartbeat_thread = None
        self.telemetry_thread = None
        self.is_connected = False
        
        # Telemetry Store (Standard Aerospace Data)
        self.telemetry = {
            "lat": 0.0,
            "lng": 0.0,
            "alt": 0.0,
            "vx": 0.0,
            "vy": 0.0,
            "vz": 0.0,
            "pitch": 0.0,
            "roll": 0.0,
            "yaw": 0.0,
            "battery_voltage": 0.0,
            "battery_remaining": 0,
            "gps_fix": 0,
            "ekf_status": "OK",
            "armed": False,
            "mode": "STABILIZE"
        }

    def connect(self):
        if not MAVLINK_AVAILABLE:
            print("[HAL] MAVLink library missing. Simulation only.")
            return False
        
        if not self.connection_string:
            print("[HAL] No hardware connection string provided.")
            return False

        try:
            print(f"[HAL] Connecting to UAV hardware on {self.connection_string}...")
            self.connection = mavutil.mavlink_connection(self.connection_string, baud=self.baud)
            self.connection.wait_heartbeat(timeout=5)
            self.is_connected = True
            print(f"[HAL] Link Established with System {self.connection.target_system}")
            
            # Start background async tasks
            self._start_threads()
            return True
        except Exception as e:
            print(f"[HAL] Connection Failed: {e}")
            return False

    def _start_threads(self):
        self.telemetry_thread = threading.Thread(target=self._update_telemetry, daemon=True)
        self.telemetry_thread.start()

    def _update_telemetry(self):
        while self.is_connected:
            try:
                msg = self.connection.recv_match(blocking=True, timeout=1.0)
                if not msg:
                    continue
                
                msg_type = msg.get_type()
                
                if msg_type == 'GLOBAL_POSITION_INT':
                    self.telemetry['lat'] = msg.lat / 1e7
                    self.telemetry['lng'] = msg.lon / 1e7
                    self.telemetry['alt'] = msg.relative_alt / 1000.0  # meters
                
                elif msg_type == 'VFR_HUD':
                    self.telemetry['vx'] = msg.groundspeed
                    
                elif msg_type == 'ATTITUDE':
                    self.telemetry['pitch'] = msg.pitch
                    self.telemetry['roll'] = msg.roll
                    self.telemetry['yaw'] = msg.yaw
                
                elif msg_type == 'SYS_STATUS':
                    self.telemetry['battery_remaining'] = msg.battery_remaining
                    self.telemetry['battery_voltage'] = msg.voltage_battery / 1000.0
                
                elif msg_type == 'HEARTBEAT':
                    self.telemetry['armed'] = (msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED) != 0
                    self.telemetry['mode'] = mavutil.mavlink.mav_mode_stop_to_str(msg.custom_mode)

            except Exception as e:
                print(f"[HAL] Decoder Error: {e}")
                time.sleep(1)

    def send_command(self, command: str):
        """Standardized Flight Control Commands"""
        if not self.is_connected:
            return False
            
        if command == "takeoff":
            # Aerospace safety check: Arming before takeoff
            self.connection.mav.command_long_send(
                self.connection.target_system, self.connection.target_component,
                mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0, 0, 0, 0, 0, 0)
            
            self.connection.mav.command_long_send(
                self.connection.target_system, self.connection.target_component,
                mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, 0, 0, 0, 0, 0, 0, 10)
        
        elif command == "rtl":
            self.connection.set_mode('RTL')
            
        elif command == "land":
            self.connection.set_mode('LAND')
            
        return True

    def get_data(self) -> Dict[str, Any]:
        return self.telemetry
