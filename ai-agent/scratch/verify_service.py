import sys
import os
from bson import ObjectId

# Add app to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.mongodb_service import mongodb_service

def test_mongodb_service():
    print("--- Testing MongoDB Service ---")
    
    # 1. Test get_categories
    print("\n1. Testing get_categories...")
    categories = mongodb_service.get_categories()
    print(f"Found {len(categories)} categories.")
    for cat in categories:
        print(f" - {cat['name']} (ID: {cat['_id']})")

    # 2. Test search_products with category
    print("\n2. Testing search_products with category 'tshirt'...")
    results = mongodb_service.search_products({'category': 'tshirt'})
    print(f"Results for 'tshirt': {len(results)}")
    for p in results[:3]:
        print(f" - {p['title']} (Cat ID: {p['category']})")

    # 4. Direct Query Test
    print("\n4. Direct Query Test for Category ID '6a00a7b4d5c946127f4c0d56'...")
    from bson import ObjectId
    raw_results = list(mongodb_service.db[settings.mongodb_collection_products].find({'category': ObjectId('6a00a7b4d5c946127f4c0d56')}).limit(3))
    print(f"Direct query found: {len(raw_results)} products.")
    for p in raw_results:
        print(f" - {p['title']}")

if __name__ == "__main__":
    # Ensure env is loaded
    from dotenv import load_dotenv
    load_dotenv()
    test_mongodb_service()
