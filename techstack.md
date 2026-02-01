# Pratyaksh Technical Stack

## Overview

Pratyaksh uses a modern, privacy-first technology stack optimized for fast development and reliable performance during hackathon demonstrations.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           FRONTEND (Next.js 14 + React 18)             │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │                                                          │    │
│  │  • Landing Page (Hero, Features, CTA)                  │    │
│  │  • OAuth Flow (Google Sign-in)                         │    │
│  │  • Dashboard (Risk Map, Service Cards)                 │    │
│  │  • Actions (Delete Buttons, Kill Switch)               │    │
│  │                                                          │    │
│  │  UI: Tailwind CSS + shadcn/ui                          │    │
│  │  Viz: D3.js (Risk Map) + Recharts (Stats)             │    │
│  │  State: Zustand + React Context                        │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────┐          │    │
│  │  │   Puter.js AI Fallback (Client-Side)    │          │    │
│  │  │   • Service Categorization              │          │    │
│  │  │   • Email Generation                    │          │    │
│  │  │   • Offline Demo Mode                   │          │    │
│  │  └─────────────────────────────────────────┘          │    │
│  └────────────────────────────────────────────────────────┘    │
│                              ↕                                   │
│                         HTTPS / API                              │
│                              ↕                                   │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI + Python 3.11)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  OAuth Module    │  │  Scan Module     │  │  AI Module   │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────┤ │
│  │ • Google OAuth   │  │ • Gmail API      │  │ • Groq API   │ │
│  │ • Token Mgmt     │  │ • Email Parser   │  │ • Puter.js   │ │
│  │ • Session Store  │  │ • Metadata Only  │  │ • Caching    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Risk Engine     │  │  Breach Check    │  │  Actions     │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────┤ │
│  │ • Categorization │  │ • HIBP API       │  │ • Email Gen  │ │
│  │ • Risk Scoring   │  │ • Breach Data    │  │ • Templates  │ │
│  │ • Value Calc     │  │ • Rate Limiting  │  │ • Kill Switch│ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Redis (Session Storage)                    │    │
│  │  • OAuth Tokens (15 min TTL)                           │    │
│  │  • Scan Results (Session Only)                         │    │
│  │  • AI Cache (7 day TTL)                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Static Service Database (JSON)                  │    │
│  │  • Pre-categorized Services (Top 1000)                 │    │
│  │  • Privacy Email Database                               │    │
│  │  • Category Mappings                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Google APIs │  │  Groq AI     │  │  Have I Been Pwned │   │
│  ├──────────────┤  ├──────────────┤  ├────────────────────┤   │
│  │ • OAuth 2.0  │  │ • Llama 3.3  │  │ • Breach Database  │   │
│  │ • Gmail API  │  │ • Fast LLM   │  │ • Domain Search    │   │
│  │ • Read-only  │  │ • JSON Mode  │  │ • Free Tier        │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                   │
│  ┌──────────────┐                                               │
│  │  Clearbit    │                                               │
│  ├──────────────┤                                               │
│  │ • Logo API   │                                               │
│  │ • Free Tier  │                                               │
│  └──────────────┘                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Stack

### Core Framework

**Next.js 14 (App Router)**
- **Version:** 14.x
- **Why:** Built-in API routes, SSR, optimized performance
- **Features Used:**
  - App Router (file-based routing)
  - Server Components
  - API Routes (backend proxy)
  - Image Optimization
  - Automatic code splitting

**React 18**
- **Version:** 18.x
- **Features Used:**
  - Hooks (useState, useEffect, useContext)
  - Suspense
  - Concurrent rendering
  - TypeScript support

**TypeScript**
- **Version:** 5.x
- **Why:** Type safety, better IDE support, fewer runtime errors
- **Config:** Strict mode enabled

### UI & Styling

**Tailwind CSS**
- **Version:** 3.4.x
- **Why:** Utility-first, rapid development, small bundle size
- **Plugins:**
  - @tailwindcss/forms
  - @tailwindcss/typography

**shadcn/ui**
- **Components Used:**
  - Button, Card, Dialog
  - Alert, Badge, Progress
  - Sheet, Tooltip, Tabs
- **Why:** Accessible, customizable, copy-paste components

