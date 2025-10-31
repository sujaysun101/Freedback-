# FeedbackFix System Architecture

## Overview

FeedbackFix is a full-stack web application that uses AI to translate vague client feedback into actionable design tasks. This document describes the technical architecture, design decisions, and system components.

## System Architecture Diagram

```
???????????????????????????????????????????????????????????????????
?                          CLIENT LAYER                            ?
???????????????????????????????????????????????????????????????????
?                                                                   ?
?  ????????????????????????????????????????????????????????????  ?
?  ?              Next.js 14 Frontend (Vercel)                ?  ?
?  ?  - React 18 + TypeScript                                 ?  ?
?  ?  - Tailwind CSS                                          ?  ?
?  ?  - Clerk Auth (Client SDK)                              ?  ?
?  ????????????????????????????????????????????????????????????  ?
?                            ? HTTPS                              ?
???????????????????????????????????????????????????????????????????
                                 ?
???????????????????????????????????????????????????????????????????
?                       APPLICATION LAYER                          ?
???????????????????????????????????????????????????????????????????
?                                                                   ?
?  ????????????????????????????????????????????????????????????  ?
?  ?           FastAPI Backend (Railway/Render)                ?  ?
?  ?                                                           ?  ?
?  ?  ??????????????  ??????????????  ???????????????????   ?  ?
?  ?  ?    API     ?  ?  Business  ?  ?   External      ?   ?  ?
?  ?  ?  Endpoints ???  Services  ???   Integrations  ?   ?  ?
?  ?  ?            ?  ?            ?  ?   - OpenAI      ?   ?  ?
?  ?  ? /auth      ?  ? - Auth     ?  ?   - Clerk       ?   ?  ?
?  ?  ? /projects  ?  ? - Translator?  ?   - Stripe      ?   ?  ?
?  ?  ? /feedback  ?  ? - Projects ?  ?                 ?   ?  ?
?  ?  ??????????????  ??????????????  ???????????????????   ?  ?
?  ?                                                           ?  ?
?  ????????????????????????????????????????????????????????????  ?
?                            ? SQL                                ?
???????????????????????????????????????????????????????????????????
                                 ?
???????????????????????????????????????????????????????????????????
?                          DATA LAYER                              ?
???????????????????????????????????????????????????????????????????
?                                                                   ?
?  ????????????????????????????????????????????????????????????  ?
?  ?        PostgreSQL 15 Database (Managed Service)          ?  ?
?  ?                                                           ?  ?
?  ?  Tables:                                                  ?  ?
?  ?  - users                                                  ?  ?
?  ?  - projects                                               ?  ?
?  ?  - feedback_inputs                                        ?  ?
?  ?  - generated_tasks                                        ?  ?
?  ?  - api_usage                                              ?  ?
?  ????????????????????????????????????????????????????????????  ?
?                                                                   ?
???????????????????????????????????????????????????????????????????
```

## Technology Stack Rationale

### Frontend: Next.js 14 + React

**Why Next.js?**
- Server-side rendering for better SEO (important for landing page)
- API routes for proxying backend requests
- Built-in optimization (image, font, code splitting)
- Easy Vercel deployment
- Great developer experience

**Why TypeScript?**
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Easier refactoring

### Backend: FastAPI + Python

**Why FastAPI over Node.js?**
- Python has superior ML/AI library ecosystem (OpenAI, transformers)
- FastAPI is as fast as Node.js (async support)
- Automatic API documentation (Swagger/OpenAPI)
- Type hints with Pydantic
- Easier to work with data processing

**Why async SQLAlchemy?**
- True async/await support
- Better performance under load
- Non-blocking database operations
- Future-proof architecture

### Database: PostgreSQL

**Why PostgreSQL over MongoDB?**
- Relational data (users ? projects ? feedback ? tasks)
- ACID compliance (important for billing)
- JSONb support for flexible metadata
- Mature tooling and ecosystem
- Better for complex queries and joins

### Authentication: Clerk

**Why Clerk over Auth0/Firebase?**
- Better developer experience
- Modern UI components
- Built-in user management dashboard
- Supports social login out of the box
- Generous free tier

### AI: OpenAI API

