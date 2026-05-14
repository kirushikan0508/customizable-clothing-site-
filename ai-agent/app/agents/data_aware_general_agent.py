from app.services.mongodb_service import mongodb_service
from app.services.gemini_service import gemini_service
from app.models.schemas import AgentContext, AgentResult

class DataAwareGeneralAgent:
    """
    For general questions, first check if they relate to products in the database.
    Only answer based on what's in MongoDB - NO general knowledge fallback.
    """
    
    async def process(self, context: AgentContext) -> AgentResult:
        # Step 0: Check if the user is asking about categories
        if any(word in context.message.lower() for word in ["category", "categories", "types of"]):
            categories = mongodb_service.get_categories()
            if categories:
                cat_names = [c.get('name', 'Unknown') for c in categories]
                response = f"We have several categories available: {', '.join(cat_names)}. Which one are you interested in?"
                
                # If they specifically mentioned a category like "tshirt", find it
                for cat in cat_names:
                    if cat.lower() in context.message.lower():
                        # If they asked for a specific category, show products from it
                        products = mongodb_service.search_products({'category': cat})
                        if products:
                            product_list = "\n".join([f"- {p.get('title')}: Rs. {p.get('price')}" for p in products[:5]])
                            response = f"Here are some items from our {cat} category:\n{product_list}\n\nWould you like to see more?"
                
                return AgentResult(
                    response_message=response,
                    data={"categories": categories},
                    action_taken="list_categories"
                )

        # Step 1: Extract what the user is asking about
        extraction_instruction = """Extract the main product or topic the user is asking about from their message.
        Return ONLY the topic or product name (e.g., 'shirts', 'hoodies', 'delivery policy').
        If it's just a greeting like 'hi', 'hello', return 'GREETING'.
        If it's completely unrelated to shopping or the store, return 'NOT_PRODUCT_RELATED'.
        If the user is asking a follow-up question like 'what is the issue' or 'why did it fail', return 'FOLLOW_UP'."""
        
        topic = gemini_service.generate_content(context.message, extraction_instruction).strip()
        
        if topic == 'GREETING':
            # Even for greetings, show what's available from the DB
            all_products = mongodb_service.get_all_products(limit=5)
            if all_products:
                product_names = [p.get('title', 'Unknown') for p in all_products[:5]]
                return AgentResult(
                    response_message=f"Hello! Welcome to FLAVOUR! 👋 I can help you find clothing from our store. We have items like {', '.join(product_names[:3])} and more. What are you looking for today?",
                    data={"sample_products": all_products[:3]},
                    action_taken="general_chat"
                )
            return AgentResult(
                response_message="Hello! Welcome to FLAVOUR! I'm your shopping assistant. How can I help you today?",
                action_taken="general_chat"
            )
            
        if topic == 'FOLLOW_UP':
             return AgentResult(
                response_message="I'm sorry you encountered an issue! I'm a specialized shopping assistant. It looks like the last action didn't go as planned. Could you please try again or tell me more specifically what you're looking for?",
                action_taken="general_chat"
            )

        if topic == 'NOT_PRODUCT_RELATED':
            # Check if it might still be a product inquiry Gemini missed (e.g., short product names)
            if len(context.message.split()) < 3 and not any(greet in context.message.lower() for greet in ["hi", "hello"]):
                 topic = context.message
            else:
                return AgentResult(
                    response_message="I can only help with questions about our products and shopping. Please ask me about items in our store!",
                    action_taken="general_chat"
                )
        
        # Step 2: Search MongoDB for relevant products
        all_products = mongodb_service.search_products({'keyword': topic})
        
        if not all_products:
            # Try getting all products as a fallback
            all_products = mongodb_service.get_all_products(limit=10)
            if all_products:
                product_names = [p.get('title', 'Unknown') for p in all_products[:5]]
                return AgentResult(
                    response_message=f"I couldn't find specific items matching '{topic}' in our store. However, we do have: {', '.join(product_names)}. Would you like to know more about any of these?",
                    data={"available_products": all_products[:5]},
                    action_taken="general_chat"
                )
            return AgentResult(
                response_message=f"I don't have information about '{topic}' in our database. Could you ask about our available products?",
                action_taken="general_chat"
            )
        
        try:
            # Step 3: Use Gemini to answer BASED ON DATABASE DATA ONLY
            product_info = []
            for p in all_products[:5]:
                info = f"- {p.get('title', 'Unknown')}: {p.get('description', 'No description')}"
                if p.get('price'):
                    price_str = f"Rs. {p.get('price')}"
                    if p.get('discountPrice') and p['discountPrice'] > 0:
                        price_str += f" (Sale: Rs. {p['discountPrice']})"
                    info += f" | Price: {price_str}"
                if p.get('colors'):
                    color_names = [c.get('name', '') for c in p['colors'] if c.get('name')]
                    info += f" | Colors: {', '.join(color_names)}"
                product_info.append(info)
                
            db_context = f"""Based STRICTLY on our database, here are relevant products for '{topic}':
{chr(10).join(product_info)}

User question: {context.message}

RULES:
- Answer the user's question using ONLY information from the products listed above.
- Do NOT make up or invent any product details not listed above.
- If the question cannot be answered from the data above, say "I don't have that information in our database."
- Be friendly and helpful."""
            
            try:
                response = gemini_service.generate_content(
                    db_context,
                    "You are a strict shopping assistant. You MUST ONLY use the product data provided to you. NEVER use your general knowledge. If the data doesn't contain the answer, say so."
                )
            except Exception:
                # Fallback response if Gemini fails
                response = f"I've found some products that might interest you based on your request for '{topic}':\n" + "\n".join([f"- {p.get('title')}" for p in all_products[:3]]) + "\nHow else can I help?"
            
            return AgentResult(
                response_message=response,
                data={"reference_products": all_products[:3]},
                action_taken="general_chat"
            )
        except Exception as e:
            error_str = str(e)
            if "503" in error_str or "429" in error_str or "UNAVAILABLE" in error_str:
                return AgentResult(
                    response_message="I'm sorry, I'm experiencing a bit of high demand right now. This is a temporary service limit. Could you please try again in a few seconds?",
                    action_taken="error_rate_limit"
                )
            return AgentResult(
                response_message=f"I'm sorry, I encountered an issue: {error_str}",
                action_taken="error"
            )

data_aware_general_agent = DataAwareGeneralAgent()
