from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="LOreAi Backend API",
    description="AI-powered comment analytics backend",
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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
