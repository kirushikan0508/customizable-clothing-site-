from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

class AddToCartAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        last_products = context.memory.get("last_products_shown", [])
        
        if not last_products:
            return AgentResult(
                response_message="I'm not sure which item you want to add. Please search for a product first.",
                action_taken="missing_context"
            )

        system_instruction = f"""
        You are an Add-to-Cart assistant. The user wants to add an item to their cart.
        Recent products shown: {last_products}
        Identify the product ID and quantity from the user's message.
        """
        
        class CartItemResolution(BaseModel):
            product_id: Optional[str] = Field(description="The resolved product ID")
            quantity: int = Field(default=1, description="The requested quantity")
            
        try:
            resolution = gemini_service.generate_structured_content(context.message, CartItemResolution, system_instruction)
            
            if not resolution.product_id:
                return AgentResult(
                    response_message="Which specific item would you like to add?",
                    action_taken="ambiguous_reference"
                )
                
            response = await express_client.add_to_cart(resolution.product_id, resolution.quantity)
            
            if "error" not in response:
                return AgentResult(
                    response_message="I've added that to your cart!",
                    data={"cart_response": response},
                    action_taken="add_to_cart"
                )
            else:
                return AgentResult(
                    response_message=f"There was an issue adding to cart: {response['error']}",
                    action_taken="error"
                )
        except Exception as e:
            return AgentResult(
                response_message=f"Failed to add to cart: {str(e)}",
                action_taken="error"
            )

add_to_cart_agent = AddToCartAgent()
