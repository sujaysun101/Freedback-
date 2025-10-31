# Frontend UX, GTM Assets, and Roadmap (Phases 4-6)

## Frontend UX Plan (Phase 4)

### Core Screens

- **Landing Page**: Marketing site at `/` highlighting value prop, before/after translation example, pricing CTA.
- **Auth Pages**: Sign-in/sign-up forms styled with Supabase UI components and brand system.
- **Dashboard (Project List)**: Displays existing projects, create-new button, subscription status banner.
- **Project Detail**: Textarea input, translation history timeline, task list output cards, copy buttons.

### Wireframe Highlights

- Use 12-column grid, 1200px max width, responsive breakpoints at 768px and 1024px.
- Primary CTA color: electric violet (#6C38FF), secondary accent for copy buttons (#1F1B2E).
- Typography: Inter (UI), Space Grotesk (display headings).
- Components: `Navbar`, `ProjectCard`, `FeedbackInputForm`, `TaskList`, `TaskCard`, `SubscriptionBanner`.
- States: loading spinner + skeleton cards while translation pending; empty states for new projects and no tasks yet.

### State Management

- Global auth state via Supabase client; React Context or Zustand to cache active project and translation history.
- SWR/React Query for `/projects` and `/feedback-inputs` endpoints with optimistic updates when submitting translations.

### Accessibility

- Buttons and interactive elements meet WCAG 2.1 AA contrast.
- Keyboard navigation for task list copying; aria-live region for translation success messages.
- Provide descriptive labels and helper text on input textarea.

## GTM Asset Plan (Phase 5)

### Payment Integration

- `Subscribe` button on dashboard gating translator for inactive users.
- Stripe Checkout session created via `/api/billing/create-session`; Post-success redirect to `/dashboard`.
- Stripe webhook (`/api/stripe-webhook`) updates `subscription_status` and triggers confirmation email.

### Landing Page Content Blocks

1. **Hero**: Headline ?Turn ?make it pop? into actionable tasks in seconds? with GIF of translation workflow.
2. **How It Works**: Three-step diagram (Upload Feedback ? AI Translation ? Copy Tasks).
3. **Before/After Slider**: Interactive component comparing raw feedback to JSON output cards.
4. **Integrations Preview**: Logos of Figma, Asana, Trello with ?Coming Soon? tags.
5. **Pricing**: Single plan with features list and FAQ about per-project add-on.
6. **Social Proof**: Rotating quotes sourced from early design partners.

### Viral Content Concepts (5 Pieces)

1. ?Client says ?give it more oomph? ? FeedbackFix output? short-form video.
2. Screenshot carousel of the worst client comments from Reddit with translations.
3. Designer reaction meme + overlay showing time saved (TikTok/Reels).
4. Tutorial clip embedding tool into a real Figma workflow.
5. Side-by-side comparison: manual Asana task writing vs. FeedbackFix auto-generated tasks.

### Partnerships

- Target design YouTubers for sponsored walkthroughs.
- Offer affiliate commission for agencies referencing early access landing page.

## Roadmap & Future Vision (Phase 6)

### API Integration Plan (V2)

- Implement OAuth flows for Trello and Asana using respective SDKs; store refresh tokens encrypted.
- ?Send to Trello/Asana? buttons map tasks into boards/projects with status selection modal.
- Figma plugin MVP: allows designers to push selected frame feedback to backend and receive annotations.

### Feature Spec: Freedback Project Scoper

- Accept initial client brief (text or PDF parsed via OCR).
- Output: proposed scope (milestones, deliverables), estimated hours by phase, suggested pricing tiers.
- Adds risk flags (e.g., vague branding, missing assets) with recommendation checklist.

### Feature Spec: Freedback Enterprise

- Team management: admin roles, invite designers, assign client workspaces.
- Client portal: share translator outputs, educate clients with ?How to give better feedback? modules.
- Revision tracking: limit count per scope, auto-notify when threshold exceeded.
- Centralized billing: consolidated invoices, usage dashboards, SLA reports.

### Expansion Metrics

- Track adoption of integrations, average tasks exported per project, churn by segment.
- Use telemetry to surface most-requested clarifications, feeding future prompt tuning and training data.
