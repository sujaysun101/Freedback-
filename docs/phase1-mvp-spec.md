# Phase 1: MVP Feature Specification

## MVP Scope Definition

The MVP focuses on validating the core value proposition: translating vague client feedback into actionable design tasks.

### MVP Principles
1. **Minimum**: Only features necessary to validate core hypothesis
2. **Viable**: Good enough for early adopters to pay
3. **Fast**: Launch within 8-12 weeks

## MVP Features (IN)

### ? User Management
- **Sign Up**: Email + password registration
- **Log In**: Email + password authentication
- **User Dashboard**: Basic user info display
- **Subscription Status**: Track active/inactive subscription

**Justification**: Required for subscription billing and user data isolation.

### ? Feedback Input
- **Text Area**: Simple text input for pasting client feedback
- **Project Association**: Link feedback to a project

**Justification**: Core input method. Screenshot OCR can wait.

### ? AI Translation Engine
- **GPT-4 Integration**: Use OpenAI API for translation
- **Structured Output**: JSON array of actionable tasks
- **Design Context**: Prompt engineered for design terminology

**Justification**: This is the core magic. Must work well.

### ? Task Display
- **Task List**: Show generated tasks in readable format
- **Copy Function**: One-click copy individual tasks
- **Task Persistence**: Save tasks to database

**Justification**: Users need to see and use the translated tasks.

### ? Project Management (Basic)
- **Create Project**: Simple project creation
- **Project List**: View all user projects
- **Project Selection**: Select project when translating feedback

**Justification**: Users need to organize their work.

### ? Payment Integration
- **Stripe Checkout**: Redirect to Stripe payment page
- **Single Plan**: $79/month subscription only
- **Webhook Handling**: Process subscription events
- **Access Control**: Protect translation feature behind subscription

**Justification**: Required for monetization. Single plan simplifies MVP.

## Post-MVP Features (OUT)

### ? Screenshot/Image Upload
- **Reason**: Complex, can validate with text first
- **Priority**: Phase 2 feature

### ? Direct Figma Integration
- **Reason**: Requires OAuth and API complexity
- **Priority**: Phase 3 feature

### ? Direct Asana/Trello Integration
- **Reason**: Multiple integrations add complexity
- **Priority**: Phase 3 feature (pick one to start)

### ? Per-Project Pricing
- **Reason**: Complicates billing, single plan is simpler
- **Priority**: Phase 2 if requested by users

### ? Difficulty/Time Estimates
- **Reason**: Nice-to-have, not core value prop
- **Priority**: Phase 2 feature

### ? Enterprise Features
- **Reason**: Not targeting enterprise in MVP
- **Priority**: Phase 4 feature

### ? Client Education Portal
- **Reason**: Too complex for MVP
- **Priority**: Phase 3 feature

### ? Revision Tracking
- **Reason**: Can track in tasks for now
- **Priority**: Phase 2 feature

## User Flows (MVP)

### Flow 1: New User Registration
1. User visits landing page
2. Clicks "Get Started"
3. Enters email + password
4. Account created, redirected to dashboard
5. Sees subscription prompt (inactive status)
6. Clicks "Subscribe" ? Stripe Checkout
7. After payment, subscription status = active

### Flow 2: Translate Feedback (Active User)
1. User logs in
2. Creates or selects a project
3. Pastes client feedback in text area
4. Clicks "Translate to Tasks"
5. Sees loading state
6. Sees generated task list
7. Clicks "Copy" on individual tasks
8. Tasks saved to project

### Flow 3: Inactive User Attempt
1. User logs in (subscription_status = inactive)
2. Tries to translate feedback
3. Sees error: "Active subscription required"
4. Redirected to subscribe button

## Technical Constraints (MVP)

### Backend
- FastAPI (Python)
- PostgreSQL database
- OpenAI GPT-4 API
- Stripe API

### Frontend
- Next.js 14 (React)
- Tailwind CSS
- Zustand for state management
- Axios for API calls

### Deployment
- Frontend: Vercel
- Backend: Railway or Render
- Database: Railway PostgreSQL or Supabase

## Success Metrics (MVP)

### Product Metrics
- **Translation Quality**: Users copy at least 2 tasks per translation
- **Conversion Rate**: 5% of free users convert to paid
- **Retention**: 60% of users active after 30 days

### Business Metrics
- **MRR Target**: $5,000 in first 3 months (60-70 users)
- **CAC**: < $50 per customer (content marketing focus)
- **Churn**: < 10% monthly churn

## MVP Timeline

### Weeks 1-2: Foundation
- Set up project structure
- Database schema
- Authentication system

### Weeks 3-4: Core Features
- AI translation engine
- Feedback input UI
- Task display

### Weeks 5-6: Polish & Payment
- Stripe integration
- Landing page
- Testing & bug fixes

### Weeks 7-8: Launch Prep
- Beta testing
- Content creation
- Launch strategy execution

## MVP Acceptance Criteria

### Must Have
- ? User can register and log in
- ? User can create projects
- ? User can translate feedback into tasks
- ? User can copy tasks to clipboard
- ? User can subscribe via Stripe
- ? Translation quality is useful (subjective but critical)

### Nice to Have
- ?? Email verification
- ?? Password reset
- ?? Project deletion
- ?? Task completion tracking

## MVP Risks & Mitigation

### Risk 1: Translation Quality
- **Risk**: AI produces generic or unhelpful tasks
- **Mitigation**: Extensive prompt engineering, user feedback loop

### Risk 2: Slow API Response
- **Risk**: OpenAI API is slow, poor UX
- **Mitigation**: Loading states, consider GPT-3.5-turbo for speed

### Risk 3: Payment Issues
- **Risk**: Stripe integration bugs prevent subscriptions
- **Mitigation**: Thorough testing, manual override capability

### Risk 4: No Market Demand
- **Risk**: Designers don't see value
- **Mitigation**: Pre-launch validation, Reddit/Discord discussions
