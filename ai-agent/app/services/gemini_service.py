import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import Type, Any, Optional

from app.config.settings import settings

class GeminiService:
    def __init__(self):
        # We will initialize the client. Wait for the API key to be loaded.
        api_key = settings.gemini_api_key or os.environ.get("GEMINI_API_KEY")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None

    def generate_content(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.client:
            return "Gemini API key not configured."
            
        try:
            config = types.GenerateContentConfig()
            if system_instruction:
                config.system_instruction = system_instruction
                
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=config
            )
            return response.text
        except Exception as e:
            return f"Error generating response: {str(e)}"

    def generate_structured_content(self, prompt: str, schema_class: Type[BaseModel], system_instruction: Optional[str] = None) -> BaseModel:
        if not self.client:
            raise Exception("Gemini API key not configured.")
            
        try:
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema_class,
            )
            if system_instruction:
                config.system_instruction = system_instruction
                
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=config
            )
            # Response text should be JSON matching the schema
            return schema_class.model_validate_json(response.text)
        except Exception as e:
            raise Exception(f"Error generating structured content: {str(e)}")

gemini_service = GeminiService()
