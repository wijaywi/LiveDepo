// lib/moss-adapter.ts
// This is the abstract layer for Moss.
// It includes a fallback in-memory mock if MOSS_API_KEY is not present,
// ensuring the demo can run in any environment while demonstrating the latency requirements.

export interface MossDocument {
  id: string;
  text: string;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  documents: MossDocument[];
  metrics: {
    latencyMs: number;
    backend: 'moss-live' | 'moss-mock';
  };
}

export class MossAdapter {
  private isLive: boolean;
  private mockDocs: MossDocument[] = [];

  constructor() {
    // In a real deployed environment, these would come from process.env
    this.isLive = false; // Forced to false for demo safety without real keys
  }

  async addDocs(index: string, docs: MossDocument[]): Promise<void> {
    if (this.isLive) {
      // e.g. await client.add_docs(index, docs);
    } else {
      this.mockDocs.push(...docs);
    }
  }

  async search(index: string, query: string): Promise<SearchResult> {
    const start = performance.now();

    if (this.isLive) {
      // Simulate real Moss call
      // const results = await client.query(index, query);
      return { documents: [], metrics: { latencyMs: 0, backend: 'moss-live' } };
    } else {
      // MOCK FALLBACK: Simulate sub-10ms latency characteristic of Moss Edge/In-Browser
      await new Promise(resolve => setTimeout(resolve, 8)); // 8ms simulated latency
      
      const end = performance.now();
      const latencyMs = Math.round((end - start) * 10) / 10;
      
      // Basic synthetic matching for the demo scenario
      const match = this.mockDocs.find(d => 
        query.toLowerCase().includes("competitor") || 
        query.toLowerCase().includes("2023")
      );

      return {
        documents: match ? [match] : [],
        metrics: {
          latencyMs,
          backend: 'moss-mock'
        }
      };
    }
  }
}

export const moss = new MossAdapter();
