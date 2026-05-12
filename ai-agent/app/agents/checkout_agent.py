from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

class CheckoutDetails(BaseModel):
    ready_to_checkout: bool = Field(description="Whether the user is confirming they want to place the order now")
    address: Optional[str] = Field(description="Shipping address if provided")

class CheckoutAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        system_instruction = "You are a checkout assistant. Determine if the user is ready to finalize their order and if they provided a shipping address."
        
        try:
            details = gemini_service.generate_structured_content(context.message, CheckoutDetails, system_instruction)
            
            if not details.ready_to_checkout:
                return AgentResult(
                    response_message="Okay! Are you ready to checkout? Please provide a shipping address when you're ready.",
                    action_taken="checkout_prompt"
                )
                
            if not details.address:
                return AgentResult(
                    response_message="Great, let's get you checked out! Please provide your shipping address.",
                    action_taken="checkout_missing_info"
                )
                
            # Create order
            order_payload = {"address": details.address}
            response = await express_client.create_order(order_payload)
            
            if "error" not in response:
                return AgentResult(
                    response_message="Success! Your order has been placed successfully.",
                    data={"order": response},
                    action_taken="checkout_complete"
                )
            else:
                return AgentResult(
                    response_message=f"There was an issue processing your checkout: {response['error']}",
                    action_taken="error"
                )
        except Exception as e:
            return AgentResult(
                response_message=f"Checkout error: {str(e)}",
                action_taken="error"
            )

checkout_agent = CheckoutAgent()
