from abc import ABC, abstractmethod
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.schema import BaseMessage
from typing import List, Dict, Any
import os

class BaseAgent(ABC):
    """Base class for all AI agents using Gemini"""
    
    def __init__(self, model_name: str = "gemini-pro", temperature: float = 0.3):
        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            temperature=temperature,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        self.memory = ConversationBufferMemory()
    
    @abstractmethod
    def process_query(self, query: str, context: Dict[str, Any] = None) -> str:
        """Process a user query and return a response"""
        pass
    
    def get_conversation_history(self) -> List[BaseMessage]:
        """Get the conversation history"""
        return self.memory.chat_memory.messages
    
    def clear_memory(self):
        """Clear the conversation memory"""
        self.memory.clear()
