# 🌐 LinguaBot — AI Translation Chatbot with Voice

A sleek, dark-themed translation chatbot built with **Next.js 16**. Translate text into 16 languages instantly — **completely free, no API key required**. Now with full voice support: speak your input and hear translations read aloud.

Powered by the [MyMemory Translation API](https://mymemory.translated.net/) and the browser-native **Web Speech API**.

---

## ✨ Features

| | Feature |
|---|---|
| 🌍 | **16 Languages** — Spanish, French, German, Japanese, Chinese, Arabic, Hindi, Korean, Kannada, and more |
| 🎤 | **Voice Input** — Click the mic button and speak instead of typing (speech-to-text) |
| 🔊 | **Text-to-Speech** — Hear any translation read aloud in the correct language accent |
| 💬 | **Chat Interface** — Clean, dark-themed conversation UI with typing indicators |
| ⚡ | **100% Free** — Uses MyMemory API, no key or account needed |
| ♿ | **Accessible** — Full keyboard navigation, ARIA labels, screen reader support |
| 📱 | **Responsive** — Works on all screen sizes |

---

## 🎤 Voice Features

### Speech Input
Click the **🎤 microphone button** next to the text field to start speaking. LinguaBot will:
- Show a live preview of what it hears as you speak (interim transcript)
- Automatically populate the input field when you finish
- Display an error message if microphone access is denied or no speech is detected

> Voice input uses English (`en-US`) as the source language, since LinguaBot translates *from* English.

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
| Arabic | `ar` | Hindi | `hi` |

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
npm test          # Run all tests once
npm run test:watch  # Watch mode
```

The test suite includes **35 tests** across unit, property-based (fast-check), and integration tests covering all voice features and language support.

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
│   │   ├── route.ts             # MyMemory API proxy
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
├── src/test/                    # Vitest test suite
└── vitest.config.ts
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Translation | MyMemory API (free) |
| Voice Input | Web Speech API — `SpeechRecognition` |
| Voice Output | Web Speech API — `SpeechSynthesis` |
| Styling | Custom CSS (dark theme) |
| Testing | Vitest + Testing Library + fast-check |
| Deployment | Vercel |

---

## 📝 License

MIT
