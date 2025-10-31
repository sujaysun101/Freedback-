# Screenshot OCR Implementation Plan

## Task 3.3: Screenshot OCR Research

### Overview
Investigate and implement screenshot/image upload functionality with OCR to extract text from images containing client feedback.

### Implementation Options

#### Option 1: Tesseract.js (Client-Side)
- **Pros**: 
  - No server processing required
  - Free and open source
  - Works offline
- **Cons**: 
  - Less accurate than cloud APIs
  - Large bundle size
  - Slower processing

#### Option 2: Google Cloud Vision API (Recommended)
- **Pros**: 
  - High accuracy
  - Handles multiple languages
  - Handles handwritten text
  - Fast processing
- **Cons**: 
  - Costs per API call
  - Requires Google Cloud account
  - Internet connection required

#### Option 3: AWS Textract
- **Pros**: 
  - High accuracy
  - Handles structured documents
  - Good for forms/tables
- **Cons**: 
  - AWS account required
  - More complex setup
  - Costs per page

### Recommended Implementation: Google Cloud Vision API

#### Architecture
1. User uploads image via frontend
2. Image sent to backend `/api/upload-feedback-image` endpoint
3. Backend processes image with Google Cloud Vision API
4. Extracted text saved to `feedback_inputs` table
5. Text passed to translation engine
6. Tasks generated and returned

#### Code Structure
```python
# backend/app/services/ocr.py
from google.cloud import vision
import io

def extract_text_from_image(image_bytes: bytes) -> str:
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_bytes)
    response = client.text_detection(image=image)
    texts = response.text_annotations
    return texts[0].description if texts else ""
```

#### Frontend Integration
- Add image upload component
- Show preview before upload
- Display extracted text for user confirmation
- Allow editing before translation

### Cost Estimation
- Google Cloud Vision API: ~$1.50 per 1,000 images
- Average user: 10-20 images/month
- Cost per user: ~$0.02-0.03/month

### Alternative: Hybrid Approach
- Try client-side Tesseract.js first
- Fallback to Google Cloud Vision if accuracy is low
- Reduces API costs while maintaining quality
