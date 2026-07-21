# StoryTunes

English picture books for kids — an immersive reading app designed for iPad.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 on your iPad or browser. **15 preset books ready to read, with read-aloud — no API keys required.**

## Features

- 📚 **15 preset picture books** across 3 difficulty levels (Seeds / Sprouts / Trees)
- 📖 **Landscape reader** — 60% illustration, 40% large text, swipe/touch navigation
- 🎙️ **Read aloud** — free Web Speech API built in; upgrade to Azure TTS for higher quality
- 🎵 **Rhythm mode** — turn story text into rhythmic chants with beat markers
- ✨ **AI story creation** — DeepSeek V3 writes stories, Qwen-Image draws illustrations
- 🔐 **Password protection** — single family password, 30-day session

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS 4 · Supabase · DeepSeek V3 · Qwen-Image · Azure TTS

## Optional: Enable AI Features

Add API keys to `.env.local`:

| Feature | Key |
|---------|-----|
| AI Story Generation | `DEEPSEEK_API_KEY` |
| AI Illustrations | `QWEN_IMAGE_API_KEY` |
| High-quality TTS | `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION` |
| Cross-device sync | `SUPABASE_URL` + `SUPABASE_ANON_KEY` |
| Password protection | `SESSION_SECRET` + `FAMILY_PASSWORD` |

## Deploy

Push to GitHub, import into [Vercel](https://vercel.com/new). Set env vars in Vercel dashboard.

## License

MIT
