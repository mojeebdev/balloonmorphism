# balloon. 🎈

> make your logo float — balloonmorphism generator

**Live:** [balloon.blindspotlab.xyz](https://balloon.blindspotlab.xyz)  
**Built by:** [Mojeeb Titilayo](https://mojeeb.xyz) / [BlindspotLab](https://blindspotlab.xyz)

---

## what it does

drop your brand logo or pfp → get it back in balloonmorphism style → download + share to X.

powered by Gemini 2.0 Flash image generation.

---

## setup

```bash
npm install
cp .env.example .env.local
```

fill in `.env.local`:

```
GEMINI_API_KEY=        # Google AI Studio → API Keys
BLOB_READ_WRITE_TOKEN= # Vercel Dashboard → Storage → Blob → your store → .env.local tab
```

### get your keys

**Gemini API Key**
- go to [aistudio.google.com](https://aistudio.google.com)
- click "Get API key"
- free, no credit card

**Vercel Blob Token**
- create project on Vercel
- go to Storage tab → Create Blob Store
- copy `BLOB_READ_WRITE_TOKEN` from the .env.local tab

---

## run locally

```bash
npm run dev
```

open [localhost:3000](http://localhost:3000)

note: without `BLOB_READ_WRITE_TOKEN`, the tool still works in dev — it returns a base64 data URL instead of a blob URL. the share-to-X OG image won't work locally, but download works fine.

---

## deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

then:
1. add env vars in Vercel dashboard → Settings → Environment Variables
2. set custom domain: `balloon.blindspotlab.xyz`

---

## rate limiting

2 generations per IP per 5 hours. implemented in-memory (`lib/ratelimit.ts`). works per serverless instance — good enough for an MVP/viral tool on free Vercel tier.

---

## stack

- Next.js 15 App Router
- Tailwind CSS
- Gemini 2.0 Flash (`gemini-2.0-flash-preview-image-generation`)
- Vercel Blob (image storage for OG sharing)
- prompt engineering (the actual magic)

---

## license

MIT — build whatever you want.
