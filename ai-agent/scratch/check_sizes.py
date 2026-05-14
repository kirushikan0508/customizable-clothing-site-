import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DATABASE")

client = MongoClient(uri)
db = client[db_name]

product = db["products"].find_one({"title": "Tie-Dye Relaxed Printed Tee"})
if product:
    print(f"Product: {product.get('title')}")
    print(f"Sizes: {product.get('sizes')}")
else:
    print("Product not found")
