"""
Stripe payment integration service
"""

import stripe
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from models import User

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Monthly subscription price: $79/month
MONTHLY_PRICE_ID = os.getenv("STRIPE_MONTHLY_PRICE_ID", "price_monthly_79")

# In production, you'll need to create this price in Stripe dashboard:
# Price: $79.00 USD
# Billing period: Monthly


async def create_checkout_session(user_id: str, user_email: str, db: Session) -> str:
    """
    Create a Stripe Checkout session for subscription
    
    Args:
        user_id: User UUID
        user_email: User email
        db: Database session
        
    Returns:
        Checkout session URL
    """
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Create or retrieve Stripe customer
        customer_id = user.stripe_customer_id
        
        if not customer_id:
            customer = stripe.Customer.create(
                email=user_email,
                metadata={"user_id": str(user_id)}
            )
            customer_id = customer.id
            user.stripe_customer_id = customer_id
            db.commit()
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': MONTHLY_PRICE_ID,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/dashboard?subscription=success",
            cancel_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/dashboard?subscription=canceled",
            metadata={"user_id": str(user_id)}
        )
        
        return session.url
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )


async def handle_webhook(request: dict) -> dict:
    """
    Handle Stripe webhook events
    
    Webhook events to handle:
    - checkout.session.completed: Initial subscription
    - customer.subscription.updated: Subscription status changes
    - customer.subscription.deleted: Subscription canceled
    - invoice.payment_succeeded: Successful payment
    - invoice.payment_failed: Failed payment
    """
    from database import SessionLocal
    
    event = request.get("event")
    event_type = event.get("type") if isinstance(event, dict) else None
    
    if not event_type:
        # In production, verify webhook signature here
        # sig_header = request.headers.get("stripe-signature")
        # event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        return {"status": "error", "message": "Invalid webhook event"}
    
    db = SessionLocal()
    
    try:
        data = event.get("data", {}).get("object", {})
        
        if event_type == "checkout.session.completed":
            # New subscription created
            customer_id = data.get("customer")
            metadata = data.get("metadata", {})
            user_id = metadata.get("user_id")
            
            if user_id:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    user.stripe_customer_id = customer_id
                    user.subscription_status = "active"
                    db.commit()
        
        elif event_type == "customer.subscription.updated":
            # Subscription status changed
            customer_id = data.get("customer")
            subscription_status = data.get("status")
            
            # Map Stripe status to our status
            status_map = {
                "active": "active",
                "canceled": "canceled",
                "past_due": "past_due",
                "unpaid": "inactive"
            }
            
            mapped_status = status_map.get(subscription_status, "inactive")
            
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                user.subscription_status = mapped_status
                db.commit()
        
        elif event_type == "customer.subscription.deleted":
            # Subscription canceled
            customer_id = data.get("customer")
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                user.subscription_status = "canceled"
                db.commit()
        
        elif event_type == "invoice.payment_succeeded":
            # Payment successful
            customer_id = data.get("customer")
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                user.subscription_status = "active"
                db.commit()
        
        elif event_type == "invoice.payment_failed":
            # Payment failed
            customer_id = data.get("customer")
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                user.subscription_status = "past_due"
                db.commit()
        
        return {"status": "success"}
        
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
