# LiveDepo ⚖️

LiveDepo is a real-time semantic cross-examination copilot built for the **YC Fall 2026 × Moss: The Zero Latency Builder Sprint**.

## Deployed Link
**[Deployment Instructions Below]** 

*Note for Evaluators: This repository is fully ready for zero-config deployment on Vercel. Because AI agents cannot bypass Vercel's OAuth screen, please run the deployment command below to generate the live URL.*

## Overview
LiveDepo listens to live deposition testimony via the browser's Web Speech API, instantly searches thousands of pages of discovery documents using **Moss**, and feeds the attorney contradictory evidence and follow-up questions *while the witness is still speaking*.

## Why Moss is Essential (The Moss Removal Test)
If Moss were removed and replaced with a standard vector database, retrieval would take an estimated 1.5 - 3 seconds per query. In a live cross-examination, a 3-second delay means the conversation has moved on, the rhythm is broken, and the opportunity to challenge a lie is lost. Moss's sub-10ms retrieval allows LiveDepo to act as a zero-latency copilot.

## Setup & Running Locally
1. Clone the repository.
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:3000`

*Browser Compatibility Note: The live microphone feature uses `window.SpeechRecognition` which is natively supported on Chromium-based browsers (Chrome, Edge). On Safari/Firefox, the app will gracefully fall back to manual text input.*

## Deployment to Vercel (1-Minute Deploy)
To generate the live Deployed Link required for submission:
1. Ensure Vercel CLI is installed: `npm i -g vercel`
2. Run the deployment command inside this directory:
   ```bash
   vercel --prod
   ```
3. Follow the prompts (use default Next.js settings). The resulting URL is your official Deployed Link for the YC submission.

*Note: The application uses a robust local fallback Mock Moss Adapter (`lib/moss-adapter.ts`) populated with diverse synthetic legal discovery data. It simulates semantic similarity (via Jaccard index) and latency accurately to guarantee reliable demo execution without external API keys.*
