import pymongo
import logging
from typing import List, Dict, Any, Optional
from bson import ObjectId
from app.config.settings import settings

logger = logging.getLogger(__name__)

class MongoDBService:
    def __init__(self):
        """Initialize MongoDB connection"""
        self.client = pymongo.MongoClient(settings.mongodb_uri)
        self.db = self.client[settings.mongodb_database]
    
    def stringify_ids(self, data: Any) -> Any:
        """Recursively convert ObjectId to string in any data structure"""
        if isinstance(data, list):
            return [self.stringify_ids(item) for item in data]
        if isinstance(data, dict):
            return {k: self.stringify_ids(v) for k, v in data.items()}
        if isinstance(data, ObjectId):
            return str(data)
        return data

    def get_categories(self) -> List[Dict[str, Any]]:
        """Get all active categories from MongoDB"""
        category_collection = self.db[settings.mongodb_collection_categories]
        results = list(category_collection.find({'isActive': True}))
        return self.stringify_ids(results)

    def search_products(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Search products ONLY from MongoDB.
        Never use Gemini's knowledge - only database results.
        """
        collection = self.db[settings.mongodb_collection_products]
        
        mongo_query = {'isActive': True}
        
        # 1. Resolve Category Name to ID if provided
        if filters.get('category'):
            cat_name = filters['category']
            category_collection = self.db[settings.mongodb_collection_categories]
            # Try exact match first, then flexible regex
            # Create a flexible regex that allows optional hyphens and spaces
            flex_name = cat_name.replace(' ', '').replace('-', '')
            # Join characters with optional whitespace/hyphen
            flex_pattern = '[\\s-]*'.join(list(cat_name))
            
            category = category_collection.find_one({'name': {'$regex': f"^{cat_name}$", '$options': 'i'}})
            if not category:
                # Try with optional spaces/hyphens
                category = category_collection.find_one({'name': {'$regex': flex_pattern, '$options': 'i'}})
            if not category:
                # Broader regex
                category = category_collection.find_one({'name': {'$regex': cat_name, '$options': 'i'}})
            
            if category:
                mongo_query['category'] = category['_id']
            else:
                # If category not found by name, add it to search terms for text search fallback
                pass # Will be handled by search_terms below
        
        # Build MongoDB query from filters
        if filters.get('color'):
            mongo_query['colors.name'] = {'$regex': filters['color'], '$options': 'i'}
        if filters.get('size'):
            mongo_query['sizes.size'] = filters['size'].upper()
        if filters.get('gender'):
            mongo_query['gender'] = filters['gender'].lower()
        if filters.get('price_max'):
            mongo_query['price'] = {'$lte': float(filters['price_max'])}
        
        # Text search for keyword, or category (if not resolved to ID)
        search_terms = []
        if filters.get('keyword'):
            search_terms.append(filters['keyword'])
        if filters.get('style'):
            search_terms.append(filters['style'])
        
        # If category ID wasn't found, add the category name to search terms
        if filters.get('category') and 'category' not in mongo_query:
            search_terms.append(filters['category'])
        
        if search_terms:
            mongo_query['$text'] = {'$search': ' '.join(search_terms)}
        
        logger.info(f"MongoDB query: {mongo_query}")
        
        try:
            results = list(collection.find(mongo_query).limit(20))
        except Exception as e:
            logger.warning(f"Initial search failed ({e}), falling back to regex search")
            # Fallback: if text index doesn't exist, use regex on title and description
            if '$text' in mongo_query:
                text_search = mongo_query.pop('$text')['$search']
                if text_search:
                    mongo_query['$or'] = [
                        {'title': {'$regex': text_search, '$options': 'i'}},
                        {'description': {'$regex': text_search, '$options': 'i'}}
                    ]
            results = list(collection.find(mongo_query).limit(20))
        
        # If no results, try a much broader search
        if not results:
            broad_terms = search_terms.copy()
            # If we had a category name but it was resolved to ID, add it back for broad search
            if filters.get('category') and filters['category'] not in broad_terms:
                broad_terms.append(filters['category'])
            
            valid_terms = [t for t in broad_terms if t]
            if valid_terms:
                # Remove category ID constraint for broadest search
                broad_query = {'isActive': True, '$or': [
                    {'title': {'$regex': f".*{'|'.join(valid_terms)}.*", '$options': 'i'}},
                    {'description': {'$regex': f".*{'|'.join(valid_terms)}.*", '$options': 'i'}}
                ]}
                results = list(collection.find(broad_query).limit(20))
        
        return self.stringify_ids(results)
    
    def get_all_products(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get all active products from MongoDB"""
        collection = self.db[settings.mongodb_collection_products]
        results = list(collection.find({'isActive': True}).limit(limit))
        return self.stringify_ids(results)
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get specific product from MongoDB"""
        collection = self.db[settings.mongodb_collection_products]
        try:
            product = collection.find_one({'_id': ObjectId(product_id)})
            return self.stringify_ids(product)
        except Exception:
            return None
    
    def get_cart(self, user_id: str) -> Dict[str, Any]:
        """Get user's cart from MongoDB"""
        collection = self.db[settings.mongodb_collection_carts]
        try:
            cart = collection.find_one({'user': ObjectId(user_id)})
            if not cart:
                return {'items': [], 'totalPrice': 0}
            return self.stringify_ids(cart)
        except Exception:
            return {'items': [], 'totalPrice': 0}

mongodb_service = MongoDBService()
