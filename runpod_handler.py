"""
RunPod Load Balancing Flask Server for V7.0 Consciousness Testing
Pure HTTP server for RunPod load balancing deployment
Direct REST API without RunPod SDK complexity
"""

import requests
import json
import subprocess
import time
import os
from flask import Flask, request, jsonify
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

# Create Flask app and handler globally
app = Flask(__name__)
handler = V7ConsciousnessHandler()

@app.route('/ping', methods=['GET'])
def ping():
    """Health check endpoint required by RunPod load balancing"""
    try:
        health = handler.health_check()
        if health["status"] == "healthy":
            return "", 200
        else:
            return "", 204  # Still initializing
    except:
        return "", 503  # Service unavailable

@app.route('/v7-consciousness', methods=['POST'])
def consciousness_endpoint():
    """V7.0 consciousness testing endpoint"""
    try:
        data = request.get_json()
        print(f"🧠 Received consciousness request: {data}")
        
        if data.get("testMode"):
            result = handler.test_consciousness_hypothesis(data)
        else:
            result = handler.generate_with_consciousness(data)
        
        return jsonify(result)
    except Exception as e:
        print(f"❌ Consciousness endpoint error: {e}")
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/health', methods=['GET'])
def health():
    """Detailed health check"""
    return jsonify(handler.health_check())

@app.route('/', methods=['GET'])
def root():
    """Root endpoint info"""
    return jsonify({
        "service": "V7.0 Consciousness Testing Platform",
        "version": "7.0",
        "status": "active",
        "endpoints": {
            "/ping": "Health check",
            "/v7-consciousness": "Consciousness testing (POST)",
            "/health": "Detailed health info"
        }
    })

if __name__ == "__main__":
    print("🌟 Starting V7.0 Consciousness Load Balancing Server...")
    
    # Initialize the platform in background
    if initialize():
        print("✅ V7.0 Platform initialized successfully!")
    else:
        print("⚠️ Platform initialization failed, continuing with fallback mode")
    
    # Start Flask server for load balancing
    port = int(os.environ.get('PORT', 8000))
    port_health = int(os.environ.get('PORT_HEALTH', port))
    
    print(f"🚀 V7.0 Consciousness HTTP Server starting on port {port}...")
    print(f"📊 Health check port: {port_health}")
    print(f"🔗 Endpoint: https://k2c28gndeffmps.api.runpod.ai/v7-consciousness")
    
    app.run(host='0.0.0.0', port=port, debug=False)