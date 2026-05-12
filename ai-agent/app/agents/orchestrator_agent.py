from app.models.schemas import AgentContext, AgentResult, OrchestratorIntent
from app.services.gemini_service import gemini_service
from .product_search_agent import product_search_agent
from .product_detail_agent import product_detail_agent
from .add_to_cart_agent import add_to_cart_agent
from .remove_cart_agent import remove_cart_agent
from .get_cart_agent import get_cart_agent
from .checkout_agent import checkout_agent
from .data_aware_general_agent import data_aware_general_agent

class OrchestratorAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        # Detect Intent
        system_instruction = """
        You are the main orchestrator for an AI shopping assistant.
        Analyze the user's message and determine the intent.
        Allowed intents:
        - 'search': User wants to find products (e.g., 'show me shirts', 'find red shoes')
        - 'detail': User wants details about a specific product (e.g., 'what material is the first one?', 'tell me about the hoodie')
        - 'add_to_cart': User wants to add an item to their cart
        - 'remove_from_cart': User wants to remove an item from their cart
        - 'get_cart': User wants to see what's in their cart
        - 'checkout': User wants to place their order
        - 'general': Any other greeting, general question, or chit-chat
        """
        
        try:
            intent_data = gemini_service.generate_structured_content(context.message, OrchestratorIntent, system_instruction)
            intent = intent_data.intent
            
            # Route to the appropriate specialized agent
            if intent == 'search':
                return await product_search_agent.process(context)
            elif intent == 'detail':
                return await product_detail_agent.process(context)
            elif intent == 'add_to_cart':
                return await add_to_cart_agent.process(context)
            elif intent == 'remove_from_cart':
                return await remove_cart_agent.process(context)
            elif intent == 'get_cart':
                return await get_cart_agent.process(context)
            elif intent == 'checkout':
                return await checkout_agent.process(context)
            else:
                # Use data-aware agent - queries MongoDB before responding
                # This ensures NO general knowledge fallback from Gemini
                return await data_aware_general_agent.process(context)
                
        except Exception as e:
            return AgentResult(
                response_message=f"I'm sorry, my orchestration system encountered an error: {str(e)}",
                action_taken="error"
            )

orchestrator_agent = OrchestratorAgent()
