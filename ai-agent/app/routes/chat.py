from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, AgentContext
from app.services.memory_service import memory_service
from app.agents.orchestrator_agent import orchestrator_agent

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Retrieve session memory
        memory = memory_service.get_memory(request.session_id)
        
        # 2. Build context for the agent
        context = AgentContext(
            session_id=request.session_id,
            message=request.message,
            memory=memory
        )
        
        # 3. Process via Orchestrator
        result = await orchestrator_agent.process(context)
        
        # 4. Update memory if the agent requested it
        if result.update_memory:
            memory_service.update_memory(request.session_id, result.update_memory)
            
        # 5. Return response
        return ChatResponse(
            message=result.response_message,
            agent_used=result.action_taken,  # Using action_taken to indicate which branch was used
            action_taken=result.action_taken,
            data=result.data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
