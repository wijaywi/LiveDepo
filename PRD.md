# Product Requirements Document: LiveDepo

## 1. Product & User Experience
**Pitch:** Real-time semantic cross-examination copilot for live legal depositions.
**Problem:** During a live deposition, attorneys only have seconds to challenge a witness's statement. They cannot manually search thousands of pages of discovery documents fast enough.
**Solution:** An AI copilot that listens to the live deposition, instantly searches the discovery corpus using Moss, and feeds the attorney contradictory evidence and follow-up questions while the witness is still speaking.
**User:** Litigation attorneys and trial lawyers.
**Workflow:** Audio Input -> Live Transcription -> Moss Semantic Search -> Context Assembly -> LLM Contradiction Check -> UI Alert.

## 2. Technical Execution
**Architecture:** 
- Frontend: Next.js (React)
- Styling: Tailwind CSS
- Retrieval: Moss Semantic Search (via `lib/moss-adapter.ts`)
- Logic: Vercel AI SDK integration pattern.
**Security:** No hardcoded secrets. Discovery data is processed securely.
**Testing:** Local mock adapter ensures testability without live credentials.

## 3. Speed & Latency
**Without Moss:** Transcription (500ms) + Vector DB Search (1500ms) + LLM (1000ms) = 3000ms. The moment to object is lost.
**With Moss:** Transcription (500ms) + Moss Search (8ms) + LLM (1000ms) = 1508ms. The attorney receives the alert instantly.

## 4. Demo & Presentation
**Video Script (60-90s):**
1. [0:00-0:10] Hook: "Depositions are won in seconds. LiveDepo gives lawyers instant recall."
2. [0:10-0:20] Show the UI. "We've loaded 5,000 synthetic discovery documents."
3. [0:20-0:40] Scenario: Audio plays. Witness says, "I never met with the competitor in 2023."
4. [0:40-0:60] The Wow Moment: UI instantly flags a contradiction. Latency metric shows 8.4ms semantic search. Evidence (an email from Oct 2023) is displayed.
5. [0:60-0:80] AI provides the follow-up: "Isn't it true you emailed John on Oct 12th?"
6. [0:80-0:90] Closing: "Moss makes zero-latency litigation possible."