**Why OpenAI over open-source models?**
- Best-in-class language understanding
- Reliable JSON output
- Well-documented API
- Cost-effective for MVP
- Can switch to fine-tuned model later

## Data Flow

### 1. User Authentication Flow

```
User ? Next.js ? Clerk (Auth) ? JWT Token ? FastAPI
                                           ?
                                    Verify Token
                                           ?
                                    Get/Create User in DB
                                           ?
                                    Return User Object
```

### 2. Feedback Translation Flow (THE CORE FEATURE)

```
User submits feedback
    ?
Next.js validates input
    ?
POST /api/v1/feedback/translate
    ?
FastAPI verifies authentication
    ?
Check subscription status (active?)
    ?
Save feedback to database
    ?
Call TranslatorService
    ?
TranslatorService ? OpenAI API
    ?
OpenAI returns JSON tasks
    ?
Parse and save tasks to database
    ?
Return tasks to frontend
    ?
Display tasks to user
```

### 3. Payment Flow

```
User clicks Subscribe
    ?
Stripe Checkout (hosted)
    ?
Payment successful
    ?
Stripe webhook ? FastAPI
    ?
Verify webhook signature
    ?
Update user.subscription_status = 'active'
    ?
Redirect user to dashboard
```

## Database Schema Details

### Users Table
```sql
id: UUID (primary key)
email: VARCHAR (unique, indexed)
clerk_user_id: VARCHAR (unique, indexed)
stripe_customer_id: VARCHAR (unique, indexed)
subscription_status: ENUM (inactive, active, cancelled, past_due)
subscription_plan: ENUM (monthly, per_project, enterprise)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**Design Decisions:**
- UUID for security (non-sequential IDs)
- Clerk user ID for auth integration
- Stripe customer ID for payment integration
- Status enum for clear state management

### Projects Table
```sql
id: UUID (primary key)
user_id: UUID (foreign key ? users.id)
name: VARCHAR
description: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**Design Decisions:**
- Cascade delete (delete user ? delete projects)
- Simple structure for MVP
- Can add team collaboration later

### Feedback Inputs Table
```sql
id: UUID (primary key)
project_id: UUID (foreign key ? projects.id)
original_text: TEXT
source_type: ENUM (text, screenshot, email)
metadata: JSONB
created_at: TIMESTAMP
```

**Design Decisions:**
- JSONB metadata for flexible future features
- Source type for future screenshot/OCR feature
- Preserves original feedback for audit trail

### Generated Tasks Table
```sql
id: UUID (primary key)
input_id: UUID (foreign key ? feedback_inputs.id)
task_description: TEXT
is_completed: BOOLEAN
estimated_time_minutes: INTEGER
difficulty_level: ENUM (easy, medium, hard)
created_at: TIMESTAMP
completed_at: TIMESTAMP
```

**Design Decisions:**
- Links to feedback input (one-to-many)
- Completion tracking for user workflow
- Time estimates for project planning
- Difficulty for task prioritization

## Security Architecture

### Authentication & Authorization

1. **Frontend ? Backend**
   - Clerk JWT token in Authorization header
   - Token verified on every request
   - User object attached to request

2. **API Key Security**
   - OpenAI key only on backend
   - Stripe key only on backend
   - Never exposed to frontend

3. **Database Security**
   - Row-level security (user can only access their data)
   - SQL injection prevention (parameterized queries)
   - Encrypted connections

### Input Validation

1. **Frontend**
   - TypeScript type checking
   - Form validation (length, format)

2. **Backend**
   - Pydantic models for request validation
   - SQL injection prevention
   - XSS prevention (sanitize inputs)

### Rate Limiting (TODO)
- Rate limit on `/feedback/translate` (expensive)
- Per-user quotas based on subscription
- Implement with Redis + Upstash

## Scalability Considerations

### Current MVP (Handles ~1000 users)
- Single backend instance
- Managed PostgreSQL
- Serverless frontend (Vercel)

### Future Scaling (10,000+ users)

1. **Backend Scaling**
   - Horizontal scaling (multiple instances)
   - Load balancer (Railway/Render built-in)
   - Stateless design (no sessions)

