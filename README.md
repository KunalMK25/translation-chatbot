# 🌐 LinguaBot — AI Translation Chatbot

A sleek, AI-powered translation chatbot built with **Next.js 15** and **Claude AI**. Translate text into 15+ languages instantly through a beautiful chat interface.

## ✨ Features

- 🌍 **15+ Languages** — Spanish, French, German, Japanese, Chinese, Arabic, Hindi, Korean, and more
- 💬 **Chat Interface** — Natural conversation-style translation with history context
- 🧠 **AI-Powered** — Uses Claude (Anthropic) for accurate, nuanced translations with cultural notes
- ⚡ **Fast & Responsive** — Optimized for all screen sizes
- 🌙 **Dark Theme** — Easy on the eyes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/translation-chatbot.git
   cd translation-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/translation-chatbot)

### Manual Deploy

1. **Push to GitHub** (see below)

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) → New Project
   - Import your GitHub repository
   - Add Environment Variable: `ANTHROPIC_API_KEY`
   - Deploy!

## 📁 Project Structure

```
translation-chatbot/
├── app/
│   ├── api/
│   │   └── translate/
│   │       └── route.ts      # API endpoint (Claude integration)
│   ├── globals.css           # Global styles & dark theme
│   ├── layout.tsx            # App layout & metadata
│   └── page.tsx              # Main chat UI
├── .env.example              # Environment variable template
├── .gitignore
└── README.md
```

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| AI | Anthropic Claude API |
| Styling | Custom CSS (dark theme) |
| Deployment | Vercel |

## 📝 License

MIT
