# Phase 6: API Integration Plan (V2)

## Overview
Integration with Figma, Asana, and Trello to send translated tasks directly to users' existing workflows.

## Figma Integration

### Technical Specifications

#### Authentication Flow
1. User clicks "Connect Figma" in settings
2. Redirect to Figma OAuth authorization URL:
   ```
   https://www.figma.com/oauth?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=file_read,comments_write&response_type=code&state={STATE}
   ```
3. User authorizes access
4. Figma redirects with authorization code
5. Exchange code for access token:
   ```
   POST https://www.figma.com/api/oauth/token
   Body: {
     client_id: CLIENT_ID,
     client_secret: CLIENT_SECRET,
     redirect_uri: REDIRECT_URI,
     code: AUTHORIZATION_CODE,
     grant_type: "authorization_code"
   }
   ```
6. Store access token and refresh token in database

#### API Endpoints to Use
- **Get User Info**: `GET /v1/me`
- **Get Files**: `GET /v1/files/{file_key}`
- **Get Comments**: `GET /v1/files/{file_key}/comments`
- **Post Comment**: `POST /v1/files/{file_key}/comments`

#### Database Schema Addition
```sql
CREATE TABLE figma_integrations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Implementation Flow
1. User translates feedback
2. UI shows "Send to Figma" button (if connected)
3. User selects target Figma file/frame (via API file browser)
4. Backend creates comments on selected frame:
   ```python
   async def post_figma_comment(file_key: str, node_id: str, message: str):
       headers = {"Authorization": f"Bearer {access_token}"}
       response = await httpx.post(
           f"https://api.figma.com/v1/files/{file_key}/comments",
           headers=headers,
           json={"message": message, "client_meta": {"x": 0, "y": 0}}
       )
   ```
5. Each task becomes a separate comment on the frame

### Error Handling
- Token expiration: Use refresh token to get new access token
- Invalid file_key: Show error, allow user to reselect
- Rate limiting: Queue requests, retry with exponential backoff

---

## Asana Integration

### Technical Specifications

#### Authentication Flow
1. User clicks "Connect Asana" in settings
2. Redirect to Asana OAuth authorization:
   ```
   https://app.asana.com/-/oauth_authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code
   ```
3. User authorizes
4. Exchange code for token (similar to Figma)
5. Store token in database

#### API Endpoints to Use
- **Get Workspaces**: `GET /api/1.0/workspaces`
- **Get Projects**: `GET /api/1.0/projects`
- **Get Tasks**: `GET /api/1.0/tasks`
- **Create Task**: `POST /api/1.0/tasks`

#### Database Schema Addition
```sql
CREATE TABLE asana_integrations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    workspace_id TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Implementation Flow
1. User translates feedback
2. UI shows "Send to Asana" button (if connected)
3. User selects target Asana project (via API project list)
4. Backend creates tasks in Asana project:
   ```python
   async def create_asana_task(project_id: str, name: str, notes: str):
       headers = {"Authorization": f"Bearer {access_token}"}
       response = await httpx.post(
           "https://app.asana.com/api/1.0/tasks",
           headers=headers,
           json={
               "data": {
                   "name": name,
                   "notes": notes,
                   "projects": [project_id]
               }
           }
       )
   ```
5. Each translated task becomes an Asana task

### Task Mapping
- **Task Name**: Truncated task description (first 50 chars)
- **Task Notes**: Full task description
- **Project**: User-selected project
- **Assignee**: Optional (user can set default assignee)

---

## Trello Integration

### Technical Specifications

#### Authentication Flow
1. User clicks "Connect Trello" in settings
2. Redirect to Trello authorization:
   ```
   https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=FeedbackFix&key={API_KEY}&return_url={RETURN_URL}
   ```
3. User authorizes (simpler than OAuth, returns token directly)
4. Store token in database

#### API Endpoints to Use
- **Get Boards**: `GET /1/members/me/boards`
- **Get Lists**: `GET /1/boards/{board_id}/lists`
- **Get Cards**: `GET /1/lists/{list_id}/cards`
- **Create Card**: `POST /1/cards`

#### Database Schema Addition
```sql
CREATE TABLE trello_integrations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    access_token TEXT NOT NULL,
    board_id TEXT,
    list_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Implementation Flow
1. User translates feedback
2. UI shows "Send to Trello" button (if connected)
3. User selects target Trello board and list (via API)
4. Backend creates cards in Trello list:
   ```python
   async def create_trello_card(list_id: str, name: str, desc: str):
       params = {
           "key": TRELLO_API_KEY,
           "token": access_token,
           "name": name,
           "desc": desc,
           "idList": list_id
       }
       response = await httpx.post(
           "https://api.trello.com/1/cards",
           params=params
       )
   ```
5. Each translated task becomes a Trello card

### Card Mapping
- **Card Name**: Task description
- **Card Description**: Full task with context
- **List**: User-selected list (e.g., "To Do", "Design Tasks")
- **Labels**: Optional, user can set default labels

---

## Common Integration Patterns

### Backend Service Structure
```python
# services/integrations/base.py
class BaseIntegration:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.integration = self.get_integration_from_db()
    
    async def send_tasks(self, tasks: List[str], target_id: str):
        """Send tasks to the integration platform"""
        raise NotImplementedError
    
    def is_connected(self) -> bool:
        return self.integration is not None
```

### Frontend Component
```tsx
// components/IntegrationButtons.tsx
export function IntegrationButtons({ tasks }: { tasks: Task[] }) {
  const { figmaConnected, asanaConnected, trelloConnected } = useIntegrations();
  
  return (
    <div className="flex gap-2">
      {figmaConnected && <SendToFigmaButton tasks={tasks} />}
      {asanaConnected && <SendToAsanaButton tasks={tasks} />}
      {trelloConnected && <SendToTrelloButton tasks={tasks} />}
      <ConnectIntegrationButton />
    </div>
  );
}
```

### Settings Page
- Show connection status for each integration
- "Connect" button if not connected
- "Disconnect" button if connected
- Configure default project/board/list

---

## Security Considerations

### Token Storage
- Encrypt tokens at rest
- Use environment variables for API keys/secrets
- Implement token refresh before expiration

### Scope Limitation
- Request minimum necessary permissions
- Document required scopes clearly
- Allow users to revoke access

### Rate Limiting
- Respect API rate limits
- Implement request queuing
- Show user-friendly errors for rate limit hits

---

## Implementation Priority

1. **Trello** (Easiest)
   - Simple token-based auth
   - Straightforward API
   - Good for MVP integration

2. **Asana** (Medium)
   - OAuth flow required
   - More complex API structure
   - Popular with design teams

3. **Figma** (Complex)
   - Requires understanding of Figma file structure
   - Comment API can be tricky
   - Highest value for designers

## Testing Strategy

### Unit Tests
- Mock API responses
- Test token refresh logic
- Test error handling

### Integration Tests
- Use test accounts for each platform
- Test full OAuth flow
- Test task creation end-to-end

### User Testing
- Beta test with 10-20 users
- Collect feedback on UX
- Iterate on connection flow
