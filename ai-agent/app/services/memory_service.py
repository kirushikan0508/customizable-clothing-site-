from typing import Dict, Any

class MemoryService:
    def __init__(self):
        # In-memory session store: { "session_id": { "cart": [], "last_products_shown": [], "context": {} } }
        self._sessions: Dict[str, Dict[str, Any]] = {}

    def get_memory(self, session_id: str) -> Dict[str, Any]:
        if session_id not in self._sessions:
            self._sessions[session_id] = {
                "last_products_shown": [],
                "cart_context": [],
                "recent_actions": []
            }
        return self._sessions[session_id]

    def update_memory(self, session_id: str, updates: Dict[str, Any]):
        memory = self.get_memory(session_id)
        for key, value in updates.items():
            if isinstance(value, list) and key in memory and isinstance(memory[key], list):
                # Optionally extend or replace. Here we replace for simplicity.
                memory[key] = value
            else:
                memory[key] = value

memory_service = MemoryService()
