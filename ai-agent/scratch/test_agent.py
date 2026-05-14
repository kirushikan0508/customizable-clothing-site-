import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.schemas import AgentContext
from app.agents.add_to_cart_agent import add_to_cart_agent
from app.services.mongodb_service import mongodb_service

async def test():
    # First, search for polo
    products = mongodb_service.search_products({'keyword': 'polo'})
    
    context = AgentContext(
        session_id="test",
        message="Polo Classic Fit T-Shirt, which is on sale for Rs. 1199 add this tshirt in cart page",
        memory={"last_products_shown": products},
        auth_token=None # Let's see what happens without token
    )
    
    result = await add_to_cart_agent.process(context)
    print(f"Result: {result.response_message}")
    print(f"Action: {result.action_taken}")

if __name__ == "__main__":
    asyncio.run(test())
