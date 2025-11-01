"""
Stripe webhook endpoints for payment processing
"""
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import stripe
import logging

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User, SubscriptionStatus

router = APIRouter()
logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Stripe webhook events
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle different event types
    event_type = event["type"]
    
    if event_type == "checkout.session.completed":
        await handle_checkout_completed(event["data"]["object"], db)
    elif event_type == "customer.subscription.updated":
        await handle_subscription_updated(event["data"]["object"], db)
    elif event_type == "customer.subscription.deleted":
        await handle_subscription_deleted(event["data"]["object"], db)
    elif event_type == "invoice.payment_failed":
        await handle_payment_failed(event["data"]["object"], db)
    
    return {"status": "success"}


async def handle_checkout_completed(session, db: AsyncSession):
    """Handle successful checkout"""
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")
    
    # Find user by Stripe customer ID
    result = await db.execute(
        select(User).where(User.stripe_customer_id == customer_id)
    )
    user = result.scalar_one_or_none()
    
    if user:
        user.subscription_status = SubscriptionStatus.ACTIVE
        await db.commit()
        logger.info(f"Activated subscription for user {user.email}")


async def handle_subscription_updated(subscription, db: AsyncSession):
    """Handle subscription updates"""
    customer_id = subscription.get("customer")
    status = subscription.get("status")
    
    result = await db.execute(
        select(User).where(User.stripe_customer_id == customer_id)
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Map Stripe status to our status
        if status == "active":
            user.subscription_status = SubscriptionStatus.ACTIVE
        elif status == "past_due":
            user.subscription_status = SubscriptionStatus.PAST_DUE
        elif status == "canceled":
            user.subscription_status = SubscriptionStatus.CANCELLED
        
        await db.commit()
        logger.info(f"Updated subscription status for user {user.email}: {status}")


async def handle_subscription_deleted(subscription, db: AsyncSession):
    """Handle subscription cancellation"""
    customer_id = subscription.get("customer")
    
    result = await db.execute(
        select(User).where(User.stripe_customer_id == customer_id)
    )
    user = result.scalar_one_or_none()
    
    if user:
        user.subscription_status = SubscriptionStatus.CANCELLED
        await db.commit()
        logger.info(f"Cancelled subscription for user {user.email}")


async def handle_payment_failed(invoice, db: AsyncSession):
    """Handle failed payments"""
    customer_id = invoice.get("customer")
    
    result = await db.execute(
        select(User).where(User.stripe_customer_id == customer_id)
    )
    user = result.scalar_one_or_none()
    
    if user:
        user.subscription_status = SubscriptionStatus.PAST_DUE
        await db.commit()
        logger.warning(f"Payment failed for user {user.email}")
