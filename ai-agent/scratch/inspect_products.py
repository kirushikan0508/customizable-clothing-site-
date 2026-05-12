import sys
import os

# Add app to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.mongodb_service import mongodb_service

def inspect_products():
    print("--- Inspecting MongoDB Products ---")
    
    try:
        # Get raw collection access to avoid stringify_ids
        collection = mongodb_service.db['products']
        raw_product = collection.find_one({})
        if raw_product:
            cat_val = raw_product.get('category')
            is_active = raw_product.get('isActive')
            print(f"Sample product: {raw_product.get('title')}")
            print(f"Category value: {cat_val} | Type: {type(cat_val)}")
            print(f"Is Active: {is_active}")
        else:
            print("No products found in database.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    inspect_products()
