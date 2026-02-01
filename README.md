# Pratyaksh

**Privacy-first digital footprint scanner** - Discover your forgotten accounts, visualize your data exposure risk, and take back control of your privacy.

![Pratyaksh Logo](./frontend/assets/logo.svg)

## 🔐 Privacy Commitment

Pratyaksh is designed with privacy as the #1 priority:

- **Zero Persistent Storage**: We never store your emails or personal data
- **Metadata Only**: We only read email headers (From, Subject, Date), never content
- **Session Expiry**: All data auto-deletes after 15 minutes
- **Immediate Purge**: Logging out instantly deletes everything
- **Open Source**: Verify our privacy claims yourself

## ✨ Features

- **Smart Email Scanning**: Analyzes Gmail metadata to find signup confirmations
- **Interactive Risk Map**: D3.js force-directed visualization of your digital footprint
- **AI Categorization**: Groq-powered service detection and categorization
- **Breach Detection**: HIBP integration checks for compromised services
- **Data Value Estimation**: Calculate how much your data is worth to advertisers
- **Kill Switch**: Generate GDPR/CCPA deletion requests for all services at once
- **Beautiful UI**: Modern glassmorphic design with React Bits components

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS 3.4** + Custom design system
- **Zustand** for state management
- **D3.js** for data visualization
- **Framer Motion** for animations

### Backend
- **FastAPI** (Python 3.11)
- **Redis** for session-only storage
- **Groq SDK** for AI features
- **Google OAuth** for authentication
- **HIBP API** for breach checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Redis Server
- Google Cloud Console project with Gmail API enabled
- Groq API key (free tier available)
- HIBP API key (optional)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start Redis (if not running)
redis-server

# Start the backend
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see Pratyaksh!

## 📁 Project Structure

```
pratyaksh/
├── frontend/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/callback/     # OAuth callback
│   │   ├── scan/              # Scanning page
│   │   └── dashboard/         # Main dashboard
│   ├── components/
│   │   ├── ui/                # React Bits components
│   │   ├── landing/           # Landing page components
│   │   └── dashboard/         # Dashboard components
│   └── lib/                   # Utilities, API client, stores
│
├── backend/
│   └── app/
│       ├── api/               # FastAPI route handlers
│       ├── core/              # Configuration and security
│       ├── models/            # Pydantic schemas
│       └── utils/             # Email parser, AI client, etc.
│
└── docs/                      # Documentation
```

## 🔑 API Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Gmail API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (Web application)
6. Add authorized redirect URI: `http://localhost:8000/api/auth/callback`
7. Copy Client ID and Secret to `.env`

### Groq API Setup

1. Sign up at [Groq](https://console.groq.com)
2. Create an API key
3. Add to `.env` as `GROQ_API_KEY`

### HIBP API Setup (Optional)

1. Subscribe at [HIBP API](https://haveibeenpwned.com/API/Key)
2. Add key to `.env` as `HIBP_API_KEY`

## 🎨 Design System

Pratyaksh uses a custom design system inspired by React Bits:

- **Colors**: Blue primary (#3B82F6), danger red (#EF4444), success green (#22C55E)
- **Effects**: Glassmorphism, electric borders, gradient text, glow effects
- **Animations**: Smooth transitions, laser flows, glitch effects
- **Typography**: Inter font family with system fallbacks

## 📜 Privacy Policy

Pratyaksh commits to:

1. **No Data Retention**: Session data only, 15-minute TTL
2. **Metadata Access Only**: Never reads email body content
3. **No Third-Party Sharing**: Your data stays with you
4. **Open Source**: Full code transparency
5. **User Control**: Delete everything instantly with logout

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [React Bits](https://reactbits.dev) for UI component inspiration
- [Groq](https://groq.com) for fast AI inference
- [Have I Been Pwned](https://haveibeenpwned.com) for breach data

---

Built with ❤️ for privacy. Your data belongs to you.
