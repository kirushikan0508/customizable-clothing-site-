import logging
from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

logger = logging.getLogger(__name__)

class CheckoutIntent(BaseModel):
    ready_to_checkout: bool = Field(description="Whether the user is confirming they want to place the order now")
    product_to_add: Optional[str] = Field(None, description="Name or description of a product the user wants to add and checkout now (if mentioned)")
    size: str = Field(default="M", description="Size of the product if adding one (S, M, L, XL, etc.)")

class CheckoutAgent:
    async def _get_saved_address(self, auth_token: Optional[str]) -> Optional[dict]:
        """Fetch the user's saved address from their profile."""
        try:
            profile = await express_client.get_profile(auth_token=auth_token)
            if profile and profile.get("addresses") and len(profile["addresses"]) > 0:
                addresses = profile["addresses"]
                # Prefer the default address, otherwise use the first one
                saved_addr = next((a for a in addresses if a.get("isDefault")), addresses[0])
                # Build the shippingAddress object that the backend expects
                shipping_address = {
                    "fullName": saved_addr.get("fullName", ""),
                    "phone": saved_addr.get("phone", ""),
                    "street": saved_addr.get("street", ""),
                    "city": saved_addr.get("city", ""),
                    "state": saved_addr.get("state", ""),
                    "zipCode": saved_addr.get("zipCode", ""),
                    "country": saved_addr.get("country", "Sri Lanka"),
                }
                logger.info(f"Found saved address for user: {shipping_address.get('city')}")
                return shipping_address
        except Exception as e:
            logger.error(f"Error fetching saved address: {e}")
        return None

    async def process(self, context: AgentContext) -> AgentResult:
        system_instruction = """
        You are a checkout assistant. 
        Determine if the user is ready to finalize their order.
        IMPORTANT: 
        - If the user says 'yes', 'confirm', 'checkout', 'proceed', 'place order', or anything similar, they are ready. Set ready_to_checkout to True.
        - If the user mentions a specific product to add before checkout, extract its name into product_to_add.
        - Do NOT worry about the address. The system will automatically use the user's saved address.
        """
        
        try:
            details = gemini_service.generate_structured_content(context.message, CheckoutIntent, system_instruction)
            
            # Automatically fetch the user's saved address
            shipping_address = await self._get_saved_address(context.auth_token)
            
            if not shipping_address:
                return AgentResult(
                    response_message="I couldn't find a saved address on your profile. Please add an address in your account settings first, then try again.",
                    action_taken="checkout_missing_info",
                    update_memory={"active_agent": None}
                )

            if not details.ready_to_checkout:
                return AgentResult(
                    response_message="Would you like me to proceed with the checkout? Just say 'yes' or 'proceed to checkout' when you're ready!",
                    action_taken="checkout_prompt"
                )

            # Create order payload with the structured shippingAddress
            order_payload = {"shippingAddress": shipping_address}

            # If user mentioned a product, use direct buy (bypass cart)
            if details.product_to_add:
                from app.services.mongodb_service import mongodb_service
                products = mongodb_service.search_products({'keyword': details.product_to_add})
                if products:
                    product = products[0]
                    # Add directly to order payload to checkout ONLY this item
                    order_payload["items"] = [{
                        "product": str(product.get('_id')),
                        "quantity": 1,
                        "size": details.size,
                        "price": product.get('price', 0)
                    }]
                else:
                    return AgentResult(
                        response_message=f"I couldn't find '{details.product_to_add}' in our store. Could you double-check the name?",
                        action_taken="product_not_found"
                    )

            response = await express_client.create_order(order_payload, auth_token=context.auth_token)
            
            if "error" not in response:
                addr_summary = f"{shipping_address.get('street')}, {shipping_address.get('city')}"
                return AgentResult(
                    response_message=f"✅ Your order has been placed successfully! It will be shipped to **{addr_summary}**. Thank you for shopping with us!",
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
            error_str = str(e) if str(e) else repr(e)
            logger.error(f"Checkout error: {error_str}")
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
