export interface LinkCheckResult {
  url: string;
  type: 'github' | 'linkedin' | 'portfolio' | 'email' | 'other';
  status: 'valid' | 'warning' | 'invalid';
  note: string;
  isHttps: boolean;
  clickable: boolean;
}

export interface MetricAnalysis {
  label: string;
  score: number; // 0 - 100
  weight: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  summary: string;
  details: string[];
}

export interface BulletPointAudit {
  original: string;
  section: string;
  score: number; // 1 - 10
  actionVerbFound: boolean;
  actionVerb: string | null;
  metricFound: boolean;
  metric: string | null;
  critique: string;
  improvedSuggestion: string;
}

export interface SectionAnalysis {
  name: string;
  detected: boolean;
  status: 'pass' | 'warning' | 'missing';
  importance: 'critical' | 'important' | 'recommended';
  positivePoints: string[];
  negativePoints: string[];
  recommendations: string[];
}

export interface DetailedAnalysisResult {
  candidateName: string;
  targetRole: string;
  overallScore: number;
  atsScore: number;
  readabilityScore: number;
  impactScore: number;
  brevityScore: number;
  pageCount: number;
  wordCount: number;
  readingTimeMinutes: number;

  summaryPitch: string;
  
  // Categorized Strengths & Red Flags
  topStrengths: string[];
  criticalRedFlags: string[];
  missedOpportunities: string[];
  quickFixes: string[];

  // Links
  links: LinkCheckResult[];

  // Section level audit
  sections: SectionAnalysis[];

  // Bullet point rewrite auditor
  bulletAudits: BulletPointAudit[];

  // Metrics
  metrics: MetricAnalysis[];

  // JD comparison (if JD provided)
  jdMatch?: {
    matchPercentage: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    jdReadinessSummary: string;
  };

  // Detected skills
  detectedSkills: {
    technical: string[];
    tools: string[];
    soft: string[];
  };

  extractedText: string;
}
