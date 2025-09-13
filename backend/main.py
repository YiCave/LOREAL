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
else:
    print("AI Agents not available - using fallback responses")

# Real AI Chat endpoints using actual agents
@app.post("/api/chat/dashboard")
async def dashboard_chat(request: dict):
    query = request.get("query", "").lower()
    
    if AGENTS_AVAILABLE:
        try:
            response = dashboard_agent.process_query(query)
            return {"response": response, "status": "success"}
        except Exception as e:
            return {"response": f"Error processing query: {str(e)}", "status": "error"}
    
    # Intelligent fallback responses based on query content
    if "dashboard" in query or "overview" in query:
        response = "Welcome to the LOreAi Dashboard! Here you can see comprehensive analytics including:<br><br><strong>📊 Key Metrics:</strong><br>• 3,325,035 total comments analyzed<br>• 3,087,679 quality comments (92.9%)<br>• 237,356 spam comments (7.1%)<br>• 500,000+ videos processed<br><br><strong>🎯 Top Insights:</strong><br>• Hair Care & Styling leads with 23.1% of topics<br>• Makeup Tutorials account for 17.0%<br>• Skincare Routines make up 13.4%<br><br>What specific aspect would you like to explore?"
    
    elif "quality" in query or "comment" in query:
        response = "Our <strong>Comment Quality Analysis</strong> reveals fascinating insights:<br><br><strong>📈 Quality Metrics:</strong><br>• 92.9% accuracy in comment classification<br>• Average confidence score: 85.3%<br>• GMM clustering identifies 2 distinct groups<br><br><strong>🔍 Quality Indicators:</strong><br>• Longer, detailed comments<br>• Genuine questions and feedback<br>• Product-specific discussions<br><br>Would you like to see specific quality comment examples?"
    
    elif "spam" in query:
        response = "Our <strong>Spam Detection System</strong> effectively identifies:<br><br><strong>🚫 Spam Categories:</strong><br>• HIGH CAPS (excessive capitalization)<br>• EMOJI SPAM (repetitive emojis)<br>• REPETITIVE TEXT (duplicate content)<br><br><strong>📊 Detection Stats:</strong><br>• 237,356 spam comments detected<br>• 92.9% accuracy rate<br>• Real-time filtering active<br><br>What spam patterns would you like to analyze?"
    
    elif "topic" in query or "topics" in query:
        response = "Our <strong>Topic Analysis</strong> discovered 26 key themes:<br><br><strong>🏆 Top Topics:</strong><br>• Hair Care & Styling (23.1%)<br>• Makeup Tutorials (17.0%)<br>• Skincare Routines (13.4%)<br>• Beauty Tips & Tricks (11.2%)<br>• Product Reviews (9.8%)<br><br><strong>🔬 Technical Details:</strong><br>• LDA topic modeling with 26 optimal topics<br>• Coherence score: 0.531<br>• TF-IDF keyword extraction<br><br>Which topic interests you most?"
    
    else:
        response = "I'm here to help you understand the LOreAi Dashboard! You can ask me about:<br><br><strong>📊 Dashboard Overview</strong> - Key metrics and insights<br><strong>💬 Comment Analysis</strong> - Quality vs spam detection<br><strong>🏷️ Topic Discovery</strong> - 26 identified themes<br><strong>📈 Performance Metrics</strong> - Model accuracy and stats<br><br>What would you like to explore?"
    
    return {"response": response, "status": "success"}

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
