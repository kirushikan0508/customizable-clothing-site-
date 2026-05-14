import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DATABASE")

client = MongoClient(uri)
db = client[db_name]

product = db["products"].find_one({"isActive": True})
if product:
    cat_val = product.get('category')
    print(f"Product category value: {cat_val}")
    print(f"Type of category value: {type(cat_val)}")
