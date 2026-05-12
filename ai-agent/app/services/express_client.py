import httpx
import logging
from typing import Dict, Any, List, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

class ExpressClient:
    def __init__(self):
        self.base_url = settings.express_api_base_url
        self.timeout = 10.0

    async def get_products(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/products", 
                    params=filters, 
                    timeout=self.timeout
                )
                response.raise_for_status()
                # Assuming standard response format: {"success": True, "data": [...]} or just [...]
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data
            except Exception as e:
                logger.error(f"Error fetching products: {e}")
                return []

    async def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/products/{product_id}", 
                    timeout=self.timeout
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data
            except Exception as e:
                logger.error(f"Error fetching product details: {e}")
                return None

    async def get_cart(self) -> Dict[str, Any]:
        # Typically requires user auth, assuming default/test cart for now or mock API
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/cart", 
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error fetching cart: {e}")
                return {"items": [], "totalPrice": 0}

    async def add_to_cart(self, product_id: str, quantity: int = 1) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            try:
                payload = {"productId": product_id, "quantity": quantity}
                response = await client.post(
                    f"{self.base_url}/cart/add", 
                    json=payload, 
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error adding to cart: {e}")
                return {"error": str(e)}

    async def remove_from_cart(self, item_id: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(
                    f"{self.base_url}/cart/remove/{item_id}", 
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error removing from cart: {e}")
                return {"error": str(e)}

    async def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/orders/create", 
                    json=order_data, 
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error creating order: {e}")
                return {"error": str(e)}

express_client = ExpressClient()
