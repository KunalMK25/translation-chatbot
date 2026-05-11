# 🌐 LinguaBot — AI Translation Chatbot with Voice

A sleek, dark-themed translation chatbot built with **Next.js 16**. Translate text into 16 languages instantly — **completely free, no API key required**. Speak your input and hear translations read aloud.

---

## ✨ Features

| | Feature |
|---|---|
| 🌍 | **16 Languages** — Spanish, French, German, Japanese, Chinese, Arabic, Hindi, Kannada, Korean, and more |
| 🎤 | **Voice Input** — Click the mic and speak instead of typing (speech-to-text) |
| 🔊 | **Text-to-Speech** — Hear any translation read aloud in the correct language accent |
| 💬 | **Chat Interface** — Clean, dark-themed conversation UI with typing indicators |
| ⚡ | **100% Free** — No API key or account needed |
| ♿ | **Accessible** — Full keyboard navigation, ARIA labels, screen reader support |
| 📱 | **Responsive** — Works on all screen sizes |

---

## 🎤 Voice Features

### Speech Input
Click the **🎤 microphone button** next to the text field to start speaking. LinguaBot will:
- Show a live preview of what it hears as you speak (interim transcript)
- Automatically populate the input field when you finish
- Display an error message if microphone access is denied or no speech is detected

> Voice input uses English (`en-US`) as the source language.

### Text-to-Speech
Every translation bubble has a **🔊 speak button**. Click it to:
- Hear the translation read aloud in the correct accent for the target language
- Click again to stop playback
- Starting a new message automatically stops the previous one

> Voice features require a modern browser (Chrome, Edge, Safari). Firefox has limited Web Speech API support.

---

## 🌍 Supported Languages

| Language | Code | Language | Code |
|----------|------|----------|------|
| Spanish | `es` | Korean | `ko` |
| French | `fr` | Russian | `ru` |
| German | `de` | Dutch | `nl` |
| Italian | `it` | Turkish | `tr` |
| Portuguese | `pt` | Polish | `pl` |
| Japanese | `ja` | Swedish | `sv` |
| Chinese | `zh` | **Kannada** | `kn` |
| Arabic | `ar` | **Hindi** | `hi` |

---

## 🔧 Translation Engine

LinguaBot uses a dual-engine approach for the best accuracy:

- **Hindi & Kannada** → Google Translate public endpoint (proper Devanagari/Kannada script)
- **All other languages** → MyMemory API (free, no key required)
- Automatic fallback between engines if one is unavailable

No API keys needed — works out of the box.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/KunalMK25/translation-chatbot.git
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

### Running Tests

```bash
npm test            # Run all tests once
npm run test:watch  # Watch mode
```

35 tests covering unit, property-based (fast-check), and integration scenarios.

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. No environment variables needed — just click **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KunalMK25/translation-chatbot)

---

## 📁 Project Structure

```
translation-chatbot/
├── app/
│   ├── api/translate/
│   │   ├── route.ts             # Dual-engine translation (Google + MyMemory)
│   │   └── lang-codes.ts        # Language code map
│   ├── components/
│   │   ├── VoiceButton.tsx      # Mic toggle button
│   │   └── SpeakButton.tsx      # TTS playback button
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts  # Speech-to-text hook
│   │   └── useSpeechSynthesis.ts    # Text-to-speech hook
│   ├── globals.css              # Dark theme + voice button styles
│   ├── layout.tsx
│   └── page.tsx                 # Main chat UI
├── src/test/                    # Vitest test suite (35 tests)
└── vitest.config.ts
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Translation (Hindi/Kannada) | Google Translate public endpoint |
| Translation (other languages) | MyMemory API (free) |
| Voice Input | Web Speech API — `SpeechRecognition` |
| Voice Output | Web Speech API — `SpeechSynthesis` |
| Styling | Custom CSS (dark theme) |
| Testing | Vitest + Testing Library + fast-check |
| Deployment | Vercel |

---

## 📝 License

MIT
