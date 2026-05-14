import asyncio
import json
from app.models.schemas import AgentContext
from app.agents.orchestrator_agent import orchestrator_agent
from app.services.memory_service import memory_service

async def test_flow():
    session_id = "test_session_123"
    memory_service.update_memory(session_id, {}) # Clear memory
    
    print("--- 1. Testing Product Search ('Printed T-Shirts') ---")
    ctx1 = AgentContext(
        session_id=session_id,
        message="i need Printed T-Shirts list down it?",
        memory=memory_service.get_memory(session_id),
        auth_token=None
    )
    res1 = await orchestrator_agent.process(ctx1)
    print(f"Agent used: {res1.action_taken}")
    print(f"Response: {res1.response_message}")
    if res1.update_memory:
        memory_service.update_memory(session_id, res1.update_memory)
    
    print("\n--- 2. Testing Checkout Initiation ---")
    ctx2 = AgentContext(
        session_id=session_id,
        message="checkout these items",
        memory=memory_service.get_memory(session_id),
        auth_token=None
    )
    res2 = await orchestrator_agent.process(ctx2)
    print(f"Agent used: {res2.action_taken}")
    print(f"Response: {res2.response_message}")
    if res2.update_memory:
        memory_service.update_memory(session_id, res2.update_memory)
    
    print(f"Active Agent in Memory: {memory_service.get_memory(session_id).get('active_agent')}")

    print("\n--- 3. Testing Address Input ('vavuniya') ---")
    ctx3 = AgentContext(
        session_id=session_id,
        message="vavuniya",
        memory=memory_service.get_memory(session_id),
        auth_token=None
    )
    res3 = await orchestrator_agent.process(ctx3)
    print(f"Agent used: {res3.action_taken}")
    print(f"Response: {res3.response_message}")
    if res3.update_memory:
        memory_service.update_memory(session_id, res3.update_memory)

    print("\n--- 4. Testing Follow-up ('what is the issue') ---")
    ctx4 = AgentContext(
        session_id=session_id,
        message="what is the issue",
        memory=memory_service.get_memory(session_id),
        auth_token=None
    )
    res4 = await orchestrator_agent.process(ctx4)
    print(f"Agent used: {res4.action_taken}")
    print(f"Response: {res4.response_message}")

if __name__ == "__main__":
    asyncio.run(test_flow())
