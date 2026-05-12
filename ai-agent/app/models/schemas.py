from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

# Requests / Responses
class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    message: str
    agent_used: str
    action_taken: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

# Internal Agent models
class AgentContext(BaseModel):
    session_id: str
    message: str
    memory: Dict[str, Any]

class AgentResult(BaseModel):
    response_message: str
    data: Optional[Dict[str, Any]] = None
    update_memory: Optional[Dict[str, Any]] = None
    action_taken: str = "none"

# Orchestrator Intent parsing model
class OrchestratorIntent(BaseModel):
    intent: str = Field(description="The determined intent: 'search', 'detail', 'add_to_cart', 'remove_from_cart', 'get_cart', 'checkout', or 'general'")
    reasoning: str = Field(description="Brief reasoning for why this intent was chosen")
