import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI", "mongodb+srv://kkirushikan_db_user:u81SaRGQ3UNoOMRH@cluster0.pedbpsk.mongodb.net/")
db_name = os.getenv("MONGODB_DATABASE", "test")

client = MongoClient(uri)
db = client[db_name]

print(f"Connected to {db_name}")

categories = list(db["categories"].find())
print(f"\nCategories ({len(categories)}):")
for cat in categories:
    print(f"- {cat.get('name')} (ID: {cat.get('_id')}, isActive: {cat.get('isActive')})")

printed_cat = db["categories"].find_one({"name": "Printed T-Shirts"})
if printed_cat:
    printed_cat_id = printed_cat["_id"]
    printed_products = list(db["products"].find({"category": printed_cat_id}))
    print(f"\nPrinted T-Shirts ({len(printed_products)}):")
    for p in printed_products:
        print(f"- {p.get('title')} (isActive: {p.get('isActive')})")
else:
    print("\nPrinted T-Shirts category not found")

# Check all active products
active_products = list(db["products"].find({"isActive": True}))
print(f"\nTotal Active Products: {len(active_products)}")
