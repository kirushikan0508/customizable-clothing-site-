import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load env before other imports
load_dotenv()

from app.config.settings import settings
from app.routes.chat import router as chat_router

app = FastAPI(
    title="AI Shopping Assistant Agent API",
    description="Modular multi-agent system powered by FastAPI and Gemini API",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat_router, prefix="/api", tags=["chat"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-agent"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
