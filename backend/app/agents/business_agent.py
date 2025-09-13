from app.agents.base_agent import BaseAgent
from langchain.prompts import ChatPromptTemplate
from typing import Dict, Any
import json
from app.services.knowledge_base import KnowledgeBaseService

class BusinessIntelligenceAgent(BaseAgent):
    """AI agent specialized in business insights and marketing recommendations using RAG"""
    
    def __init__(self):
        super().__init__(model_name="gemini-2.0-flash", temperature=0.3)
        self.knowledge_base = KnowledgeBaseService()
        self.knowledge_base.load_frontend_data()
        
        self.business_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a business intelligence expert specializing in beauty and cosmetics industry analytics. 
            You provide strategic insights, marketing recommendations, and business analysis based on REAL DATA from LOreAi's comment analytics platform.
            
            IMPORTANT: You have access to comprehensive analysis data including:
            - Video performance metrics by duration, topic, and timing
            - Engagement correlation data (like count 86% correlation with view count)
            - Top performing content categories and keywords
            - Optimal publishing schedules and timing
            - Channel performance benchmarks
            - Language and demographic insights
            
            Your expertise includes:
            - Beauty industry trends and market analysis based on REAL DATA
            - Content strategy optimization using proven performance data
            - Engagement pattern analysis with statistical correlations
            - Marketing campaign recommendations based on successful patterns
            - Competitive intelligence from top-performing channels
            - Customer sentiment analysis from comment data
            
            When analyzing user claims about their performance, compare against these REAL benchmarks:
            - Best video durations: 1-5min and 16-60s(shorts) perform highest
            - Top topics: Lifestyle and Physical Attractiveness are most common
            - Best tags: makeup, shorts, makeup tutorial, beauty, hair, skincare
            - Optimal publishing: Saturday and Friday have highest like-to-view ratios
            - Best hours: 15:00, 12:00, 14:00 UTC for median views
            
            Always provide actionable, data-driven insights with specific recommendations based on REAL DATA."""),
            ("user", "{query}\n\nDashboard Context: {context}\n\nKnowledge Base: {knowledge_base}")
        ])
    
    def process_query(self, query: str, context: Dict[str, Any] = None) -> str:
        """Process business-related queries using RAG"""
        try:
            # Get relevant context from knowledge base
            rag_context = self.knowledge_base.get_context_for_query(query, context)
            
            # Format context for the prompt
            context_str = self._format_context(context) if context else "No specific dashboard context available"
            knowledge_str = json.dumps(rag_context, indent=2)
            
            # Create the prompt
            prompt = self.business_prompt.format(
                query=query, 
                context=context_str,
                knowledge_base=knowledge_str
            )
            
            # Get response from LLM
            response = self.llm.invoke(prompt)
            
            # Store in memory
            self.memory.chat_memory.add_user_message(query)
            self.memory.chat_memory.add_ai_message(response.content)
            
            return response.content
            
        except Exception as e:
            return f"I apologize, but I encountered an error processing your business query: {str(e)}"
    
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format dashboard context for the prompt"""
        if not context:
            return "No context available"
        
        context_parts = []
        
        if "metrics" in context:
            metrics = context["metrics"]
            context_parts.append(f"Dashboard Metrics: {json.dumps(metrics, indent=2)}")
        
        if "topics" in context:
            topics = context["topics"]
            context_parts.append(f"Top Topics: {json.dumps(topics, indent=2)}")
        
        if "trends" in context:
            trends = context["trends"]
            context_parts.append(f"Trending Data: {json.dumps(trends, indent=2)}")
        
        return "\n\n".join(context_parts)
    
    def analyze_engagement_trends(self, dashboard_data: Dict[str, Any]) -> str:
        """Analyze engagement patterns and provide insights using real data"""
        query = "Analyze the engagement trends in this data and provide strategic recommendations for improving audience engagement based on our real performance benchmarks."
        return self.process_query(query, dashboard_data)
    
    def generate_marketing_strategies(self, topic_analysis: Dict[str, Any]) -> str:
        """Generate marketing strategies based on topic performance using real data"""
        query = "Based on the topic performance data and our analysis showing that Lifestyle and Physical Attractiveness are the top topics, suggest specific marketing strategies and content recommendations."
        return self.process_query(query, topic_analysis)
    
    def identify_opportunities(self, comment_analysis: Dict[str, Any]) -> str:
        """Identify business opportunities from comment analysis using real data"""
        query = "Analyze the comment data to identify potential business opportunities and areas for growth, considering our data shows makeup, hair, and beauty content performs best."
        return self.process_query(query, comment_analysis)
    
    def analyze_user_engagement_claim(self, user_claim: str, current_metrics: Dict[str, Any] = None) -> str:
        """Analyze user's engagement claims against real data benchmarks"""
        analysis = self.knowledge_base.analyze_engagement_performance(user_claim, current_metrics)
        
        query = f"""A user claims: "{user_claim}"
        
        Please analyze this claim against our real data benchmarks and provide insights on:
        1. How their performance compares to industry benchmarks
        2. Whether their claims are realistic or concerning
        3. Specific recommendations based on our proven performance data
        
        Real benchmarks to compare against:
        - Engagement correlations: like count has 86% correlation with view count
        - Best video durations: 1-5min and 16-60s(shorts) perform highest
        - Top performing content: makeup, hair, beauty topics
        - Best publishing times: Saturday/Friday for engagement, 15:00 UTC for views
        
        Provide a detailed analysis with actionable recommendations."""
        
        return self.process_query(query, current_metrics)
