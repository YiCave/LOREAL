import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface ChatRequest {
  query: string;
  agent_type?: 'business' | 'dashboard' | 'general';
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  agent_type: string;
  context_used: boolean;
}

export interface BenchmarkData {
  engagement_benchmarks: any;
  performance_benchmarks: any;
  timing_benchmarks: any;
  content_benchmarks: any;
}

class AIService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat/general`, request);
      return response.data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async sendBusinessQuery(query: string, context?: Record<string, any>): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat/business`, {
        query,
        context,
        agent_type: 'business'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending business query:', error);
      throw new Error('Failed to get business insights');
    }
  }

  async sendDashboardQuery(query: string, context?: Record<string, any>): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat/dashboard`, {
        query,
        context,
        agent_type: 'dashboard'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending dashboard query:', error);
      throw new Error('Failed to get dashboard explanation');
    }
  }

  async analyzeEngagement(claim: string, context?: Record<string, any>): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat/analyze-engagement`, {
        query: claim,
        context,
        agent_type: 'business'
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing engagement:', error);
      throw new Error('Failed to analyze engagement');
    }
  }

  async getBenchmarks(): Promise<BenchmarkData> {
    try {
      const response = await axios.get(`${this.baseURL}/api/chat/benchmarks`);
      return response.data.benchmarks;
    } catch (error) {
      console.error('Error getting benchmarks:', error);
      throw new Error('Failed to get benchmark data');
    }
  }

  async getHealthStatus(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.status === 200;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // Helper method to determine agent type based on query
  determineAgentType(query: string): 'business' | 'dashboard' | 'general' {
    const businessKeywords = ['business', 'marketing', 'strategy', 'insights', 'trends', 'engagement', 'performance', 'revenue', 'growth'];
    const dashboardKeywords = ['dashboard', 'chart', 'metric', 'data', 'explain', 'how', 'what', 'coherence', 'topic', 'comment'];
    
    const queryLower = query.toLowerCase();
    
    if (businessKeywords.some(keyword => queryLower.includes(keyword))) {
      return 'business';
    } else if (dashboardKeywords.some(keyword => queryLower.includes(keyword))) {
      return 'dashboard';
    }
    
    return 'general';
  }

  // Get current dashboard context for AI
  getDashboardContext(): Record<string, any> {
    return {
      current_time: new Date().toISOString(),
      platform: 'LOreAi',
      data_source: 'Real analysis data from 3.3M+ comments and 500K+ videos',
      metrics: {
        total_comments: 3325035,
        quality_comments: 3087679,
        spam_comments: 237356,
        total_videos: 500000,
        optimal_topics: 26,
        coherence_score: 0.531
      }
    };
  }
}

const aiService = new AIService();
export default aiService;
