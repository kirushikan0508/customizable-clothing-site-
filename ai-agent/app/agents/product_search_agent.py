from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

class ProductSearchFilters(BaseModel):
    category: Optional[str] = Field(default=None, description="Category of the clothing (e.g., shirts, pants, outerwear)")
    color: Optional[str] = Field(default=None, description="Color of the item")
    size: Optional[str] = Field(default=None, description="Size of the item (e.g., S, M, L, XL)")
    style: Optional[str] = Field(default=None, description="Style or fit (e.g., casual, formal, slim, oversized)")
    keyword: Optional[str] = Field(default=None, description="General search keyword")
    price_max: Optional[float] = Field(default=None, description="Maximum price")

class ProductSearchAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        # Extract filters using Gemini
        system_instruction = "You are a product search filter extractor. Extract the requested clothing parameters from the user's message."
        try:
            filters = gemini_service.generate_structured_content(context.message, ProductSearchFilters, system_instruction)
            
            # Construct query params
            query_params = filters.model_dump(exclude_none=True)
            
            # Call Express API
            products = await express_client.get_products(filters=query_params, auth_token=context.auth_token)
            
            # Formulate response
            if products and isinstance(products, list) and len(products) > 0:
                # Format a nice message
                response_msg = f"I found {len(products)} products matching your search."
                # Store in memory for future reference
                update_memory = {"last_products_shown": products}
                return AgentResult(
                    response_message=response_msg,
                    data={"products": products},
                    update_memory=update_memory,
                    action_taken="search_products"
                )
            else:
                return AgentResult(
                    response_message="I couldn't find any products matching your exact criteria. Could you try adjusting your search?",
                    data={"products": []},
                    action_taken="search_products"
                )
        except Exception as e:
            return AgentResult(
                response_message=f"I'm sorry, I had trouble searching for that: {str(e)}",
                action_taken="error"
            )

product_search_agent = ProductSearchAgent()
