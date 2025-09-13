from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import sys

# Add the backend directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

# Import agents after setting up path
try:
    from app.agents.business_agent import BusinessIntelligenceAgent
    from app.agents.dashboard_agent import DashboardExplanationAgent
    AGENTS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import agents: {e}")
    AGENTS_AVAILABLE = False

app = FastAPI(
    title="LOreAi Backend API",
    description="AI-powered comment analytics backend with LangChain agents",
    version="1.0.0"
)

# CORS middleware - Allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "LOreAi Backend API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LOreAi Backend"}

@app.get("/test")
async def test_endpoint():
    return {
        "message": "Backend is working!",
        "python_version": "3.9.18",
        "status": "deployed"
    }

# Initialize agents if available
if AGENTS_AVAILABLE:
    try:
        business_agent = BusinessIntelligenceAgent()
        dashboard_agent = DashboardExplanationAgent()
        print("AI Agents initialized successfully!")
    except Exception as e:
        print(f"Error initializing agents: {e}")
        AGENTS_AVAILABLE = False

# Real AI Chat endpoints using actual agents
@app.post("/api/chat/dashboard")
async def dashboard_chat(request: dict):
    if not AGENTS_AVAILABLE:
        return {
            "response": "AI agents are not available. Please check backend configuration.",
            "status": "error"
        }
    
    try:
        query = request.get("query", "")
        if not query:
            return {"response": "Please provide a query.", "status": "error"}
        
        response = dashboard_agent.process_query(query)
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        return {
            "response": f"Error processing dashboard query: {str(e)}",
            "status": "error"
        }

@app.post("/api/chat/business")
async def business_chat(request: dict):
    if not AGENTS_AVAILABLE:
        return {
            "response": "AI agents are not available. Please check backend configuration.",
            "status": "error"
        }
    
    try:
        query = request.get("query", "")
        if not query:
            return {"response": "Please provide a query.", "status": "error"}
        
        response = business_agent.process_query(query)
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        return {
            "response": f"Error processing business query: {str(e)}",
            "status": "error"
        }

@app.post("/api/chat/general")
async def general_chat(request: dict):
    if not AGENTS_AVAILABLE:
        return {
            "response": "AI agents are not available. Please check backend configuration.",
            "status": "error"
        }
    
    try:
        query = request.get("query", "")
        if not query:
            return {"response": "Please provide a query.", "status": "error"}
        
        # Use business agent for general queries
        response = business_agent.process_query(query)
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        return {
            "response": f"Error processing general query: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
