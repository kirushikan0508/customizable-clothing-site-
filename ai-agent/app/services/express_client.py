import httpx
import logging
from typing import Dict, Any, List, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

class ExpressClient:
    def __init__(self):
        self.base_url = settings.express_api_base_url
        self.timeout = 10.0

    def _get_headers(self, auth_token: Optional[str] = None) -> Dict[str, str]:
        headers = {}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        return headers

    async def get_products(self, filters: Dict[str, Any] = None, auth_token: Optional[str] = None) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/products", 
                    params=filters, 
                    headers=self._get_headers(auth_token),
                    timeout=self.timeout
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data
            except Exception as e:
                logger.error(f"Error fetching products: {e}")
                return []

    async def get_product_by_id(self, product_id: str, auth_token: Optional[str] = None) -> Optional[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/products/{product_id}", 
                    headers=self._get_headers(auth_token),
                    timeout=self.timeout
                )
                response.raise_for_status()
                data = response.json()
                return data.get("data", data) if isinstance(data, dict) else data
            except Exception as e:
                logger.error(f"Error fetching product details: {e}")
                return None

    async def get_cart(self, auth_token: Optional[str] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/cart", 
                    headers=self._get_headers(auth_token),
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                logger.error(f"Error fetching cart: {e}")
                return {"items": [], "totalPrice": 0}

    async def add_to_cart(self, product_id: str, quantity: int = 1, size: Optional[str] = None, auth_token: Optional[str] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            try:
                payload = {"productId": product_id, "quantity": quantity}
                if size:
                    payload["size"] = size
                    
                response = await client.post(
                    f"{self.base_url}/cart", 
                    json=payload, 
                    headers=self._get_headers(auth_token),
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                error_detail = str(e)
                try:
                    error_json = e.response.json()
                    error_detail = error_json.get("message") or error_json.get("error") or str(e)
                except Exception:
                    pass
                logger.error(f"HTTP error adding to cart: {error_detail}")
                return {"error": error_detail}
            except Exception as e:
                error_str = str(e) if str(e) else repr(e)
                logger.error(f"Error adding to cart: {error_str}")
                return {"error": error_str}

    async def remove_from_cart(self, item_id: str, auth_token: Optional[str] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(
                    f"{self.base_url}/cart/{item_id}", 
                    headers=self._get_headers(auth_token),
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                error_detail = str(e)
                try:
                    error_json = e.response.json()
                    error_detail = error_json.get("message") or error_json.get("error") or str(e)
                except Exception:
                    pass
                logger.error(f"HTTP error removing from cart: {error_detail}")
                return {"error": error_detail}
            except Exception as e:
                logger.error(f"Error removing from cart: {e}")
                return {"error": str(e)}

    async def create_order(self, order_data: Dict[str, Any], auth_token: Optional[str] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/orders", 
                    json=order_data, 
                    headers=self._get_headers(auth_token),
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                error_detail = str(e)
                try:
                    error_json = e.response.json()
                    error_detail = error_json.get("message") or error_json.get("error") or str(e)
                except Exception:
                    pass
                logger.error(f"HTTP error creating order: {error_detail}")
                return {"error": error_detail}
            except Exception as e:
                logger.error(f"Error creating order: {e}")
                return {"error": str(e)}

express_client = ExpressClient()
