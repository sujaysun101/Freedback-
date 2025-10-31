# Translator Engine: Prompting & API Design (Phase 3)

## Objectives

- Convert vague client feedback into deterministic, structured tasks.
- Maintain high precision with minimal hallucination through constrained prompts and JSON schema enforcement.
- Provide a robust backend API that authenticates users, persists data, and surfaces actionable errors.

## Prompt Engineering Strategy (Phase 3.1)

### System Prompt Template

```
You are FeedbackFix, an expert art director translating vague client feedback for designers.
Always respond in JSON array format: [{"task": "..."}].
Rules:
- Use specific, actionable language and measurable adjustments when possible.
- Reference visual design terminology (typography, layout, color, imagery, spacing).
- Generate 2-5 tasks; merge redundant ideas.
- Do not include explanations outside of JSON.
- If the input is unrelated to design feedback, return an empty array.
```

### User Prompt Template

```
Client feedback: "{{feedback_text}}"

Context:
- Project type: {{project_type | default("unspecified")}}
- Brand traits: {{brand_traits | default("unspecified")}}

Return only JSON.
```

### Guardrails & Post-Processing

- **JSON Enforcement**: Use OpenAI function calling or `response_format={"type": "json_object"}` to ensure parseable output.
- **Validation**: Pydantic schema requiring non-empty `task` strings; reject if parsing fails.
- **Determinism**: Use `temperature=0.3`, `top_p=0.9` for balanced creativity/stability.
- **Task Deduplication**: Normalize whitespace, lowercase, and deduplicate before persistence.
- **Feedback Types**: Classify input (layout, color, typography, copy) using zero-shot labels to support analytics (post-MVP).

### Iterative Improvement Loop

1. Seed prompt with curated dataset from Phase 1.1.
2. Collect human evaluation on 50 samples; annotate success/fail.
3. Adjust instructions or add few-shot examples for failure cases.
4. Log outputs and build regression suite for prompts using unit tests.

## Backend API Design (Phase 3.2)

### Endpoint

- **Route**: `POST /api/translate`
- **Auth**: Bearer JWT from Supabase; middleware verifies active session and `subscription_status='active'`.

### Request Body

```json
{
  "projectId": "uuid",
  "inputText": "string (<= 2000 chars)"
}
```

### Response (Success)

```json
{
  "inputId": "uuid",
  "tasks": [
    {
      "id": "uuid",
      "task": "Increase headline contrast by selecting a bolder weight and darker color."
    },
    {
      "id": "uuid",
      "task": "Add 24px padding around the CTA button to create breathing room."
    }
  ]
}
```

### Error Responses

| Status | Code | Description |
| --- | --- | --- |
| 400 | `invalid_input` | Missing project ID, input too long, or empty text. |
| 401 | `unauthorized` | Missing/invalid token. |
| 402 | `subscription_inactive` | User lacks active subscription. |
| 422 | `llm_parse_error` | LLM returned invalid JSON after retries. |
| 500 | `translation_failed` | OpenAI API error or unexpected exception. |

### Processing Flow

1. Validate JWT and subscription.
2. Confirm project belongs to user.
3. Persist `feedback_inputs` record with `original_text`.
4. Call Translator Service (`translator_service.translate(feedback_text)`).
5. Validate JSON payload; on failure, retry once with fallback instructions.
6. Store tasks in `generated_tasks` linked to `input_id`.
7. Return response with task IDs and descriptions.

### Translator Service Responsibilities

- Construct system + user prompt using templates.
- Invoke OpenAI SDK with safety settings (timeout, max retries, request logging without PII).
- Validate and clean response (strip trailing punctuation, ensure sentence case).
- Emit application metrics (latency, tokens, retry count) to logging stack.

### Security & Compliance

- Rate-limit endpoint per user (e.g., 30 requests/hour) using Redis or Postgres advisory locks.
- Mask client feedback in logs (store hashed reference + encrypted blob for debugging).
- Comply with Stripe webhook events to disable access automatically when subscription lapses.

### Testing Strategy

- **Unit Tests**: Mock OpenAI responses to verify validation and persistence logic.
- **Integration Tests**: Use test database + VCR to simulate OpenAI responses during CI.
- **Prompt Regression Suite**: Maintain fixtures of sample inputs with expected JSON outputs; fail build on schema drift.
