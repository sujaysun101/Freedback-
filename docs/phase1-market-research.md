# Phase 1: Market & Problem Research

## Objective
Collect a dataset of real-world vague client feedback examples to train and validate the feedback translation engine.

## Data Collection Strategy

### Target Sources
1. **Reddit Communities**
   - r/design (2.8M members)
   - r/webdesign (1.5M members)
   - r/freelance (200K members)
   - r/graphic_design (500K members)
   - r/logodesign (300K members)

2. **Design Forums**
   - Dribbble comments
   - Behance project feedback
   - DesignerNews discussions
   - Design Shack forums

3. **Client Communication Platforms**
   - Upwork messages
   - Fiverr order revisions
   - 99designs contest feedback

## Data Collection Script

```python
# Example script structure for Reddit scraping
import praw
import json
import csv
from datetime import datetime

# Reddit API credentials
reddit = praw.Reddit(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    user_agent="FeedbackFix Research Bot"
)

# Keywords to search for
keywords = [
    "make it pop", "pizzazz", "make it better",
    "needs work", "not quite right", "something's off",
    "add more", "more vibrant", "more professional",
    "feels empty", "too busy", "too plain"
]

# Collect examples
examples = []

for subreddit_name in ['design', 'webdesign', 'freelance']:
    subreddit = reddit.subreddit(subreddit_name)
    for keyword in keywords:
        for submission in subreddit.search(keyword, limit=100):
            # Extract vague feedback from comments
            # ...

# Save to CSV
with open('vague_feedback_dataset.csv', 'w') as f:
    writer = csv.DictWriter(f, fieldnames=['feedback', 'context', 'source', 'date'])
    writer.writeheader()
    for example in examples:
        writer.writerow(example)
```

## Expected Dataset Structure

### CSV Format
```csv
vague_phrase,common_designer_interpretation,context,source,date
"make it pop","Increase contrast by 40%, add vibrant accent colors, enhance typography hierarchy","Client feedback on landing page design","r/design",2024-01-15
"needs more pizzazz","Add animated micro-interactions, energetic color palette, varied spacing rhythm","Website homepage revision request","r/webdesign",2024-01-16
```

### JSON Format
```json
[
  {
    "vague_phrase": "make it pop",
    "interpretations": [
      "Increase contrast ratio between background and foreground elements by at least 40%",
      "Apply a vibrant color accent to primary call-to-action buttons",
      "Add subtle shadow or depth effects to key visual elements"
    ],
    "context": "Landing page design",
    "source": "r/design",
    "date": "2024-01-15"
  }
]
```

## Target Metrics
- **Minimum Dataset Size**: 100-200 examples
- **Coverage**: At least 50 unique vague phrases
- **Distribution**: Mix of different design contexts (web, print, branding, etc.)

## Implementation Notes
- Respect Reddit API rate limits
- Follow community guidelines and terms of service
- Anonymize any personal information
- Focus on publicly available feedback examples
