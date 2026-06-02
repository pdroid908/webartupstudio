// types/index.ts
export interface SecurityResult {
  finalStatus: "BAHAYA" | "HATI-HATI" | "AMAN";
  googleStatus: "BAHAYA" | "ADA CELAH" | "VERIFIED";
  virusTotal: "BAHAYA" | "TIDAK ADA DATA" | "AMAN";
  vtDetails?: { malicious: number };
  heuristicFlags: string[];
  trustScore: number;
  userMessage: string;
  error?: string;
}
