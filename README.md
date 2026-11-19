# Ugoki Lab

> 動き (ugoki) means "movement" in Japanese. We put intelligence into things that move, and we give it away.

The website of **Ugoki Lab**, a non-profit research lab for physical AI: affordable humanoid robots, an open model that designs real hardware, and pre-registered research. Everything we make is free to use.

**Live:** https://ugoki-lab.vercel.app

## What's on the site

- **Hero:** a model playground. Pick a prompt and watch the plan type out. It is labelled as a concept, because the open model is still in training.
- **Open by default:** a vermilion block with the ASCII wordmark decoding itself over a flowing ASCII field.
- **What we build:** humanoids, the open engineering model, sim-to-real research, problems that matter.
- **How the model works:** Describe, Plan, Generate, Verify, Build, joined by pulsing beams.
- **Research:** SUSS, LISTEN and VIBES, all pre-registered.
- **Team, roadmap and how to join.**

Light and dark themes (follows the system, with a toggle), reduced-motion support, and it holds up on a phone.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. A production build is `npm run build && npm start`.

## Where things live

| What | Where |
|---|---|
| All copy and data (projects, team, roadmap, links) | `src/lib/content.ts` |
| Page sections | `src/app/page.tsx` |
| Colors and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Reference photos | `public/media/` |
| ASCII wordmark generator | `scripts/wordmark.mjs` |

To change text, edit `content.ts` and nothing else. To turn on the "Join the lab" button, set `SITE.contact` to a `mailto:` link.

## Stack

Next.js 16 (App Router, static), Tailwind CSS v4, Motion, Phosphor icons, Newsreader, Geist and Noto Serif JP. Deployed on Vercel.

Components from [21st.dev](https://21st.dev), adapted for this site (theme tokens, reduced motion, typing):

- Background ASCII Wake and Background ASCII Dither (nikolas-sapa)
- Count Up Animation (wensity)
- Typing Text (hyperiux)
- Segmented Control (halaska-studio, MIT)
- Animated Beam (klyv-ui, MIT)
- Footer with Big Wordmark (vilqor, MIT)

## Credits

Two reference photos come from Wikimedia Commons: humanoid robots at Science Square Tsukuba by Syced (CC0) and a humanoid robot at DASA by Sven Volkens (CC BY-SA 4.0). They show the kind of robot we work toward, not our own hardware.

## License

Code: MIT, see [LICENSE](LICENSE). The CC BY-SA photo keeps its own license.
