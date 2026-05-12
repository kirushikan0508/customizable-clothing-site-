import os
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    express_api_base_url: str = os.getenv("EXPRESS_API_BASE_URL", "http://localhost:5000/api")
    port: int = int(os.getenv("PORT", 8000))

    # MongoDB Configuration
    mongodb_uri: str = Field(default="mongodb://localhost:27017", validation_alias="MONGODB_URI")
    mongodb_database: str = Field(default="test", validation_alias="MONGODB_DATABASE")
    mongodb_collection_products: str = Field(default="products", validation_alias="MONGODB_COLLECTION_PRODUCTS")
    mongodb_collection_categories: str = Field(default="categories", validation_alias="MONGODB_COLLECTION_CATEGORIES")
    mongodb_collection_carts: str = Field(default="carts", validation_alias="MONGODB_COLLECTION_CARTS")
    mongodb_collection_orders: str = Field(default="orders", validation_alias="MONGODB_COLLECTION_ORDERS")

    class Config:
        env_file = ".env"

settings = Settings()
