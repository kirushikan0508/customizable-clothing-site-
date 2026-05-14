from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

class CheckoutDetails(BaseModel):
    ready_to_checkout: bool = Field(description="Whether the user is confirming they want to place the order now")
    address: Optional[str] = Field(description="Shipping address if provided")
    product_to_add: Optional[str] = Field(description="Name or description of a product the user wants to add and checkout now (if mentioned)")
    size: str = Field(default="M", description="Size of the product if adding one (S, M, L, XL, etc.)")

class CheckoutAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        system_instruction = """
        You are a checkout assistant. 
        Determine if the user is ready to finalize their order and if they provided a shipping address.
        IMPORTANT: 
        - If the user provides a location, street, or city, count that as an 'address'.
        - If an address is provided, always set 'ready_to_checkout' to True.
        - If the user says 'yes', 'confirm', 'checkout', or provides an address, they are ready.
        """
        
        try:
            details = gemini_service.generate_structured_content(context.message, CheckoutDetails, system_instruction)
            
            # If user mentioned a product, add it to cart first
            if details.product_to_add:
                from app.services.mongodb_service import mongodb_service
                products = mongodb_service.search_products({'keyword': details.product_to_add})
                if products:
                    product_id = products[0].get('_id')
                    await express_client.add_to_cart(product_id, 1, size=details.size, auth_token=context.auth_token)
                    # We continue with the checkout flow after adding
                else:
                    return AgentResult(
                        response_message=f"I couldn't find '{details.product_to_add}' in our store to add it to your checkout. Could you double-check the name?",
                        action_taken="product_not_found"
                    )
            
            if not details.ready_to_checkout:
                return AgentResult(
                    response_message="Okay! Are you ready to checkout? Please provide a shipping address when you're ready.",
                    action_taken="checkout_prompt"
                )
                
            if not details.address:
                return AgentResult(
                    response_message="Great, let's get you checked out! Please provide your shipping address.",
                    action_taken="checkout_missing_info",
                    update_memory={"active_agent": "checkout"}
                )
                
            # Create order
            order_payload = {"address": details.address}
            response = await express_client.create_order(order_payload, auth_token=context.auth_token)
            
            if "error" not in response:
                success_instruction = "Politely confirm that the order has been placed successfully and express gratitude."
                response_msg = gemini_service.generate_content("Order placed successfully.", success_instruction)
                return AgentResult(
                    response_message=response_msg,
                    data={"order": response},
                    action_taken="checkout_complete",
                    update_memory={"active_agent": None}
                )
            else:
                return AgentResult(
                    response_message=f"There was an issue processing your checkout: {response['error']}",
                    action_taken="error"
                )
        except Exception as e:
            error_str = str(e)
            if "503" in error_str or "429" in error_str or "UNAVAILABLE" in error_str:
                return AgentResult(
                    response_message="I'm sorry, I'm experiencing a bit of high demand right now. Could you please try that checkout step again in a moment?",
                    action_taken="error_rate_limit"
                )
            return AgentResult(
                response_message=f"Checkout error: {error_str}",
                action_taken="error"
            )

checkout_agent = CheckoutAgent()
