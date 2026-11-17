import type { DetailedAnalysisResult } from '../types';

export async function analyzeResumeWithGemini(
  text: string,
  pageCount: number,
  extractedLinks: string[],
  apiKey: string,
  jobDescription: string = ''
): Promise<DetailedAnalysisResult> {
  const prompt = `
You are the world's most rigorous, elite Technical Recruiter, ATS Engineer, and Career Coach.
Analyze the following resume text extracted from a PDF. Check every detail: single-page density, links (GitHub, LinkedIn, Portfolio, emails), bullet point quality (Google X-Y-Z formula), section completeness, exact positive points, and exact critical red flags.

PDF Info:
- Total Pages: ${pageCount}
- Extracted URLs & Emails: ${JSON.stringify(extractedLinks)}
${jobDescription ? `- Target Job Description: ${jobDescription}` : ''}

Resume Content:
"""
${text.slice(0, 8000)}
"""

Return ONLY a valid JSON object strictly matching this TypeScript structure without any markdown backticks or extra text:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "readabilityScore": number (0-100),
  "impactScore": number (0-100),
  "brevityScore": number (0-100),
  "summaryPitch": string,
  "topStrengths": string[],
  "criticalRedFlags": string[],
  "missedOpportunities": string[],
  "links": [
    {
      "url": string,
      "type": "github" | "linkedin" | "portfolio" | "email" | "other",
      "status": "valid" | "warning" | "invalid",
      "note": string,
      "isHttps": boolean,
      "clickable": boolean
    }
  ],
  "sections": [
    {
      "name": string,
      "detected": boolean,
      "status": "pass" | "warning" | "missing",
      "importance": "critical" | "important" | "recommended",
      "positivePoints": string[],
      "negativePoints": string[],
      "recommendations": string[]
    }
  ],
  "bulletAudits": [
    {
      "original": string,
      "score": number (1-10),
      "actionVerbFound": boolean,
      "actionVerb": string | null,
      "metricFound": boolean,
      "metric": string | null,
      "critique": string,
      "improvedSuggestion": string
    }
  ],
  "metrics": [
    {
      "label": string,
      "score": number,
      "weight": number,
      "status": "excellent" | "good" | "average" | "poor",
      "summary": string,
      "details": string[]
    }
  ],
  "detectedSkills": {
    "technical": string[],
    "tools": string[],
    "soft": string[]
  }
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJson) {
    throw new Error('No analysis generated from Gemini API');
  }

  const parsed = JSON.parse(rawJson);

  // Compute word count & reading time
  const words = text.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;

  return {
    ...parsed,
    pageCount,
    wordCount,
    readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
    extractedText: text
  };
}
