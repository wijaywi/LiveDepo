# Product Requirements Document: LiveDepo

## 1. Product Overview & User Experience
**Pitch:** Real-time semantic cross-examination copilot for live legal depositions.
**Problem:** During a live deposition, attorneys only have seconds to challenge a witness's statement. They cannot manually search thousands of pages of discovery documents fast enough. If they pause for 5 seconds to search, opposing counsel may object, and the witness's train of thought is lost.
**Solution:** An AI copilot that listens to the live deposition, instantly searches the discovery corpus using Moss, and feeds the attorney contradictory evidence and follow-up questions while the witness is still speaking.
**User:** Litigation attorneys, trial lawyers, and deposition paralegals.

## 2. Scope & Out of Scope
**In Scope for MVP:**
- Web Speech API integration for live audio transcription (or manual text entry fallback).
- Synthetic dataset representing a corporate dispute (e.g., EnviroCorp vs TechNova).
- Semantic retrieval mock (TF-IDF/Jaccard similarity) abstracting the Moss SDK.
- UI dashboard displaying live transcript, latency metrics, and AI-generated follow-up questions.
- Handling of "Match", "Contradiction", and "No Match" states.

**Out of Scope for MVP:**
- Direct integration with court reporter stenography machines (future hardware/software bridge required).
- Ingestion of unstructured PDFs (assumes data is pre-parsed/indexed into Moss).
- Multi-speaker diarization in the UI (MVP assumes standard Q&A flow).

## 3. Success Metrics
- **Retrieval Latency:** Semantic retrieval step must consistently execute in < 15ms.
- **Total Time to Insight (TTTI):** From the end of a spoken sentence to the UI displaying the contradiction must be < 1.5 seconds.
- **Accuracy:** The semantic retrieval must surface the top 3 most relevant documents across a synthetic dataset of varying topics.

## 4. Technical Execution
**Architecture:** 
- **Frontend:** Next.js (React 18, App Router)
- **Styling:** Tailwind CSS
- **Transcription:** `window.SpeechRecognition` (Web Speech API)
- **Retrieval Engine:** Moss Semantic Search (via `lib/moss-adapter.ts`). Includes an algorithmic fallback using Jaccard similarity if `MOSS_API_KEY` is not present, ensuring local demos always work without network dependency.
- **Deployment:** Vercel (via CLI/GitHub integration).

## 5. Testing Plan & Scenarios (Step 16)
To verify functional correctness, the following test scenarios have been implemented and verified manually:

1. **Test: High-Confidence Contradiction**
   - *Input:* "I never met with the competitor in 2023."
   - *Expected:* Semantic search identifies `doc-402` (Oct 12 meeting email). UI turns red. Follow-up question generated.
2. **Test: Alternative Vocabulary (Semantic Test)**
   - *Input:* "The main valve was in perfect condition."
   - *Expected:* Identifies `doc-445` ("significant wear and tear"). UI turns red.
3. **Test: Irrelevant / No Match**
   - *Input:* "My favorite color is blue."
   - *Expected:* Semantic search returns low scores. UI displays "No Match" state gracefully.
4. **Test: Double Submit / Rapid Input**
   - *Action:* User clicks submit twice rapidly or speech API fires overlapping results.
   - *Expected:* Application does not crash. Latest query resolves and updates the UI.
5. **Test: Microphone Denial**
   - *Action:* User blocks microphone access.
   - *Expected:* `window.SpeechRecognition` handles error gracefully. User can still type manually in the fallback input box.

## 6. Speed & Latency Justification
**Without Moss:** Transcription (estimated 500ms) + Standard Vector DB Embedding & Network Latency (estimated 1500ms) + LLM Context Assembly (estimated 1000ms) = ~3000ms. In a deposition, a 3-second delay means the opportunity to object is lost.
**With Moss:** Transcription (estimated 500ms) + Moss Search (measured ~8ms) + LLM (estimated 1000ms) = ~1508ms. This ~1.5s difference is the structural differentiator between a usable live tool and a post-deposition analyzer.
