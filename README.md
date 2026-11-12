# Hypothesis Checker

Checks whether a student's statement qualifies as a research hypothesis, using Claude AI to evaluate five criteria: testable, falsifiable, population, expected outcome, and direction.

Built for undergraduate social psychology seminars.

## Deploy to Vercel (5 minutes)

1. **Fork or push this repo to GitHub.**

2. **Go to [vercel.com](https://vercel.com) → New Project → import your GitHub repo.**

3. **Add your Anthropic API key as an environment variable:**
   - In Vercel project settings → Environment Variables
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from [console.anthropic.com](https://console.anthropic.com)

4. **Deploy.** Vercel will give you a URL like `https://hypothesis-checker-xyz.vercel.app`.

## Local development

```bash
npm install -g vercel
cp .env.example .env
# Add your API key to .env
vercel dev
```

Then open `http://localhost:3000`.

## Project structure

```
hypothesis-checker/
├── public/
│   └── index.html      # The frontend
├── api/
│   └── check.js        # Vercel serverless function (proxies to Claude API)
├── vercel.json         # Routing config
├── package.json
└── .env.example
```

## Costs

Each check calls Claude Haiku, which costs roughly $0.00025 per check (a quarter of a cent). For a class of 30 students doing 10 checks each, that's under $0.08.

## Customizing

The grading prompt is in `public/index.html` inside the `buildPrompt()` function. Edit the criteria definitions there to adjust what the checker looks for.
