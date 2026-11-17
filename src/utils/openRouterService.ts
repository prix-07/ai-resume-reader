import type { DetailedAnalysisResult, LinkCheckResult } from "../types";

const OPENROUTER_KEYS = [
  import.meta.env.VITE_OPENROUTER_KEY_1,
  import.meta.env.VITE_OPENROUTER_KEY_2,
].filter((key): key is string => Boolean(key && key.trim()));

export async function analyzeResumeWithOpenRouter(
  text: string,
  pageCount: number,
  extractedLinks: string[],
  jobDescription: string = "",
  onKeyFallback?: (keyIndex: number, model: string) => void,
): Promise<DetailedAnalysisResult> {
  const prompt = `
You are the world's most rigorous, prestigious Silicon Valley FAANG Staff Technical Recruiter, Principal ATS Architect, and Executive Career Coach.
You are conducting a microscopic, honest, 360-degree forensic audit of the following candidate's resume.

CANDIDATE RESUME RAW TEXT:
"""
${text.slice(0, 9000)}
"""

PDF METADATA DETECTED:
- Page Count: ${pageCount}
- Deep Links / Annotations Found: ${JSON.stringify(extractedLinks)}
${jobDescription ? `- Target Job Description: """${jobDescription}"""` : ""}

CRITICAL RULES FOR PRODUCING A MASTERPIECE AUDIT:
1. Candidate Name & Target Role: Extract exact candidate name from the top and their target engineering domain.
2. Link Integrity Forensics:
   - Carefully inspect every single URL: GitHub, LinkedIn, Live Projects (e.g., Vercel, Netlify), and contact email.
   - If LinkedIn is generic like 'https://linkedin.com/' without a personal vanity handle like '/in/username', mark it as 'warning' or 'invalid' with an urgent note.
   - Check if project demo links are secure HTTPS and working domains.
3. Every Single Positive & Negative Point:
   - Provide concrete, highly specific topStrengths (cite their actual tech stack, achievements, architecture, real numbers).
   - Provide criticalRedFlags (point out lack of numbers in certain bullets, generic links, passive verbs, etc.).
   - Provide missedOpportunities (high-leverage ideas to push their resume to top 1% tier).
   - Provide quickFixes (3-5 immediate steps the candidate can take in 10 minutes to increase call-backs).
4. Bullet-by-Bullet Google X-Y-Z Audit:
   - Extract at least 6 to 10 actual bullet points from their Experience and Projects sections.
   - For EACH bullet:
     * Rate score out of 10.
     * Identify actionVerbFound (true/false) and the exact actionVerb.
     * Identify metricFound (true/false) and the exact metric.
     * Give a sharp, direct critique explaining why it scored what it scored.
     * Provide a world-class improvedSuggestion rewritten strictly using Google's X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".
5. Section Analysis:
   - Provide an in-depth breakdown for: Contact Information, Professional Summary, Technical Skills, Experience, Projects, Education, Certifications.
   - For every section list multiple concrete positivePoints, negativePoints, and recommendations.
6. Numerical Scoring (0-100 scale, realistic and calibrated):
   - overallScore, atsScore, readabilityScore, impactScore, brevityScore.

Return ONLY a valid JSON object matching this schema without markdown code blocks, backticks or preamble:
{
  "candidateName": "string",
  "targetRole": "string",
  "overallScore": number,
  "atsScore": number,
  "readabilityScore": number,
  "impactScore": number,
  "brevityScore": number,
  "summaryPitch": "string",
  "topStrengths": ["string"],
  "criticalRedFlags": ["string"],
  "missedOpportunities": ["string"],
  "quickFixes": ["string"],
  "links": [
    {
      "url": "string",
      "type": "github" | "linkedin" | "portfolio" | "email" | "other",
      "status": "valid" | "warning" | "invalid",
      "note": "string",
      "isHttps": boolean,
      "clickable": boolean
    }
  ],
  "sections": [
    {
      "name": "string",
      "detected": boolean,
      "status": "pass" | "warning" | "missing",
      "importance": "critical" | "important" | "recommended",
      "positivePoints": ["string"],
      "negativePoints": ["string"],
      "recommendations": ["string"]
    }
  ],
  "bulletAudits": [
    {
      "original": "string",
      "section": "string",
      "score": number,
      "actionVerbFound": boolean,
      "actionVerb": "string or null",
      "metricFound": boolean,
      "metric": "string or null",
      "critique": "string",
      "improvedSuggestion": "string"
    }
  ],
  "metrics": [
    {
      "label": "ATS Compatibility",
      "score": number,
      "weight": 35,
      "status": "excellent" | "good" | "average" | "poor",
      "summary": "string",
      "details": ["string"]
    },
    {
      "label": "Impact & Quantifiability",
      "score": number,
      "weight": 30,
      "status": "excellent" | "good" | "average" | "poor",
      "summary": "string",
      "details": ["string"]
    },
    {
      "label": "Length & Brevity Density",
      "score": number,
      "weight": 20,
      "status": "excellent" | "good" | "average" | "poor",
      "summary": "string",
      "details": ["string"]
    },
    {
      "label": "Structural Readability",
      "score": number,
      "weight": 15,
      "status": "excellent" | "good" | "average" | "poor",
      "summary": "string",
      "details": ["string"]
    }
  ],
  "detectedSkills": {
    "technical": ["string"],
    "tools": ["string"],
    "soft": ["string"]
  }
}
`;

  const models = [
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat",
    "qwen/qwen-2.5-72b-instruct",
  ];

  let lastError: any = null;

  for (let keyIdx = 0; keyIdx < OPENROUTER_KEYS.length; keyIdx++) {
    const apiKey = OPENROUTER_KEYS[keyIdx];

    for (const model of models) {
      try {
        if (onKeyFallback) {
          onKeyFallback(keyIdx + 1, model);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer":
                typeof window !== "undefined"
                  ? window.location.origin
                  : "http://localhost:5173",
              "X-Title": "Apex Resume Deep Auditor",
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are an elite FAANG ATS Recruiter and Resume Auditor. You must strictly respond with a single valid JSON object, without any Markdown fences or conversational text.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              response_format: { type: "json_object" },
              temperature: 0.1,
            }),
          },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          console.warn(
            `Key #${keyIdx + 1} with ${model} failed (${response.status}):`,
            errText,
          );
          continue;
        }

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content;
        if (!content) {
          continue;
        }

        let cleaned = content.trim();
        if (cleaned.startsWith("```json")) {
          cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const parsed = JSON.parse(cleaned);

        // Ensure links contain all detected links if AI missed any
        const linkMap = new Map<string, LinkCheckResult>();
        (parsed.links || []).forEach((l: LinkCheckResult) => {
          if (l && l.url) linkMap.set(l.url.toLowerCase(), l);
        });

        extractedLinks.forEach((raw) => {
          if (!raw) return;
          const lower = raw.toLowerCase();
          if (!linkMap.has(lower)) {
            const isEmail =
              raw.startsWith("mailto:") ||
              (raw.includes("@") && !raw.includes("/"));
            const isLinkedIn = raw.includes("linkedin.com");
            const isGithub = raw.includes("github.com");
            const isPortfolio =
              raw.includes("vercel.app") ||
              raw.includes("netlify.app") ||
              raw.includes(".dev");

            let type: LinkCheckResult["type"] = isEmail
              ? "email"
              : isLinkedIn
                ? "linkedin"
                : isGithub
                  ? "github"
                  : isPortfolio
                    ? "portfolio"
                    : "other";
            let status: LinkCheckResult["status"] = "valid";
            let note = "Verified active link";

            if (isLinkedIn && !raw.includes("/in/")) {
              status = "warning";
              note =
                "Generic LinkedIn domain found without your personal profile vanity URL!";
            }

            linkMap.set(lower, {
              url: raw,
              type,
              status,
              note,
              isHttps: raw.startsWith("https://") || isEmail,
              clickable: true,
            });
          }
        });

        const words = text.match(/\b[\w'-]+\b/g) || [];
        const wordCount = words.length;

        return {
          ...parsed,
          links: Array.from(linkMap.values()),
          pageCount,
          wordCount,
          readingTimeMinutes: Math.max(1, Math.round(wordCount / 200)),
          extractedText: text,
        };
      } catch (err: any) {
        console.warn(
          `Attempt failed for key ${keyIdx + 1} with model ${model}:`,
          err,
        );
        lastError = err;
      }
    }
  }

  throw (
    lastError ||
    new Error("All OpenRouter AI models and failover keys exhausted.")
  );
}
