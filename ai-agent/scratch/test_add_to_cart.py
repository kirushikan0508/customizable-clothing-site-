import asyncio
import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.express_client import express_client

async def test_add_to_cart():
    # Use a dummy product id or find one first
    from app.services.mongodb_service import mongodb_service
    products = mongodb_service.search_products({'keyword': 'polo'})
    if not products:
        print("No products found")
        return
    
    product_id = str(products[0]['_id'])
    print(f"Adding product: {products[0]['title']} (ID: {product_id})")
    
    # Try adding without token
    res = await express_client.add_to_cart(product_id, quantity=1, size="M", auth_token=None)
    print("Response without token:", res)

if __name__ == "__main__":
    asyncio.run(test_add_to_cart())
