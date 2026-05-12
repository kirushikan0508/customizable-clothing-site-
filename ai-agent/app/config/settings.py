import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    express_api_base_url: str = os.getenv("EXPRESS_API_BASE_URL", "http://localhost:5000/api")
    port: int = int(os.getenv("PORT", 8000))

    class Config:
        env_file = ".env"

settings = Settings()
