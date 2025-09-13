from app.agents.base_agent import BaseAgent
from langchain.prompts import ChatPromptTemplate
from typing import Dict, Any
import json
from app.services.knowledge_base import KnowledgeBaseService

class DashboardExplanationAgent(BaseAgent):
    """AI agent specialized in explaining dashboard components and data using RAG"""
    
    def __init__(self):
        super().__init__(model_name="gemini-2.0-flash", temperature=0.1)
        self.knowledge_base = KnowledgeBaseService()
        self.knowledge_base.load_frontend_data()
        self.dashboard_knowledge = self._load_dashboard_knowledge()
        
        self.dashboard_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a friendly dashboard expert for LOreAi, an AI-powered comment analytics platform. 
            
            IMPORTANT FORMATTING RULES:
            - Use <strong>text</strong> for bold formatting, NEVER use asterisks (*)
            - Keep responses detailed but conversational (4-6 sentences)
            - Start with a comprehensive overview, then ask 1 follow-up question
            - Don't dump all information at once - be interactive and engaging
            
            You have access to comprehensive real data including:
            - 3.3M+ comments analyzed with quality/spam classification
            - 26 optimal topics discovered through LDA analysis
            - Real video performance metrics and engagement patterns
            - Statistical correlations and performance benchmarks
            
            CONVERSATION STYLE:
            - Give a detailed, comprehensive summary with key insights (aim for 4-6 sentences)
            - Ask exactly 1 specific follow-up question to guide the conversation
            - Examples: "Would you like to know more about the top performing topics?" or "Are you curious about our spam detection accuracy?"
            - Use real data and provide 4-5 key points with specific metrics in your response
            - Be helpful and encouraging, like a knowledgeable friend
            - Include relevant context and explain the significance of the data
            
            Always provide clear, accurate explanations with practical examples from REAL DATA."""),
            ("user", "{query}\n\nDashboard Context: {context}\n\nKnowledge Base: {knowledge_base}")
        ])
    
    def process_query(self, query: str, context: Dict[str, Any] = None) -> str:
        """Process dashboard-related queries using RAG"""
        try:
            # Get relevant context from knowledge base
            rag_context = self.knowledge_base.get_context_for_query(query, context)
            
            # Format context for the prompt
            context_str = self._format_context(context) if context else "No specific dashboard context available"
            knowledge_str = json.dumps(rag_context, indent=2)
            
            # Create the prompt
            prompt = self.dashboard_prompt.format(
                query=query, 
                context=context_str,
                knowledge_base=knowledge_str
            )
            
            # Get response from LLM
            response = self.llm.invoke(prompt)
            
            # Format the response to fix asterisks
            formatted_response = self._format_response(response.content)
            
            # Store in memory
            self.memory.chat_memory.add_user_message(query)
            self.memory.chat_memory.add_ai_message(formatted_response)
            
            return formatted_response
            
        except Exception as e:
            return f"I apologize, but I encountered an error explaining the dashboard: {str(e)}"
    
    def _load_dashboard_knowledge(self) -> Dict[str, Any]:
        """Load dashboard knowledge base"""
        return {
            "metrics": {
                "coherence_score": "Measures how well-defined and interpretable topics are. Higher scores indicate better topic quality.",
                "comment_quality": "Classification of comments as quality, spam, or uncertain based on GMM analysis.",
                "engagement_rate": "Ratio of comments to views, indicating audience engagement level.",
                "topic_distribution": "Percentage breakdown of content across different topics."
            },
            "components": {
                "topic_leaderboard": "Shows topics ranked by video count and engagement metrics.",
                "comment_analysis": "Displays classified comments with spam detection features.",
                "model_performance": "Shows coherence optimization results for topic modeling.",
                "video_performance": "Lists top-performing videos by engagement metrics."
            },
            "methodology": {
                "gmm_classification": "Gaussian Mixture Model used for comment classification into quality/spam categories.",
                "topic_modeling": "Latent Dirichlet Allocation (LDA) for discovering topics in comment data.",
                "feature_extraction": "20+ features extracted from comments including caps ratio, emoji ratio, etc."
            }
        }
    
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format dashboard context for the prompt"""
        if not context:
            return "No context available"
        
        context_parts = []
        
        if "current_view" in context:
            context_parts.append(f"Current Dashboard View: {context['current_view']}")
        
        if "selected_metric" in context:
            context_parts.append(f"Selected Metric: {context['selected_metric']}")
        
        if "data_values" in context:
            context_parts.append(f"Data Values: {json.dumps(context['data_values'], indent=2)}")
        
        return "\n\n".join(context_parts)
    
    def explain_metric(self, metric_name: str, current_value: Any = None) -> str:
        """Explain what a specific metric means"""
        knowledge = self.dashboard_knowledge.get("metrics", {})
        explanation = knowledge.get(metric_name, "This metric is not in my knowledge base.")
        
        if current_value is not None:
            explanation += f"\n\nCurrent Value: {current_value}"
        
        return explanation
    
    def interpret_chart(self, chart_data: Dict[str, Any], chart_type: str) -> str:
        """Interpret chart data and explain trends"""
        query = f"Please interpret this {chart_type} chart data and explain the key trends and insights: {json.dumps(chart_data, indent=2)}"
        return self.process_query(query)
    
    def guide_user(self, user_goal: str) -> str:
        """Provide step-by-step guidance for dashboard usage"""
        query = f"The user wants to: {user_goal}. Please provide step-by-step guidance on how to achieve this using the LOreAi dashboard."
        return self.process_query(query)
    
    def answer_methodology_questions(self, question: str) -> str:
        """Answer questions about data sources and methodology"""
        query = f"Question about LOreAi methodology: {question}"
        return self.process_query(query)
