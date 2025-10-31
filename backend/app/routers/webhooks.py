from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import Response
import stripe
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

load_dotenv()

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")


@router.post("/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_id = session.get("customer")
        customer_email = session.get("customer_details", {}).get("email")
        
        # Update user subscription status
        if customer_email:
            user = db.query(User).filter(User.email == customer_email).first()
            if user:
                user.stripe_customer_id = customer_id
                user.subscription_status = "active"
                db.commit()
    
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        customer_id = subscription.get("customer")
        
        # Update user subscription status
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            user.subscription_status = "canceled"
            db.commit()
    
    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        customer_id = subscription.get("customer")
        status = subscription.get("status")
        
        # Update user subscription status
        user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
        if user:
            if status == "active":
                user.subscription_status = "active"
            elif status == "canceled" or status == "past_due":
                user.subscription_status = "canceled"
            db.commit()
    
    return Response(status_code=200)
