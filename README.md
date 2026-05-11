# 🌐 LinguaBot — Free AI Translation Chatbot

A sleek translation chatbot built with **Next.js 15**. Translates text into 15+ languages instantly — **completely free, no API key required**.

Powered by the [MyMemory Translation API](https://mymemory.translated.net/) (free, no sign-up).

## ✨ Features

- 🌍 **15+ Languages** — Spanish, French, German, Japanese, Chinese, Arabic, Hindi, Korean, and more
- 💬 **Chat Interface** — Clean, dark-themed conversation UI
- ⚡ **100% Free** — Uses MyMemory API, no key or account needed
- 📱 **Responsive** — Works on all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

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

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

> No `.env` setup needed — the app works out of the box!

## 🌐 Deploy to Vercel

1. Push to GitHub (see below)
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. No environment variables needed — just click **Deploy**!

## 📁 Project Structure

```
translation-chatbot/
├── app/
│   ├── api/translate/route.ts   # Free MyMemory API integration
│   ├── globals.css              # Dark theme styles
│   ├── layout.tsx
│   └── page.tsx                 # Chat UI
└── README.md
```

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Translation | MyMemory API (free) |
| Styling | Custom CSS (dark theme) |
| Deployment | Vercel |

## 📝 License

MIT
