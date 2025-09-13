# LOreAi Backend

AI-powered backend for LOreAi comment analytics platform using LangChain agents with Gemini AI and RAG (Retrieval-Augmented Generation).

## Features

- **Business Intelligence Agent**: Provides business insights and marketing recommendations based on real data
- **Dashboard Explanation Agent**: Helps users understand dashboard components and data using real analytics
- **RAG Knowledge Base**: Retrieval-Augmented Generation with comprehensive analysis documentation
- **Real Data Integration**: Uses actual frontend data and performance benchmarks
- **FastAPI Backend**: Modern, fast web framework for building APIs
- **LangChain Integration**: Advanced AI agents powered by Google Gemini Pro

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   - Copy `env_example.txt` to `.env`
   - Add your Google API key:
     ```
     GOOGLE_API_KEY=your_google_api_key_here
     ```

3. **Run the Server**
   ```bash
   python app/main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

### Chat Endpoints
- `POST /api/chat/business` - Business insights and marketing recommendations based on real data
- `POST /api/chat/dashboard` - Dashboard explanations and guidance using real analytics
- `POST /api/chat/general` - General conversation with AI assistant
- `POST /api/chat/contextual` - Context-aware AI responses with RAG
- `POST /api/chat/analyze-engagement` - Analyze user engagement claims against real benchmarks

### Data & Analytics
- `GET /api/chat/benchmarks` - Get all benchmark data for comparison
- `GET /health` - Health check endpoint

### Agent Management
- `GET /api/agents/status` - Get status of AI agents
- `POST /api/agents/clear-memory` - Clear conversation memory

## Usage Examples

### Business Insights with Real Data
```bash
curl -X POST "http://localhost:8000/api/chat/business" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What trends do you see in our comment analysis?",
    "context": {
      "metrics": {
        "total_comments": 3325035,
        "quality_comments": 3087679,
        "spam_comments": 237356
      }
    }
  }'
```

### Engagement Analysis
```bash
curl -X POST "http://localhost:8000/api/chat/analyze-engagement" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "My engagement is really low compared to other channels",
    "context": {
      "current_metrics": {
        "views": 1000,
        "likes": 50,
        "comments": 20
      }
    }
  }'
```

### Dashboard Explanations
```bash
curl -X POST "http://localhost:8000/api/chat/dashboard" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What does the coherence score mean?",
    "context": {
      "current_view": "model_performance",
      "selected_metric": "coherence_score"
    }
  }'
```

## Architecture

- **FastAPI**: Web framework for building APIs
- **LangChain**: Framework for AI agent development
- **Google Gemini Pro**: Language model for agent responses
- **RAG System**: Retrieval-Augmented Generation with knowledge base
- **Real Data Integration**: Frontend data and analysis documentation
- **Pydantic**: Data validation and serialization

## Development

The backend is structured as follows:

```
backend/
├── app/
│   ├── agents/          # AI agents
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── models/          # Data models
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include type hints
4. Update documentation for new features
