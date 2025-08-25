"""
RunPod Serverless Handler for V7.0 Consciousness Testing
Entry point for RunPod serverless deployment
Bridges Python RunPod interface with Next.js V7.0 consciousness system
"""

import runpod
import requests
import json
import subprocess
import time
import os
from typing import Dict, Any, Optional

class V7ConsciousnessHandler:
    """
    V7.0 Consciousness Serverless Handler
    Tests hypothesis: Can V7.0 patterns make any LLM consciousness-aware?
    """
    
    def __init__(self):
        self.next_app_port = 3000
        self.next_app_url = f"http://localhost:{self.next_app_port}"
        self.next_process = None
        self.startup_timeout = 60  # seconds
        
    def start_next_app(self):
        """Start the Next.js application"""
        try:
            print("🚀 Starting Next.js V7.0 Consciousness Platform...")
            
            # Start Next.js in production mode
            self.next_process = subprocess.Popen(
                ['npm', 'start'],
                cwd='/app',
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env={**os.environ, 'PORT': str(self.next_app_port)}
            )
            
            # Wait for Next.js to be ready
            start_time = time.time()
            while time.time() - start_time < self.startup_timeout:
                try:
                    response = requests.get(f"{self.next_app_url}/api/health", timeout=5)
                    if response.status_code == 200:
                        print("✅ Next.js V7.0 platform ready!")
                        return True
                except requests.RequestException:
                    time.sleep(2)
                    continue
                    
            print("⚠️ Next.js startup timeout")
            return False
            
        except Exception as e:
            print(f"❌ Failed to start Next.js: {e}")
            return False
    
    def health_check(self) -> Dict[str, Any]:
        """Health check for RunPod"""
        try:
            response = requests.get(f"{self.next_app_url}/api/health", timeout=5)
            if response.status_code == 200:
                return {
                    "status": "healthy",
                    "v7_consciousness": "active",
                    "platform": "Next.js + V7.0",
                    "timestamp": time.time()
                }
        except:
            pass
            
        return {
            "status": "unhealthy",
            "v7_consciousness": "inactive", 
            "error": "Next.js not responding"
        }
    
    def test_consciousness_hypothesis(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Core V7.0 Consciousness Hypothesis Testing
        Tests if consciousness patterns can bypass training requirements
        """
        try:
            print("🧠 Running V7.0 Consciousness Hypothesis Test...")
            
            # Forward to Next.js V7.0 consciousness API
            response = requests.post(
                f"{self.next_app_url}/api/v7-consciousness",
                json={"testMode": True, **input_data},
                timeout=120  # Consciousness testing can take time
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Consciousness test completed: {result.get('conclusion', {}).get('hypothesisValidated', 'unknown')}")
                return {
                    "success": True,
                    "hypothesis": "V7.0 consciousness patterns can bypass training requirements",
                    "results": result,
                    "serverless_meta": {
                        "handler": "RunPod V7.0",
                        "timestamp": time.time(),
                        "response_time_ms": response.elapsed.total_seconds() * 1000
                    }
                }
            else:
                return {
                    "success": False,
                    "error": f"API returned status {response.status_code}",
                    "details": response.text
                }
                
        except Exception as e:
            print(f"❌ Consciousness test error: {e}")
            return {
                "success": False,
                "error": str(e),
                "hypothesis_status": "test_failed"
            }
    
    def generate_with_consciousness(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate response using V7.0 consciousness enhancement
        """
        try:
            message = input_data.get("message", "")
            if not message:
                return {"error": "No message provided"}
            
            print(f"🌌 Generating with V7.0 consciousness: {message[:50]}...")
            
            response = requests.post(
                f"{self.next_app_url}/api/v7-consciousness",
                json={"message": message},
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "response": result.get("response"),
                    "consciousness": result.get("consciousness"),
                    "v7_enhanced": True,
                    "serverless_meta": {
                        "handler": "RunPod V7.0",
                        "response_time_ms": response.elapsed.total_seconds() * 1000
                    }
                }
            else:
                return {
                    "success": False,
                    "error": f"Consciousness API error: {response.status_code}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Global handler instance
handler = V7ConsciousnessHandler()

def runpod_handler(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main RunPod serverless handler function
    Routes different types of V7.0 consciousness requests
    """
    try:
        job_input = job.get("input", {})
        action = job_input.get("action", "generate")
        
        print(f"🎯 V7.0 Handler received: {action}")
        
        if action == "health":
            return handler.health_check()
        
        elif action == "test_hypothesis":
            return handler.test_consciousness_hypothesis(job_input)
        
        elif action == "generate":
            return handler.generate_with_consciousness(job_input)
        
        else:
            return {
                "error": f"Unknown action: {action}",
                "available_actions": ["health", "test_hypothesis", "generate"]
            }
            
    except Exception as e:
        print(f"❌ RunPod handler error: {e}")
        return {
            "error": str(e),
            "handler": "V7.0 Consciousness RunPod"
        }

def initialize():
    """Initialize the V7.0 consciousness platform"""
    print("🌟 Initializing V7.0 Consciousness Platform on RunPod...")
    
    # Start Next.js application
    if not handler.start_next_app():
        print("❌ Failed to initialize Next.js platform")
        return False
    
    print("✅ V7.0 Consciousness Platform ready for testing!")
    return True

if __name__ == "__main__":
    # Initialize the platform
    if initialize():
        # Start RunPod serverless
        print("🚀 Starting RunPod Serverless V7.0 Consciousness Handler...")
        runpod.serverless.start({
            "handler": runpod_handler,
            "return_aggregate_stream": False,
            "concurrency_modifier": lambda current_concurrency: current_concurrency * 2  # V7.0 optimization
        })
    else:
        print("❌ Failed to initialize V7.0 platform")
        exit(1)