**CSS Modules** (for complex components)
- Scoped styles
- No naming conflicts

### Data Visualization

**D3.js**
- **Version:** 7.x
- **Usage:** Risk map (force-directed graph)
- **Features:**
  - Custom SVG rendering
  - Smooth animations
  - Interactive tooltips
  - Zoom/pan controls

**Recharts**
- **Version:** 2.x
- **Usage:** Statistical charts
- **Charts:**
  - Pie chart (risk distribution)
  - Bar chart (category breakdown)
  - Line chart (value over time)

### State Management

**Zustand**
- **Version:** 4.x
- **Usage:** Global UI state
- **Stores:**
  - Auth state
  - Scan progress
  - Filter settings
  - Selected services

**React Context API**
- **Usage:** Session data
- **Contexts:**
  - UserContext
  - ServicesContext
  - SettingsContext

### AI Integration (Frontend)

**Puter.js**
- **Version:** Latest
- **Usage:** Client-side AI fallback
- **Features:**
  - Service categorization
  - Email generation
  - Offline mode support
- **Installation:**
  ```bash
  npm install @puter/puter.js
  ```

### HTTP Client

**Fetch API** (Native)
- **Wrapper:** Custom `apiClient.ts`
- **Features:**
  - Automatic token injection
  - Error handling
  - Request/response interceptors
  - TypeScript types

### Form Handling

**React Hook Form**
- **Version:** 7.x
- **Usage:** Email template editing
- **Features:**
  - Validation
  - Error messages
  - Controlled inputs

### Utilities

**clsx** - Conditional classNames
**date-fns** - Date formatting
**react-hot-toast** - Toast notifications
**framer-motion** - Animations

---

## Backend Stack

### Core Framework

**FastAPI**
- **Version:** 0.109.x
- **Why:** Fast, async, automatic docs, type hints
- **Features:**
  - Async/await support
  - Pydantic validation
  - Automatic OpenAPI docs
  - WebSocket support (future)

**Python**
- **Version:** 3.11+
- **Why:** Latest performance improvements, type hints
- **Virtual Environment:** venv

**Uvicorn**
- **Version:** 0.27.x
- **Why:** ASGI server, production-ready
- **Workers:** 4 (for hackathon demo)

### Authentication & Authorization

**Google OAuth 2.0**
- **Library:** google-auth-oauthlib
- **Version:** 1.2.x
- **Scopes:** `gmail.readonly`
- **Flow:** Authorization Code Flow
- **Token Storage:** Redis (session-only)

**Session Management**
- **Library:** Custom implementation
- **Storage:** Redis
- **TTL:** 15 minutes
- **Security:**
  - CSRF protection
  - Secure cookies
  - HTTPS only

### Email Processing

**Gmail API**
- **Library:** google-api-python-client
- **Version:** 2.116.x
- **Features:**
  - Metadata-only access
  - Batch requests
  - Query filtering
  - Rate limit handling

**Email Parsing**
- **Regex:** Custom patterns
- **Libraries:**
  - email (built-in)
  - email-validator (validation)

### AI Integration (Backend)

**Groq SDK (Primary)**
- **Version:** 0.4.1+
- **Installation:**
  ```bash
  pip install groq
  ```
- **Models:**
  - `llama-3.3-70b-versatile` (primary)
  - `llama-3.1-8b-instant` (fallback)
  - `mixtral-8x7b-32768` (long context)
- **Features:**
  - JSON mode (structured outputs)
  - Streaming support
  - Ultra-fast inference (<1s)
- **Rate Limits:**
  - Free: 30 req/min, 14,400/day
  - Cached responses to optimize usage

**AI Use Cases:**
```python
# Service Categorization
async def categorize_service(domain: str, subject: str) -> dict

# Privacy Email Extraction
async def extract_privacy_email(domain: str, policy_text: str) -> str

# Deletion Email Generation
async def generate_deletion_email(
    service: str, 
    regulation: str = "GDPR"
) -> str
```

**Retry Logic:**
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
async def call_groq_api(**kwargs):
    # Auto-retry with exponential backoff
    pass
