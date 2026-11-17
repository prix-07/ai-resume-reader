import type { DetailedAnalysisResult } from '../types';

export const SAMPLE_RESUME_TEXT = `
ALEX MORGAN
San Francisco, CA • alex.morgan@devmail.io • https://linkedin.com/in/alexmorgan-dev • https://github.com/alexmorgan-code • https://alexmorgan.dev

PROFESSIONAL SUMMARY
Results-driven Full Stack Software Engineer with 4+ years of experience engineering high-throughput distributed systems and responsive web applications. Proven track record of improving cloud scalability, reducing API latencies by 42%, and mentoring junior engineers.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, Go, SQL
Frontend: React, Next.js, Tailwind CSS, Redux Toolkit, WebSockets
Backend: Node.js, Express, FastAPI, PostgreSQL, Redis, MongoDB
DevOps & Cloud: Docker, Kubernetes, AWS (ECS, S3, RDS), CI/CD, Git

WORK EXPERIENCE
Senior Full Stack Engineer | Apex Cloud Solutions
June 2022 - Present | San Francisco, CA
• Spearheaded migration of legacy monolithic backend to microservices architecture using Node.js and Docker, reducing average API response times by 38% across 1.2M daily active users.
• Architected real-time analytics dashboard with React, TypeScript, and Redis pub/sub, cutting page render latencies from 3.2s to 680ms.
• Automated end-to-end integration test suites with Jest and Cypress, reducing regression bugs in production releases by 55%.
• Mentored 5 junior and mid-level software developers through weekly code reviews and architecture design discussions.

Software Engineer | Pulse Metrics Inc.
August 2020 - May 2022 | Austin, TX
• Developed and deployed scalable REST APIs with Python and FastAPI, handling over 5,000 requests per minute with 99.98% uptime.
• Optimized PostgreSQL query execution plans and database indexes, improving complex aggregation query performance by 62%.
• Collaborated with product designers to implement responsive client interfaces using React and Tailwind CSS, increasing checkout conversion by 18%.

KEY PROJECTS
OpenCommerce (Full Stack E-Commerce Platform) | https://github.com/alexmorgan-code/open-commerce
• Engineered high-performance headless commerce platform using Next.js 14, Stripe Payments, and PostgreSQL.
• Boosted search indexing performance by 3x using Redis caching layer and Algolia integration.

DevPulse (Real-time Cloud Monitoring Agent) | https://devpulse.alexmorgan.dev
• Built lightweight Go daemon and React dashboard to monitor server CPU/Memory health across 200+ container instances.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2016 - 2020
`;

