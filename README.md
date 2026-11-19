# Ugoki Lab

> 動き (ugoki) means "movement" in Japanese. We put intelligence into things that move, and we give it away.

The website of **Ugoki Lab**, a non-profit research lab for physical AI: affordable humanoid robots, an open model that designs real hardware, and pre-registered research. Everything we make is free to use.

**Live:** https://ugoki-lab.vercel.app

## What's on the site

- **Hero:** an ASCII wordmark that decodes itself from noise, over a field of glyphs that follows your cursor.
- **What we build:** humanoids, the open engineering model, sim-to-real research, problems that matter.
- **Work:** ARMageddon, ZOOMIES, COPYCAT, YOINK and SPUD, each with a looping clip and its headline number straight from the repo.
- **Research:** SUSS, LISTEN and VIBES, all pre-registered.
- **Roadmap, team, and how to join.**

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
| Robot clips and photos | `public/media/` |
| ASCII wordmark generator | `scripts/wordmark.mjs` |

To change text, edit `content.ts` and nothing else. To point "Join the lab" at an email instead of GitHub, change `SITE.contact`.

## Stack

Next.js 16 (App Router, static), Tailwind CSS v4, Motion, Phosphor icons, Geist and Noto Serif JP. Deployed on Vercel.

Three components come from [21st.dev](https://21st.dev) and were adapted for this site: Scramble Text (dqnamo), Background ASCII Wake (nikolas-sapa) and Footer with Big Wordmark (vilqor, MIT).

## Credits

Two reference photos come from Wikimedia Commons: humanoid robots at Science Square Tsukuba by Syced (CC0) and a humanoid robot at DASA by Sven Volkens (CC BY-SA 4.0). They show the kind of robot we work toward, not our own hardware. All robot clips are from our own open-source projects.

## License

Code: MIT, see [LICENSE](LICENSE). The CC BY-SA photo keeps its own license.