```

### External APIs

**Have I Been Pwned**
- **Version:** v3
- **Library:** httpx (async)
- **Endpoint:** `/api/v3/breaches`
- **Rate Limit:** 1 req / 1.5s
- **Features:**
  - Domain-based search
  - No API key required (free tier)
  - Breach metadata

**Clearbit Logo API**
- **Endpoint:** `https://logo.clearbit.com/{domain}`
- **Usage:** Service logos
- **Fallback:** Generic icons

### Data Layer

**Redis**
- **Version:** 5.0.x
- **Usage:**
  - Session storage
  - OAuth tokens
  - Scan results
  - AI response cache
- **Configuration:**
  ```python
  REDIS_HOST = "localhost"
  REDIS_PORT = 6379
  REDIS_DB = 0
  TTL_SESSION = 900  # 15 minutes
  TTL_AI_CACHE = 604800  # 7 days
  ```

**JSON Database (Static)**
- **File:** `services_database.json`
- **Size:** ~1000 pre-categorized services
- **Structure:**
  ```json
  {
    "spotify.com": {
      "name": "Spotify",
      "category": "Entertainment",
      "data_sensitivity": 4,
      "privacy_email": "privacy@spotify.com",
      "logo_url": "https://logo.clearbit.com/spotify.com"
    }
  }
  ```

### HTTP Client

**HTTPX**
- **Version:** 0.26.x
- **Why:** Async support, HTTP/2, connection pooling
- **Usage:**
  - HIBP API calls
  - External service checks

### Data Validation

**Pydantic**
- **Version:** 2.5.x
- **Models:**
  ```python
  class Service(BaseModel):
      domain: str
      service_name: str
      category: str
      risk_level: Literal['High', 'Medium', 'Low']
      risk_score: float
      breach_count: int = 0
  
  class ScanResult(BaseModel):
      session_id: str
      services_found: List[Service]
      total_risk_score: float
  ```

### Environment Management

**python-dotenv**
- **Version:** 1.0.x
- **Usage:** Load `.env` variables
- **Variables:**
  ```bash
  GROQ_API_KEY=gsk_...
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...
  REDIS_URL=redis://localhost:6379
  SESSION_SECRET=...
  ENVIRONMENT=development
  ```

### Logging & Monitoring

**Loguru** (optional)
- Structured logging
- Colored output
- File rotation

**FastAPI Logging**
- Built-in access logs
- Error tracking
- Performance metrics

---

## DevOps & Deployment

### Development Environment

**Package Managers:**
- **Frontend:** npm/yarn
- **Backend:** pip + venv

**Development Servers:**
- **Frontend:** `npm run dev` (Next.js dev server, port 3000)
- **Backend:** `uvicorn app.main:app --reload` (port 8000)

**Hot Reload:**
- Next.js: Automatic
- FastAPI: `--reload` flag

### Version Control

**Git**
- **Platform:** GitHub
- **Branches:**
  - `main` (production)
  - `dev` (development)
  - `feature/*` (features)

**.gitignore:**
```
# Frontend
node_modules/
.next/
.env.local

# Backend
__pycache__/
venv/
.env
*.pyc

# Shared
.DS_Store
*.log
```

### Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_ENABLE_AI=true
```

**Backend (.env):**
```bash
GROQ_API_KEY=gsk_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
REDIS_URL=redis://localhost:6379
SESSION_SECRET=your-secret-key-here
HIBP_USER_AGENT=TracePriv-Hackathon
ENVIRONMENT=development
```

### Testing

**Frontend Testing:**
- **Framework:** Jest + React Testing Library
- **E2E:** Playwright (optional)
- **Commands:**
  ```bash
  npm run test        # Unit tests
  npm run test:e2e    # E2E tests
  ```

**Backend Testing:**
- **Framework:** pytest
- **Coverage:** pytest-cov
- **Commands:**
  ```bash
  pytest                    # Run tests
  pytest --cov=app         # With coverage
  pytest -v -s             # Verbose
  ```

### Deployment (Hackathon Demo)

**Frontend:**
- **Platform:** Vercel (recommended)
- **Alternative:** Netlify
- **Build Command:** `npm run build`
- **Output:** `.next/`

**Backend:**
- **Platform:** Railway / Render
- **Alternative:** DigitalOcean App Platform
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Redis:**
- **Platform:** Upstash (free tier)
- **Alternative:** Redis Cloud

**Environment:**
- Production environment variables
- CORS configuration
- HTTPS enforcement

---

## Security Stack

### Frontend Security

**HTTPS Only**
- TLS 1.3 minimum
- HSTS headers

**CORS Configuration**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://tracepriv.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,DELETE' },
        ],
      },
    ]
  },
}
```