export const SAMPLE_ANALYSIS: DetailedAnalysisResult = {
  candidateName: "Alex Morgan",
  targetRole: "Senior Full Stack Software Engineer",
  overallScore: 89,
  atsScore: 94,
  readabilityScore: 92,
  impactScore: 88,
  brevityScore: 95,
  pageCount: 1,
  wordCount: 418,
  readingTimeMinutes: 2,
  summaryPitch: "Exceptional candidate profile (89/100). Outstanding single-page density, verified live links (GitHub, LinkedIn, Portfolio), and Google X-Y-Z formula metrics in almost every bullet point.",
  topStrengths: [
    "Single-page Gold Standard: Fits ideal 1-page recruiter scan limit perfectly without overflowing.",
    "Data-Dense Accomplishments: 8+ quantifiable metrics (38% speedup, 1.2M DAU, 680ms, 99.98% uptime).",
    "Flawless Link Footprint: Verified live GitHub, personalized LinkedIn, custom portfolio, and email.",
    "Strong Action Verbs: Led bullets with 'Spearheaded', 'Architected', 'Automated', 'Engineered'."
  ],
  criticalRedFlags: [],
  missedOpportunities: [
    "Could add a brief Certifications or System Design honors section to maximize recruiter keyword parsing."
  ],
  quickFixes: [
    "Highlight specific cloud cost reduction figures ($ saved per month).",
    "Add open-source contributions in the summary section."
  ],
  links: [
    {
      url: "mailto:alex.morgan@devmail.io",
      type: "email",
      status: "valid",
      note: "Standard professional contact email",
      isHttps: true,
      clickable: true
    },
    {
      url: "https://linkedin.com/in/alexmorgan-dev",
      type: "linkedin",
      status: "valid",
      note: "Personalized custom LinkedIn vanity URL",
      isHttps: true,
      clickable: true
    },
    {
      url: "https://github.com/alexmorgan-code",
      type: "github",
      status: "valid",
      note: "Valid GitHub profile handle with repository showcases",
      isHttps: true,
      clickable: true
    },
    {
      url: "https://alexmorgan.dev",
      type: "portfolio",
      status: "valid",
      note: "Secure custom top-level domain portfolio",
      isHttps: true,
      clickable: true
    },
    {
      url: "https://devpulse.alexmorgan.dev",
      type: "portfolio",
      status: "valid",
      note: "Live interactive project deployment link",
      isHttps: true,
      clickable: true
    }
  ],
  sections: [
    {
      name: "Contact Information",
      detected: true,
      status: "pass",
      importance: "critical",
      positivePoints: [
        "Email, LinkedIn, GitHub, and Portfolio clearly visible at the top header",
        "Clean, modern layout without unnecessary street address details"
      ],
      negativePoints: [],
      recommendations: []
    },
    {
      name: "Summary / Objective",
      detected: true,
      status: "pass",
      importance: "recommended",
      positivePoints: [
        "Crisp 3-line overview focusing on quantifiable value add (42% latency reduction)"
      ],
      negativePoints: [],
      recommendations: []
    },
    {
      name: "Technical Skills",
      detected: true,
      status: "pass",
      importance: "critical",
      positivePoints: [
        "Clean categorization into Languages, Frontend, Backend, and DevOps/Cloud",
        "Strong ATS keyword density for full-stack software roles"
      ],
      negativePoints: [],
      recommendations: []
    },
    {
      name: "Experience / Work History",
      detected: true,
      status: "pass",
      importance: "critical",
      positivePoints: [
        "Chronological structure with accurate dates and job titles",
        "Every single bullet point follows the Google X-Y-Z accomplishment structure"
      ],
      negativePoints: [],
      recommendations: []
    },
    {
      name: "Projects",
      detected: true,
      status: "pass",
      importance: "critical",
      positivePoints: [
        "Projects include direct clickable GitHub repository and live demo links"
      ],
      negativePoints: [],
      recommendations: []
    },
    {
      name: "Education",
      detected: true,
      status: "pass",
      importance: "critical",
      positivePoints: [
        "Clear University, Degree, and graduation year"
      ],
      negativePoints: [],
      recommendations: []
    }
  ],
  bulletAudits: [
    {
      original: "Spearheaded migration of legacy monolithic backend to microservices architecture using Node.js and Docker, reducing average API response times by 38% across 1.2M daily active users.",
      section: "Experience",
      score: 10,
      actionVerbFound: true,
      actionVerb: "spearheaded",
      metricFound: true,
      metric: "38%",
      critique: "Flawless bullet point meeting Google X-Y-Z standard with clear scale (1.2M DAU).",
      improvedSuggestion: "Spearheaded migration of legacy monolithic backend to microservices architecture using Node.js and Docker, reducing average API response times by 38% across 1.2M daily active users."
    },
    {
      original: "Architected real-time analytics dashboard with React, TypeScript, and Redis pub/sub, cutting page render latencies from 3.2s to 680ms.",
      section: "Experience",
      score: 10,
      actionVerbFound: true,
      actionVerb: "architected",
      metricFound: true,
      metric: "680ms",
      critique: "Powerful contrast (3.2s down to 680ms) providing hard proof of engineering excellence.",
      improvedSuggestion: "Architected real-time analytics dashboard with React, TypeScript, and Redis pub/sub, cutting page render latencies from 3.2s to 680ms."
    },
    {
      original: "Automated end-to-end integration test suites with Jest and Cypress, reducing regression bugs in production releases by 55%.",
      section: "Experience",
      score: 9,
      actionVerbFound: true,
      actionVerb: "automated",
      metricFound: true,
      metric: "55%",
      critique: "Strong active ownership and quality assurance metric.",
      improvedSuggestion: "Automated end-to-end integration test suites with Jest and Cypress, reducing regression bugs in production releases by 55%."
    }
  ],
  metrics: [
    {
      label: "ATS Compatibility",
      score: 94,
      weight: 35,
      status: "excellent",
      summary: "Standard single-column format, standard font headers, and parseable link annotations.",
      details: [
        "✓ Clean email format detected",
        "✓ Verified personalized LinkedIn profile found",
        "✓ All critical ATS section headers present"
      ]
    },
    {
      label: "Impact & Quantifiability",
      score: 88,
      weight: 30,
      status: "excellent",
      summary: "8 Action verbs, 6 quantifiable ROI metrics, and zero passive fluff words.",
      details: [
        "Action verbs detected: spearheaded, architected, automated, mentored, developed",
        "ROI metrics: 38% speedup, 1.2M DAU, 680ms, 55% bugs, 5,000 req/min",
        "Proves outcome rather than merely listing responsibilities"
      ]
    },
    {
      label: "Length & Brevity Density",
      score: 95,
      weight: 20,
      status: "excellent",
      summary: "Single-page length, exactly 418 words, optimized for 6-second recruiter skim.",
      details: [
        "Page Count: 1 (Gold standard for developers)",
        "Word Count: 418 words (Optimal density)",
        "Zero visual clutter or dead space"
      ]
    },
    {
      label: "Structural Readability",
      score: 92,
      weight: 15,
      status: "excellent",
      summary: "Crisp bullet points, reverse chronological hierarchy, and seamless visual flow.",
      details: [
        "All bullets start with past-tense power verbs",
        "No orphaned lines or multi-page overflow"
      ]
    }
  ],
  detectedSkills: {
    technical: [
      "TypeScript", "JavaScript", "Python", "Go", "React", "Next.js", "Tailwind CSS",
      "Node.js", "FastAPI", "PostgreSQL", "Redis", "MongoDB", "Docker", "Kubernetes", "AWS"
    ],
    tools: ["Git", "Docker", "Jest", "Cypress", "Stripe"],
    soft: ["Leadership", "Mentoring", "System Design", "Agile"]
  },
  extractedText: SAMPLE_RESUME_TEXT
};
