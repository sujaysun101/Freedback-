# FeedbackFix MVP Specification (Phase 1.3)

## Product Goal

Translate vague client feedback into clear, actionable design tasks so designers and agencies reduce revision cycles and scope ambiguity.

## Primary Personas

- **Freelance Designer (primary)**: needs fast translation of client emails into to-do lists.
- **Agency Account/Project Manager**: wants consistent interpretation for team members and traceable tasks.

## User Journey (MVP)

1. User signs in / signs up.
2. User selects or creates a project.
3. User pastes client feedback text into translator input.
4. System returns structured task list.
5. User copies tasks into existing workflow tool (manual copy for MVP).
6. Subscription status determines continued access.

## Functional Requirements

### Authentication & Billing Gate

- Users must authenticate before accessing core translator features.
- Subscription status must be checked before allowing translation requests.

### Project & Feedback Management

- Users can create and select projects (minimal metadata: name, optional description).
- Each translation request is stored as `feedback_input` linked to a project.
- Generated tasks persist and can be viewed later within the project.

### Feedback Translation

- Input: plaintext up to 2,000 characters (MVP limit) pasted into textarea.
- Output: JSON array of tasks rendered as list cards (task body only in MVP).
- System uses curated prompt and dataset heuristics to instruct LLM.
- Translation errors surface actionable error message with retry guidance.

### Task Management (Read-Only)

- Display generated tasks in chronological order (newest first).
- Allow user to manually copy individual tasks or entire list via simple copy-to-clipboard button.
- Marking tasks complete is deferred post-MVP (read-only presentation).

### Billing

- Support a single plan at $79/month.
- During checkout, collect email and payment via Stripe Checkout.
- Backend webhook listens for successful subscription events and updates `subscription_status`.

## Non-Functional Requirements

- **Security**: Auth tokens secured (Supabase/Clerk/Firebase). LLM API keys stored server-side.
- **Performance**: Translator response target < 6 seconds (excluding Stripe/LLM network latency).
- **Reliability**: Retry logic for LLM calls (1 retry) with exponential backoff.
- **Compliance**: GDPR-ready data deletion path (manual process acceptable in MVP).

## In-Scope vs. Out-of-Scope

| Area | In Scope (MVP) | Out of Scope (Post-MVP) |
| --- | --- | --- |
| Input Types | Text pasted into textarea | Image/screenshot uploads, audio transcripts |
| AI Output | Task list (description only) | Difficulty estimates, time estimates, prioritization |
| Integrations | Manual copy to external tools | Direct API pushes to Figma, Asana, Trello |
| Pricing | Single subscription ($79/mo) | Pay-per-project, enterprise tiers |
| UI | Core dashboard, project selector, translator view | Advanced analytics, client portal |
| Task Management | View-only, copy actions | Editing tasks, assigning members, completion states |
| Auth | Email/password or third-party auth provider | SSO, team accounts, client seats |

## Acceptance Criteria

- Authenticated user with active subscription can create project, submit feedback, and receive at least one actionable task.
- Translation results persist and can be revisited after page refresh.
- Stripe Checkout successfully updates subscription status via webhook.
- Non-subscribed or inactive users are redirected to subscription flow.
- Invalid LLM responses trigger graceful error handling with retry option.

## Open Questions

- Should MVP support tagging or categorizing tasks? (Assumed no; gather user feedback.)
- What is acceptable storage duration for feedback/task history under privacy expectations? (Default 12 months unless user deletes.)
- Which auth provider best accelerates build (Supabase vs. Clerk)? (Decision captured in technical architecture doc.)

## KPIs for Post-Launch Evaluation

- Time saved per translation (self-reported) compared to manual translation.
- Number of active translation sessions per subscriber per week.
- Conversion rate from free trial (if added) to paid subscription.
- Qualitative feedback on accuracy (target >80% ?usable without edits?).
