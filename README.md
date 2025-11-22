# Mobile AI OS

Mobile AI OS is a full-screen, mobile-first AI operating system layer built as a Next.js PWA. It ships with capture-first workflows, memory search, and a unified command bar that feels like a bespoke mobile OS shell.

## Tech stack
- Next.js 15 (App Router) + TypeScript
- React 18
- Tailwind CSS
- Local-first persistence via `localStorage`
- Single AI endpoint at `/api/ai` powered by `AI_API_KEY`

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` on mobile or desktop.

## AI configuration
Set your API key in `.env.local` or environment variables:
```
AI_API_KEY=your-api-key-here
```
Without a key, deterministic demo responses keep workflows functional.

## Deploy to Vercel
1. Push this repository to GitHub.
2. Import into Vercel and select the Next.js framework preset.
3. Add `AI_API_KEY` to project Environment Variables.
4. Deploy—no manual fixes required.

## PWA install
- iOS Safari: Share → Add to Home Screen.
- Android/Chrome: Menu → Install App.
The app runs standalone with manifest + service worker for offline shell caching.

## Capture from anywhere
Create a bookmarklet or iOS Shortcut that opens:
```
https://<your-domain>/capture?text=<ENCODED_TEXT>&title=Optional+Title&type=text
```
The route will save the event into the current workspace and auto-run the Summarize workflow.

## Workflows via JSON
Use the Workflows screen to paste JSON for custom workflows. Example:
```json
{
  "id": "custom-idea",
  "name": "Idea Expander",
  "description": "Expand notes into richer ideas",
  "workspaceId": "any",
  "inputFilter": { "allowedTypes": ["text"] },
  "steps": [
    { "id": "step-1", "type": "ai", "aiTask": "insight", "template": "Generate 3 expanded ideas:\n{{normalizedText}}" }
  ],
  "isBuiltIn": false
}
```

## Monetization surface
The Settings page includes Free, Pro, and Business plan cards with mailto-based contact CTAs. Payments are intentionally not implemented in this v1; the UI is ready for future integration.
