from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.mongodb_service import mongodb_service

class ProductSearchFilters(BaseModel):
    category: Optional[str] = Field(default=None, description="Category of the clothing (e.g., shirts, pants, outerwear)")
    color: Optional[str] = Field(default=None, description="Color of the item")
    size: Optional[str] = Field(default=None, description="Size of the item (e.g., S, M, L, XL)")
    style: Optional[str] = Field(default=None, description="Style or fit (e.g., casual, formal, slim, oversized)")
    keyword: Optional[str] = Field(default=None, description="General search keyword")
    price_max: Optional[float] = Field(default=None, description="Maximum price")

class ProductSearchAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        # STEP 1: Extract filters using Gemini (only for parsing, NOT for product data)
        system_instruction = "You are a product search filter extractor. Extract the requested clothing parameters from the user's message."
        
        query_params = {}
        msg = context.message.lower()
        
        # Simple keyword-based heuristics to save quota
        if "printed" in msg:
            query_params["keyword"] = "printed"
        if "shirt" in msg or "tee" in msg:
            query_params["category"] = "T-Shirts"
            
        try:
            if not query_params:
                filters = gemini_service.generate_structured_content(context.message, ProductSearchFilters, system_instruction)
                query_params = filters.model_dump(exclude_none=True)
            
            # STEP 2: Query MongoDB DIRECTLY - never use Gemini's knowledge for products
            products = mongodb_service.search_products(query_params)
            
            # STEP 3: Format response using ONLY database data
            if products and len(products) > 0:
                # Build context string from ACTUAL database results only
                db_context = f"Found {len(products)} products in our database:\n"
                for i, p in enumerate(products[:5], 1):
                    price_str = f"Rs. {p.get('price', 'N/A')}"
                    if p.get('discountPrice') and p['discountPrice'] > 0:
                        price_str += f" (Sale: Rs. {p['discountPrice']})"
                    db_context += f"{i}. {p.get('title', 'Unknown')} - {price_str}\n"
                
                # Use Gemini ONLY to format - constrained to database data
                try:
                    format_instruction = """You are a helpful shopping assistant.
                    Based ONLY on the products listed below, provide a brief, friendly response.
                    RULES:
                    - Only mention products and details from the list provided.
                    - Do NOT add any product information that is not in the list.
                    - Do NOT invent prices, colors, or features.
                    - Keep it conversational and brief."""
                    
                    response_msg = gemini_service.generate_content(db_context, format_instruction)
                except Exception:
                    # Fallback formatting if Gemini fails
                    response_msg = f"I found {len(products)} products for you:\n" + "\n".join([f"- {p.get('title')} (Rs. {p.get('price')})" for p in products[:3]])
                
                # Store in memory for future reference
                update_memory = {"last_products_shown": products}
                return AgentResult(
                    response_message=response_msg,
                    data={"products": products},
                    update_memory=update_memory,
                    action_taken="search_products"
                )
            else:
                # No products found, check categories for suggestions
                categories = mongodb_service.get_categories()
                
                requested_cat = filters.category if filters.category else ""
                matched_cat = None
                if requested_cat:
                    for c in categories:
                        if requested_cat.lower() in c.get('name', '').lower():
                            matched_cat = c.get('name')
                            break
                
                if matched_cat:
                    response_msg = f"I found the '{matched_cat}' category, but we don't have any active products in it right now."
                else:
                    response_msg = "I didn't find any products matching your search in our database."
                
                cat_names = [c.get('name') for c in categories[:5] if c.get('name') != matched_cat]
                if cat_names:
                    response_msg += f" However, we have other items in categories like {', '.join(cat_names)}. Would you like to see something from those?"
                
                return AgentResult(
                    response_message=response_msg,
                    data={"products": [], "suggested_categories": cat_names},
                    action_taken="search_products"
                )
        except Exception as e:
            error_str = str(e)
            if "503" in error_str or "429" in error_str or "UNAVAILABLE" in error_str:
                return AgentResult(
                    response_message="I'm sorry, my AI model is currently reaching its temporary usage limit (Gemini Free Tier). Please wait about 30-60 seconds and try your request again. I'm working on being more efficient!",
                    action_taken="error_rate_limit"
                )
            return AgentResult(
                response_message=f"I'm sorry, I had trouble searching for that: {error_str}",
                action_taken="error"
            )

product_search_agent = ProductSearchAgent()
