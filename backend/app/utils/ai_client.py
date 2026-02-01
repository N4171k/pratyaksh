import os
import json
from typing import Optional, Dict, Any
from groq import Groq
from tenacity import retry, stop_after_attempt, wait_exponential
from app.core.config import settings
from app.core.security import cache_manager
from app.models.schemas import ServiceCategory


class AIClient:
    """AI client for service categorization and email generation."""
    
    def __init__(self):
        self.client = None
        if settings.GROQ_API_KEY:
            self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
        self.fallback_model = settings.GROQ_FALLBACK_MODEL
    
    def is_available(self) -> bool:
        """Check if AI client is available."""
        return self.client is not None
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    async def _call_groq(
        self, 
        messages: list, 
        temperature: float = 0.3,
        max_tokens: int = 500,
        json_mode: bool = True
    ) -> Optional[str]:
        """Make a call to Groq API with retry logic."""
        if not self.client:
            return None
        
        try:
            kwargs = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}
            
            response = self.client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
            
        except Exception as e:
            # Try fallback model
            try:
                kwargs["model"] = self.fallback_model
                response = self.client.chat.completions.create(**kwargs)
                return response.choices[0].message.content
            except Exception as fallback_error:
                print(f"AI call failed: {e}, Fallback failed: {fallback_error}")
                return None
    
    async def categorize_service(
        self, 
        domain: str, 
        subject: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Categorize a service using AI.
        
        Args:
            domain: Service domain
            subject: Optional email subject for context
        
        Returns:
            Dict with service_name, category, data_sensitivity, privacy_email
        """
        # Check cache first
        cached = cache_manager.get_ai_categorization(domain)
        if cached:
            return cached
        
        system_prompt = """You are a service categorization expert. Analyze the domain and return ONLY a JSON object with the following structure:
{
  "service_name": "Human-readable name of the service",
  "category": "One of: Finance, Healthcare, Government, Dating, E-commerce, Social Media, Professional, Travel, Entertainment, News, Education, Gaming, Other",
  "data_sensitivity": "Integer from 1-10 (10 being most sensitive)",
  "privacy_email": "Best guess for privacy contact email (e.g., privacy@domain.com)",
  "confidence": "Float from 0.0-1.0 indicating confidence"
}

Consider what data the service typically collects when determining sensitivity:
- Finance, Healthcare, Dating: High sensitivity (8-10)
- E-commerce, Social Media, Travel: Medium sensitivity (5-7)
- Entertainment, News, Gaming: Lower sensitivity (3-5)"""

        user_prompt = f"Domain: {domain}"
        if subject:
            user_prompt += f"\nEmail Subject: {subject}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        result = await self._call_groq(messages)
        if result:
            try:
                parsed = json.loads(result)
                # Validate and normalize
                parsed["category"] = self._normalize_category(parsed.get("category", "Other"))
                parsed["data_sensitivity"] = max(1, min(10, int(parsed.get("data_sensitivity", 5))))
                
                # Cache the result
                cache_manager.set_ai_categorization(domain, parsed)
                return parsed
            except json.JSONDecodeError:
                return None
        
        return None
    
    def _normalize_category(self, category: str) -> str:
        """Normalize category string to valid enum value."""
        category_map = {
            "finance": "Finance",
            "healthcare": "Healthcare", 
            "health": "Healthcare",
            "government": "Government",
            "dating": "Dating",
            "e-commerce": "E-commerce",
            "ecommerce": "E-commerce",
            "shopping": "E-commerce",
            "social media": "Social Media",
            "social": "Social Media",
            "professional": "Professional",
            "travel": "Travel",
            "entertainment": "Entertainment",
            "streaming": "Entertainment",
            "news": "News",
            "education": "Education",
            "gaming": "Gaming",
            "games": "Gaming",
        }
        
        normalized = category_map.get(category.lower(), category)
        
        # Verify it's a valid category
        valid_categories = [e.value for e in ServiceCategory]
        if normalized in valid_categories:
            return normalized
        return "Other"
    
    async def extract_privacy_email(
        self, 
        domain: str, 
        privacy_policy_text: Optional[str] = None
    ) -> Optional[str]:
        """
        Extract privacy contact email from domain or policy text.
        
        Args:
            domain: Service domain
            privacy_policy_text: Optional privacy policy excerpt
        
        Returns:
            Privacy email address or None
        """
        system_prompt = """You are an expert at finding privacy contact information. 
Given a domain and optionally privacy policy text, find the best email to contact for data deletion requests.
Return ONLY the email address or "NOT_FOUND" if none can be determined.
Common patterns: privacy@, dpo@, legal@, gdpr@, support@"""

        user_prompt = f"Domain: {domain}"
        if privacy_policy_text:
            user_prompt += f"\nPrivacy Policy Excerpt: {privacy_policy_text[:2000]}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        result = await self._call_groq(messages, json_mode=False, max_tokens=100)
        if result and result.strip() != "NOT_FOUND" and "@" in result:
            return result.strip()
        
        # Default fallback
        return f"privacy@{domain}"
    
    async def generate_deletion_email(
        self, 
        service_name: str,
        domain: str,
        user_email: str = "[YOUR_EMAIL]",
        regulation: str = "GDPR"
    ) -> Dict[str, str]:
        """
        Generate a personalized deletion request email.
        
        Args:
            service_name: Name of the service
            domain: Service domain
            user_email: User's email (placeholder by default)
            regulation: GDPR or CCPA
        
        Returns:
            Dict with subject and body
        """
        system_prompt = f"""You are an expert at writing data deletion request emails.
Generate a {regulation} compliant data deletion request email.
The email should be:
- Professional and polite
- Include proper legal references
- Request deletion within the legal timeframe (30 days for GDPR)
- Be concise (under 200 words)

Return a JSON object with:
{{
  "subject": "Email subject line",
  "body": "Full email body"
}}"""

        user_prompt = f"""Generate a {regulation} data deletion request for:
Service: {service_name}
Domain: {domain}
User Email: {user_email}
Date: Current date"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        result = await self._call_groq(messages)
        if result:
            try:
                parsed = json.loads(result)
                return {
                    "subject": parsed.get("subject", f"{regulation} Data Deletion Request - {service_name}"),
                    "body": parsed.get("body", self._get_default_email_body(service_name, user_email, regulation))
                }
            except json.JSONDecodeError:
                pass
        
        # Return default template
        return {
            "subject": f"{regulation} Data Deletion Request - {service_name}",
            "body": self._get_default_email_body(service_name, user_email, regulation)
        }
    
    def _get_default_email_body(
        self, 
        service_name: str, 
        user_email: str, 
        regulation: str
    ) -> str:
        """Get default deletion email template."""
        if regulation == "GDPR":
            return f"""Dear Data Protection Officer,

I am writing to formally request the deletion of all personal data associated with my account under Article 17 of the General Data Protection Regulation (GDPR) - Right to Erasure.

Account Email: {user_email}
Service: {service_name}

Please confirm receipt of this request and complete the deletion within 30 days as required by law.

I also request confirmation of:
1. What personal data you hold about me
2. Confirmation of deletion once completed
3. Information about any third parties with whom my data was shared

If you require additional verification, please respond to this email.

Thank you for your prompt attention to this matter.

Best regards"""
        else:  # CCPA
            return f"""To Whom It May Concern,

I am a California resident and am exercising my right to deletion under the California Consumer Privacy Act (CCPA), Section 1798.105.

I request that you delete all personal information you have collected about me.

Account Email: {user_email}
Service: {service_name}

Please confirm deletion within 45 days as required by law.

Thank you for your cooperation.

Sincerely"""


# Global instance
ai_client = AIClient()