**CSP Headers**
- Prevent XSS attacks
- Restrict script sources

**Input Sanitization**
- DOMPurify (for user inputs)
- HTML escaping

### Backend Security

**CORS Middleware**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tracepriv.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)
```

**Rate Limiting**
```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/scan/start")
@limiter.limit("10/minute")
async def start_scan():
    pass
```

**Input Validation**
- Pydantic models
- Email validation
- Domain validation

**Secrets Management**
- Environment variables (not hardcoded)
- Secret rotation (production)
- Encrypted storage (Redis TLS)

---

## Performance Optimization

### Frontend Optimization

**Code Splitting**
```javascript
// Dynamic imports
const RiskMap = dynamic(() => import('@/components/RiskMap'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

**Image Optimization**
- Next.js Image component
- WebP format
- Lazy loading

**Caching**
- Service logos cached
- AI results cached (localStorage)
- API responses cached (SWR)

**Bundle Size**
- Tree shaking enabled
- Unused code removal
- Gzip compression

### Backend Optimization

**Async Operations**
```python
# Parallel email fetching
tasks = [fetch_email(msg_id) for msg_id in message_ids]
results = await asyncio.gather(*tasks)
```

**Connection Pooling**
- Redis connection pool
- HTTP client pooling

**Caching Strategy**
```python
# AI results cached for 7 days
@lru_cache(maxsize=1000)
def get_cached_categorization(domain: str):
    return redis.get(f"ai_cat:{domain}")
```

**Database Optimization**
- Redis pipelining
- Batch operations

---

## Monitoring & Debugging

### Development Tools

**Frontend:**
- React DevTools
- Redux DevTools (for Zustand)
- Next.js DevTools
- Lighthouse (performance)

**Backend:**
- FastAPI Swagger UI (`/docs`)
- ReDoc (`/redoc`)
- Redis CLI
- Python debugger (pdb)

### Logging

**Frontend:**
```javascript
// Custom logger
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => console.debug(`[DEBUG] ${msg}`)
}
```

**Backend:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
```

### Error Tracking

**Sentry** (optional for production)
- Frontend error tracking
- Backend exception monitoring
- Performance monitoring

---

## AI Stack Details

### Groq Configuration

**Model Selection Strategy:**

```python
class GroqConfig:
    PRIMARY_MODEL = "llama-3.3-70b-versatile"
    FAST_MODEL = "llama-3.1-8b-instant"
    LONG_CONTEXT_MODEL = "mixtral-8x7b-32768"
    
    # Rate limits
    FREE_TIER_RPM = 30
    FREE_TIER_RPD = 14400
    
    # Timeouts
    REQUEST_TIMEOUT = 10  # seconds
    
    # Retry config
    MAX_RETRIES = 3
    RETRY_DELAY = 2  # seconds
```

**API Call Example:**

```python
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

response = await client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "system",
            "content": "You are a service categorization expert."
        },
        {
            "role": "user",
            "content": f"Categorize this service: {domain}"
        }
    ],
    temperature=0.3,
    max_tokens=500,
    response_format={"type": "json_object"}
)
```

### Puter.js Configuration

**Installation:**
```bash
npm install @puter/puter.js
```

**Usage Example:**
```typescript
import { ai } from "@puter/puter.js";

