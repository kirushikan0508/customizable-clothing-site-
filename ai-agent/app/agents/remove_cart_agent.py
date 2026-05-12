from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

class RemoveCartAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        # First, fetch the current cart to know what can be removed
        cart_data = await express_client.get_cart(auth_token=context.auth_token)
        items = cart_data.get("items", [])
        
        if not items:
            return AgentResult(
                response_message="Your cart is already empty.",
                action_taken="remove_from_cart"
            )
            
        system_instruction = f"""
        You are a Remove-from-Cart assistant. The user wants to remove an item.
        Current cart items: {items}
        Identify the specific item ID the user wants to remove based on their message.
        """
        
        class CartItemRemovalResolution(BaseModel):
            item_id: Optional[str] = Field(description="The exact cart item ID to remove")
            
        try:
            resolution = gemini_service.generate_structured_content(context.message, CartItemRemovalResolution, system_instruction)
            
            if not resolution.item_id:
                return AgentResult(
                    response_message="I'm not sure which item in your cart you want to remove. Could you specify?",
                    action_taken="ambiguous_reference"
                )
                
            response = await express_client.remove_from_cart(resolution.item_id, auth_token=context.auth_token)
            
            if "error" not in response:
                success_instruction = "Politely confirm that the item was successfully removed from the cart."
                response_msg = gemini_service.generate_content("Item removed successfully.", success_instruction)
                return AgentResult(
                    response_message=response_msg,
                    data={"cart_response": response},
                    action_taken="remove_from_cart"
                )
            else:
                return AgentResult(
                    response_message=f"There was an issue removing the item: {response['error']}",
                    action_taken="error"
                )
        except Exception as e:
            return AgentResult(
                response_message=f"Failed to remove from cart: {str(e)}",
                action_taken="error"
            )

remove_cart_agent = RemoveCartAgent()
