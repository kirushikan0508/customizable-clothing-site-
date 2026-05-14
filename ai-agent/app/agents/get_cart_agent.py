from app.models.schemas import AgentContext, AgentResult
from app.services.express_client import express_client
from app.services.gemini_service import gemini_service

class GetCartAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        try:
            cart_data = await express_client.get_cart(auth_token=context.auth_token)
            
            if not cart_data.get("items"):
                return AgentResult(
                    response_message="Your cart is currently empty.",
                    data={"cart": cart_data},
                    action_taken="get_cart"
                )
                
            # Have Gemini format a nice cart summary
            try:
                system_instruction = "Summarize the user's shopping cart in a friendly, concise manner."
                summary = gemini_service.generate_content(f"Cart Data: {cart_data}", system_instruction)
            except Exception:
                # Fallback to simple list if Gemini fails
                items = cart_data.get("items", [])
                item_list = "\n".join([f"- {item.get('title')} (Qty: {item.get('quantity')})" for item in items])
                summary = f"Here is your cart:\n{item_list}\nTotal: Rs. {cart_data.get('totalPrice', 0)}"
            
            return AgentResult(
                response_message=summary,
                data={"cart": cart_data},
                action_taken="get_cart"
            )
            
        except Exception as e:
            return AgentResult(
                response_message=f"I couldn't fetch your cart right now: {str(e)}",
                action_taken="error"
            )

get_cart_agent = GetCartAgent()