2. **Database Scaling**
   - Read replicas for queries
   - Connection pooling
   - Database indexes (already added)

3. **Caching**
   - Redis for session cache
   - CDN for static assets (Vercel built-in)
   - API response caching for repeat queries

4. **AI API Optimization**
   - Batch requests when possible
   - Use GPT-3.5 for simple feedback
   - Cache common translations
   - Fine-tune custom model later

## Cost Analysis (MVP)

### Monthly Costs at Different Scales

**100 Users (Early)**
- Backend: $20 (Railway/Render)
- Database: $25 (Managed PostgreSQL)
- Vercel: $0 (free tier)
- Clerk: $0 (free tier)
- OpenAI: ~$50 (200 translations/day)
- **Total: ~$95/month**
- **Revenue: ~$7,900 (100 ? $79)**
- **Margin: 98.8%**

**1,000 Users (Growth)**
- Backend: $50 (scaled instance)
- Database: $50 (larger plan)
- Vercel: $20 (Pro plan)
- Clerk: $100 (paid tier)
- OpenAI: ~$500 (2000 translations/day)
- **Total: ~$720/month**
- **Revenue: ~$79,000 (1000 ? $79)**
- **Margin: 99.1%**

**10,000 Users (Scale)**
- Backend: $300 (multiple instances)
- Database: $200 (enterprise tier)
- Vercel: $100 (Team plan)
- Clerk: $500
- OpenAI: ~$5,000 (20k translations/day)
- **Total: ~$6,100/month**
- **Revenue: ~$790,000 (10k ? $79)**
- **Margin: 99.2%**

## Deployment Strategy

### Development Environment
```bash
docker-compose up
# All services run locally
# Hot reload for rapid development
```

### Staging Environment
- Branch: `staging`
- Auto-deploy from staging branch
- Use test API keys
- Separate database

### Production Environment
- Branch: `main`
- Manual deploy or CI/CD
- Production API keys
- Managed database with backups

## Monitoring & Observability

### Error Tracking
- Sentry for both frontend and backend
- Automatic error reporting
- User context attached

### Logging
- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARNING, ERROR
- CloudWatch or similar aggregation

### Metrics (Future)
- API response times
- Translation quality feedback
- User engagement metrics
- Revenue metrics

## Disaster Recovery

### Backups
- Database: Daily automated backups (7-day retention)
- Code: Git repository (multiple copies)
- Configs: Encrypted in 1Password/vault

### Recovery Time Objective (RTO)
- Target: < 1 hour
- Database restore: ~15 minutes
- Backend redeploy: ~10 minutes
- Frontend redeploy: ~5 minutes

### Recovery Point Objective (RPO)
- Target: < 24 hours
- Database: Point-in-time recovery
- User data: No data loss (ACID compliance)

## Future Architecture Enhancements

### Phase 3 Additions
1. **Screenshot Upload**
   - S3/CloudFlare R2 for storage
   - OCR with Google Vision API
   - Image preprocessing

2. **Real-time Updates**
   - WebSockets for live task updates
   - Socket.io or Pusher
   - Optimistic UI updates

### Phase 4 Additions
1. **API Integrations**
   - OAuth flows for Figma, Asana, Trello
   - Webhook receivers
   - Rate limiting per integration

2. **AI Improvements**
   - Fine-tuned model on design feedback corpus
   - Feedback quality scoring
   - Learning from user corrections

### Phase 5 Additions
1. **Enterprise Features**
   - Multi-tenant architecture
   - Team management
   - SSO (SAML)
   - Custom domains

2. **Analytics Dashboard**
   - Usage analytics
   - Translation accuracy metrics
   - ROI calculator for clients

## Conclusion

This architecture is designed for:
- **Rapid MVP Development**: Simple, proven technologies
- **Cost Efficiency**: High margins even at scale
- **Developer Experience**: Modern tools, good documentation
- **Scalability**: Can grow to 100k+ users with minimal changes
- **Maintainability**: Clear separation of concerns, typed languages

The key architectural decision is using Python/FastAPI for the backend specifically because of its superior AI/ML ecosystem, which is the core value proposition of FeedbackFix.
