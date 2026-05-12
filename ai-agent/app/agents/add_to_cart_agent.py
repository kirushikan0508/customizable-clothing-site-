from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

class AddToCartAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        last_products = context.memory.get("last_products_shown", [])
        
        # If no last products, try a quick search based on the message
        if not last_products:
            from app.services.mongodb_service import mongodb_service
            # Extract potential product from message
            extract_instruction = "Extract the specific clothing item the user wants to add (e.g., 'blue tshirt', 'red hoodie'). Return ONLY the item name."
            topic = gemini_service.generate_content(context.message, extract_instruction).strip()
            
            if topic and topic != "NONE":
                last_products = mongodb_service.search_products({'keyword': topic})
                # Update context memory for this turn
                context.memory["last_products_shown"] = last_products

        if not last_products:
            return AgentResult(
                response_message="I'm not sure which item you want to add. Please search for a product first.",
                action_taken="missing_context"
            )

        system_instruction = f"""
        You are an Add-to-Cart assistant. The user wants to add an item to their cart.
        Recent products shown: {last_products}
        Identify the product ID and quantity from the user's message: '{context.message}'
        If multiple products could match, pick the most relevant one.
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
                
            response = await express_client.add_to_cart(resolution.product_id, resolution.quantity, auth_token=context.auth_token)
            
            if "error" not in response:
                success_instruction = "Politely confirm that the item was successfully added to the cart."
                response_msg = gemini_service.generate_content("Item added successfully.", success_instruction)
                return AgentResult(
                    response_message=response_msg,
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