const result = await ai.chat(
  "Categorize this service: spotify.com",
  {
    model: "gpt-4",
    temperature: 0.3,
    max_tokens: 300
  }
);
```

**Fallback Logic:**
```typescript
async function categorizeWithFallback(domain: string) {
  try {
    // Try backend Groq API
    const response = await fetch('/api/ai/categorize', {
      method: 'POST',
      body: JSON.stringify({ domain })
    });
    
    if (response.ok) return await response.json();
    
    // Fallback to Puter.js
    return await puterAI.categorize(domain);
  } catch (error) {
    // Ultimate fallback: rule-based
    return ruleBasedCategorization(domain);
  }
}
```

---

## Dependencies Summary

### Frontend Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@puter/puter.js": "latest",
    "zustand": "^4.0.0",
    "d3": "^7.0.0",
    "recharts": "^2.0.0",
    "tailwindcss": "^3.4.0",
    "clsx": "^2.0.0",
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.0.0",
    "react-hot-toast": "^2.0.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/d3": "^7.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Backend Dependencies

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0

# Google APIs
google-auth==2.27.0
google-auth-oauthlib==1.2.0
google-api-python-client==2.116.0

# AI
groq==0.4.1

# HTTP Client
httpx==0.26.0

# Redis
redis==5.0.1

# Email
email-validator==2.1.0

# Utilities
python-multipart==0.0.6
tenacity==8.2.3

# Development
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
```

---

## Quick Start Commands

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Backend Setup

```bash
# Create virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your values

# Run development server
uvicorn app.main:app --reload

# Run tests
pytest
```

### Redis Setup

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

---

## API Keys Required

### Development

1. **Google Cloud Console**
   - Create OAuth 2.0 credentials
   - Enable Gmail API
   - Get Client ID & Secret

2. **Groq**
   - Sign up at https://console.groq.com
   - Generate API key (free tier)

3. **Redis** (optional cloud)
   - Upstash free tier
   - Or run locally

### Production (Optional)

- Sentry (error tracking)
- Vercel (frontend hosting)
- Railway (backend hosting)

---

## Browser Support

**Minimum Supported Versions:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Requiring Modern Browsers:**
- D3.js visualizations
- WebGL (future 3D map)
- Service Workers (future offline mode)

---

## Performance Benchmarks

**Target Metrics:**
- Landing page: < 2s load time
- OAuth flow: < 5s completion
- Email scan (1000 emails): < 30s
- Risk map render: < 3s
- AI categorization: < 2s (Groq) / < 5s (Puter.js)
- Kill switch generation: < 5s

**Optimization Techniques:**
- SSR for initial load
- Code splitting for routes
- Image lazy loading
- API response caching
- AI result caching (7 days)
- Connection pooling

---

## Scalability Considerations

**Current Limits (Hackathon):**
- Max concurrent users: 50
- Max emails per scan: 5000
- Session timeout: 15 minutes
- AI calls: 30/minute (Groq free tier)

**Future Scaling:**
- Add Redis cluster
- Load balancer (multiple FastAPI instances)
- CDN for static assets
- Upgrade Groq to paid tier
- Implement job queue (Celery)

---

## Documentation

**Auto-generated:**
- FastAPI Swagger: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

**Manual:**
- README.md (project overview)
- TECHSTACK.md (this file)
- API.md (endpoint documentation)
- DEPLOYMENT.md (deployment guide)

---

## Troubleshooting

**Common Issues:**

1. **OAuth Redirect Mismatch**
   - Verify redirect URI in Google Console
   - Check NEXT_PUBLIC_API_URL

2. **Groq API Rate Limit**
   - Puter.js fallback activates automatically
   - Check cache hit rate
   - Consider upgrading to paid tier

3. **Redis Connection Failed**
   - Ensure Redis is running: `redis-cli ping`
   - Check REDIS_URL in .env

4. **CORS Errors**
   - Verify allowed origins in FastAPI
   - Check frontend API URL

5. **Build Failures**
   - Clear cache: `rm -rf .next node_modules`
   - Reinstall: `npm install`

---

## Contributing

**Code Style:**
- Frontend: ESLint + Prettier
- Backend: Black + isort
- TypeScript strict mode
- Python type hints

**Git Workflow:**
```bash
# Create feature branch
git checkout -b feature/ai-categorization

# Make changes, commit
git add .
git commit -m "feat: add Groq AI categorization"

# Push and create PR
git push origin feature/ai-categorization
```

---

## License

MIT License - See LICENSE file for details

---

## Support

**Issues:** GitHub Issues  
**Discussions:** GitHub Discussions  
**Contact:** team@tracepriv.app

---

**Last Updated:** January 30, 2026  
**Version:** 1.0.0-hackathon