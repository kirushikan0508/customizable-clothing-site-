from typing import Optional
from pydantic import BaseModel, Field
from app.models.schemas import AgentContext, AgentResult
from app.services.gemini_service import gemini_service
from app.services.express_client import express_client

class ProductDetailExtraction(BaseModel):
    product_reference: str = Field(description="The way the user referred to the product, e.g., 'the red one', 'the first one', or product name")

class ProductDetailAgent:
    async def process(self, context: AgentContext) -> AgentResult:
        # Resolve which product they mean
        # Pass the last shown products into context to let Gemini pick the right one
        last_products = context.memory.get("last_products_shown", [])
        
        if not last_products:
            return AgentResult(
                response_message="I don't have any recent products in mind. Could you search for something first?",
                action_taken="missing_context"
            )
            
        system_instruction = f"""
        You are a product detail resolver. The user is asking for details about a product.
        Recent products shown to user: {last_products}
        Based on the user's message, identify which product they are referring to.
        Return the exact ID of that product.
        """
        
        class ResolvedProduct(BaseModel):
            product_id: Optional[str] = Field(description="The ID of the product they are referring to, or null if unclear")
            
        try:
            resolution = gemini_service.generate_structured_content(context.message, ResolvedProduct, system_instruction)
            
            if not resolution.product_id:
                return AgentResult(
                    response_message="I'm not exactly sure which product you're referring to. Could you be more specific?",
                    action_taken="ambiguous_reference"
                )
                
            # Fetch details
            product = await express_client.get_product_by_id(resolution.product_id, auth_token=context.auth_token)
            
            if product:
                # Generate a conversational summary of the product
                desc_instruction = "Summarize this product naturally for a shopper."
                summary = gemini_service.generate_content(f"Product data: {product}", desc_instruction)
                
                return AgentResult(
                    response_message=summary,
                    data={"product": product},
                    action_taken="get_product_details"
                )
            else:
                return AgentResult(
                    response_message="I couldn't fetch the details for that product right now.",
                    action_taken="error"
                )
        except Exception as e:
            return AgentResult(
                response_message=f"I'm sorry, I had trouble getting the details: {str(e)}",
                action_taken="error"
            )

product_detail_agent = ProductDetailAgent()
