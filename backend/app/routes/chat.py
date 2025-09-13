from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.agents.business_agent import BusinessIntelligenceAgent
from app.agents.dashboard_agent import DashboardExplanationAgent

router = APIRouter()

# Initialize agents
business_agent = BusinessIntelligenceAgent()
dashboard_agent = DashboardExplanationAgent()

class ChatRequest(BaseModel):
    query: str
    agent_type: str = "general"  # business, dashboard, general
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    agent_type: str
    context_used: bool

@router.post("/business")
async def chat_business(request: ChatRequest):
    """Get business insights and marketing recommendations"""
    try:
        response = business_agent.process_query(request.query, request.context)
        return ChatResponse(
            response=response,
            agent_type="business",
            context_used=request.context is not None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dashboard")
async def chat_dashboard(request: ChatRequest):
    """Get explanations about dashboard components"""
    try:
        response = dashboard_agent.process_query(request.query, request.context)
        return ChatResponse(
            response=response,
            agent_type="dashboard",
            context_used=request.context is not None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/general")
async def chat_general(request: ChatRequest):
    """General conversation with AI assistant"""
    try:
        # Route to appropriate agent based on query content
        if any(keyword in request.query.lower() for keyword in ['business', 'marketing', 'strategy', 'insights', 'trends']):
            response = business_agent.process_query(request.query, request.context)
            agent_type = "business"
        elif any(keyword in request.query.lower() for keyword in ['dashboard', 'chart', 'metric', 'data', 'explain', 'how', 'what']):
            response = dashboard_agent.process_query(request.query, request.context)
            agent_type = "dashboard"
        else:
            # Default to business agent for general queries
            response = business_agent.process_query(request.query, request.context)
            agent_type = "business"
        
        return ChatResponse(
            response=response,
            agent_type=agent_type,
            context_used=request.context is not None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contextual")
async def chat_contextual(request: ChatRequest):
    """AI response with current dashboard data context"""
    try:
        # Determine best agent based on context and query
        if request.context and "dashboard_state" in request.context:
            response = dashboard_agent.process_query(request.query, request.context)
            agent_type = "dashboard"
        else:
            response = business_agent.process_query(request.query, request.context)
            agent_type = "business"
        
        return ChatResponse(
            response=response,
            agent_type=agent_type,
            context_used=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents/status")
async def get_agents_status():
    """Get status of AI agents"""
    return {
        "business_agent": "active",
        "dashboard_agent": "active",
        "total_conversations": len(business_agent.get_conversation_history()) + len(dashboard_agent.get_conversation_history())
    }

@router.post("/agents/clear-memory")
async def clear_agents_memory():
    """Clear conversation memory for all agents"""
    business_agent.clear_memory()
    dashboard_agent.clear_memory()
    return {"message": "Memory cleared for all agents"}

@router.post("/analyze-engagement")
async def analyze_engagement_claim(request: ChatRequest):
    """Analyze user's engagement claims against real data benchmarks"""
    try:
        response = business_agent.analyze_user_engagement_claim(request.query, request.context)
        return ChatResponse(
            response=response,
            agent_type="business",
            context_used=request.context is not None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/benchmarks")
async def get_benchmarks():
    """Get all benchmark data for comparison"""
    try:
        benchmarks = business_agent.knowledge_base.get_benchmark_data()
        return {"benchmarks": benchmarks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
