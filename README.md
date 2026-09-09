# LiveDepo ⚖️

LiveDepo is a real-time semantic cross-examination copilot built for the **YC Fall 2026 × Moss: The Zero Latency Builder Sprint**.

## Deployed Link
**[https://livedepo-moss-yc.vercel.app](https://livedepo-moss-yc.vercel.app)**

## Overview
LiveDepo listens to live deposition testimony, instantly searches thousands of pages of discovery documents using **Moss**, and feeds the attorney contradictory evidence and follow-up questions *while the witness is still speaking*.

## Why Moss is Essential (The Moss Removal Test)
If Moss were removed and replaced with a standard vector database, retrieval would take 1-3 seconds. In a live cross-examination, a 3-second delay means the conversation has moved on, the rhythm is broken, and the opportunity to challenge a lie is lost. Moss's sub-10ms retrieval allows LiveDepo to act as a zero-latency copilot.

## Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

*Note: The application uses a local fallback Mock Moss Adapter (`lib/moss-adapter.ts`) populated with synthetic legal discovery data to guarantee reliable demo execution.*
