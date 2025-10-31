# Contributing to FeedbackFix

Thank you for your interest in contributing to FeedbackFix! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Set up your development environment**
   - Follow the instructions in `GETTING_STARTED.md`
   - Ensure all tests pass before making changes

2. **Pick an issue or feature**
   - Check `TODO.md` for current sprint tasks
   - Check GitHub Issues for open bugs/features
   - Comment on the issue to claim it

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Branch Naming

- Features: `feature/descriptive-name`
- Bug fixes: `fix/bug-description`
- Documentation: `docs/what-changed`
- Refactoring: `refactor/what-changed`

### Commit Messages

Use clear, descriptive commit messages:

```
Type: Brief description

Detailed explanation of what changed and why.

- Bullet points for specific changes
- Reference issues: Fixes #123
```

**Types:**
- `Add`: New feature
- `Update`: Enhancement to existing feature
- `Fix`: Bug fix
- `Refactor`: Code restructuring
- `Test`: Adding or updating tests
- `Docs`: Documentation changes
- `Style`: Code style changes (formatting)

**Examples:**
```
Add: User profile page with avatar upload

Implements the user profile page where users can:
- View their account information
- Upload and change their avatar
- Update email preferences

Closes #45
```

## Code Style

### Python (Backend)

- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use descriptive variable names

```python
# Good
async def get_user_projects(user_id: UUID) -> List[Project]:
    """Fetch all projects for a user."""
    result = await db.execute(
        select(Project).where(Project.user_id == user_id)
    )
    return result.scalars().all()

# Bad
async def get_proj(u):
    r = await db.execute(select(Project).where(Project.user_id == u))
    return r.scalars().all()
```

**Format before committing:**
```bash
cd backend
black app/
flake8 app/
mypy app/
```

### TypeScript/React (Frontend)

- Use TypeScript for all files
- Use functional components with hooks
- Prefer named exports over default exports
- Use proper typing (avoid `any`)

```typescript
// Good
interface Props {
  title: string;
  onSubmit: (data: FeedbackData) => void;
}

export const FeedbackForm: React.FC<Props> = ({ title, onSubmit }) => {
  // Component code
}

// Bad
export default function Form({ title, onSubmit }: any) {
  // Component code
}
```

**Format before committing:**
```bash
cd frontend
npm run lint
npm run type-check
```

## Testing

### Backend Tests

**Write tests for:**
- All service functions
- All API endpoints
- Database models
- Edge cases and error handling

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/test_translator.py -v

# Run with coverage
pytest --cov=app tests/
```

**Test structure:**
```python
def test_translate_feedback_success():
    """Test successful feedback translation."""
    # Arrange
    service = TranslatorService()
    feedback = "make it pop"
    
    # Act
    result = await service.translate_feedback(feedback)
    
    # Assert
    assert len(result) > 0
    assert "task" in result[0]
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks**
   ```bash
   # Backend
   cd backend
   black app/
   flake8 app/
   pytest
   
   # Frontend
   cd frontend
   npm run lint
   npm run type-check
   npm run build
   ```

3. **Push your changes**
   ```bash
   git push origin your-branch
   ```

4. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Link related issues
   - Request review

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Bullet list of specific changes
- Reference files changed
- Explain any complex logic

## Testing
- [ ] Added new tests
- [ ] All tests pass
- [ ] Manually tested

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
```

## Review Process

### For Reviewers

- Check code quality and style
- Test functionality locally
- Verify tests pass
- Look for edge cases
- Provide constructive feedback
- Approve or request changes

### For Authors

- Respond to all comments
- Make requested changes
- Re-request review after changes
- Be open to feedback
- Thank reviewers

## Database Migrations

When changing the database schema:

1. **Create migration**
   ```bash
   cd backend
   alembic revision -m "description of change"
   ```

2. **Edit migration file**
   - Add upgrade logic
   - Add downgrade logic

3. **Test migration**
   ```bash
   alembic upgrade head
   alembic downgrade -1
   alembic upgrade head
   ```

4. **Document in PR**
   - Explain schema changes
   - Note any data migrations needed
   - Warn about breaking changes

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying architecture
- Fixing bugs (if docs were wrong)

**Files to update:**
- `README.md` - High-level changes
- `ARCHITECTURE.md` - System design changes
- `GETTING_STARTED.md` - Setup process changes
- `API.md` - API changes
- Code comments - Complex logic

## Security

### Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead:
1. Email: security@feedbackfix.com
2. Describe the vulnerability
3. Provide steps to reproduce
4. Suggest a fix (if known)

### Security Best Practices

- Never commit API keys or secrets
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines
- Keep dependencies updated

## Getting Help

- **Questions**: Ask in team Slack or GitHub Discussions
- **Bugs**: Create a GitHub Issue
- **Features**: Discuss in team meeting first
- **Setup Issues**: Check `GETTING_STARTED.md`

## Recognition

Contributors will be:
- Added to contributors list
- Credited in release notes
- Thanked in team meetings
- Invited to product decisions (for regular contributors)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to FeedbackFix! Together, we're saving designers from "make it pop" hell! ??
