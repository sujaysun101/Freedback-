from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
import stripe
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.routers.auth import get_current_user

load_dotenv()

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


@router.post("/create-checkout-session")
def create_checkout_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe checkout session for subscription"""
    if current_user.subscription_status == "active":
        raise HTTPException(status_code=400, detail="User already has an active subscription")
    
    try:
        # Get or create Stripe customer
        if current_user.stripe_customer_id:
            customer_id = current_user.stripe_customer_id
        else:
            customer = stripe.Customer.create(
                email=current_user.email,
                metadata={"user_id": str(current_user.id)}
            )
            customer_id = customer.id
            current_user.stripe_customer_id = customer_id
            db.commit()
        
        # Create checkout session
        # Replace with your actual Stripe price ID from Stripe dashboard
        price_id = os.getenv("STRIPE_PRICE_ID", "price_1234567890")
        
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/dashboard?success=true",
            cancel_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + "/subscribe?canceled=true",
            metadata={"user_id": str(current_user.id)},
        )
        
        return {"sessionId": checkout_session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create checkout session: {str(e)}")
