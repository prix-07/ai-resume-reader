import React from 'react';
import { 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Clock, 
  Award, 
  Cpu, 
  Wand2, 
  RefreshCw, 
  Download, 
  Check, 
  Copy,
  Layers,
  BookOpen,
  Link2,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DetailedAnalysisResult } from '../types';

interface ResultsDashboardProps {
  data: DetailedAnalysisResult;
  onReset: () => void;
  fileName: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onReset, fileName }) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'sections' | 'bullets' | 'links' | 'skills' | 'text'>('overview');
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (data.overallScore >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [data.overallScore]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
    if (score >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/25';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#f43f5e';
  };

  const exportAuditSummary = () => {
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Deep-Resume-Audit-${fileName.replace(/\.[^/.]+$/, '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 mb-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">{data.candidateName || fileName}</h2>
              {data.targetRole && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {data.targetRole}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {data.readingTimeMinutes} min scan
              </span>
              <span>•</span>
              <span>{data.wordCount} words</span>
              <span>•</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                data.pageCount === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {data.pageCount} {data.pageCount === 1 ? 'Page (Gold Standard ✓)' : 'Pages'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAuditSummary}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export Audit Report
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-indigo-200 hover:text-white bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800 hover:to-purple-800 border border-indigo-700/50 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            Analyze New Resume
          </button>
        </div>
      </div>

      {/* Main Score & Core Metrics Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Overall Score Radial Card */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800 p-7 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              Comprehensive ATS Score
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              FAANG Calibrated
            </span>
          </div>

          {/* Big Radial Progress Circle */}
          <div className="relative w-44 h-44 flex items-center justify-center my-3">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-800/80"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={getScoreStroke(data.overallScore)}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.overallScore / 100)}`}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-black tracking-tight text-white">{data.overallScore}</span>
              <span className="text-xs text-slate-400 font-semibold mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="w-full">
            <div className="px-3.5 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 shadow-sm mb-3">
              {data.overallScore >= 85 ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Top Tier Candidate (95th Percentile)
                </span>
              ) : data.overallScore >= 70 ? (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Highly Competitive (Minor Fixes Needed)
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> High Risk of ATS Filter Drop
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-left bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/70">
              {data.summaryPitch}
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.metrics.map((metric, idx) => {
            const colors = getScoreColor(metric.score);
            return (
              <div 
                key={idx}
                className="rounded-3xl bg-slate-900/75 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {metric.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${colors}`}>
                      {metric.score}%
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${metric.score}%`,
                        backgroundColor: getScoreStroke(metric.score)
                      }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {metric.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {metric.details.slice(0, 3).map((det, dIdx) => (
                    <div key={dIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span className="line-clamp-1">{det}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Plan Banner */}
      {data.quickFixes && data.quickFixes.length > 0 && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-slate-900/80 border border-indigo-700/40 shadow-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Instant High-ROI Quick Fixes</h3>
              <p className="text-xs text-slate-400">Make these 3 changes in 10 minutes to instantly elevate your callback rate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.quickFixes.map((fix, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-900/40 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Strengths & Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Strengths */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-emerald-900/40 relative shadow-lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Top Strengths & Competitive Edges</h3>
              <p className="text-[11px] text-slate-400">Verified strengths making this resume stand out</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.topStrengths.map((str, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-emerald-400 font-bold text-sm mt-0.5">✓</span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{str}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Red Flags & Risks */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-rose-900/40 relative shadow-lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Critical Red Flags & Rejection Risks</h3>
              <p className="text-[11px] text-slate-400">Immediate friction points recruiters notice</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.criticalRedFlags.length > 0 ? (
              data.criticalRedFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-rose-900/50">
                  <span className="text-rose-400 font-bold text-sm mt-0.5">✗</span>
                  <p className="text-xs text-rose-200 leading-relaxed font-medium">{flag}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                Zero critical red flags detected! Structure and link integrity pass standard ATS audits.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 mb-6 overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'overview', label: 'Section-by-Section Audit', icon: Layers },
          { id: 'bullets', label: 'Google X-Y-Z Bullet Rewrites', icon: Wand2, count: data.bulletAudits.length },
          { id: 'links', label: 'Live External Links & Profiles', icon: Link2, count: data.links.length },
          { id: 'skills', label: 'Skills & Tech Stack', icon: Cpu },
          { id: 'text', label: 'Raw Extracted Text', icon: BookOpen },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Section-by-Section Detailed Audit */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-200">ATS Section Header Detection & Content Analysis</h4>
            <span className="text-xs text-slate-500">Every single section evaluated against industry standards</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.sections.map((section, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {section.status === 'pass' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : section.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                    <span className="text-sm font-bold text-white">{section.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                      section.importance === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {section.importance}
                    </span>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${
                    section.status === 'pass'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : section.status === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {section.status === 'pass' ? 'Section Found & Clean' : section.status === 'warning' ? 'Needs Improvement' : 'Missing Critical Section'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                  {/* Positives */}
                  <div className="space-y-1.5">
                    <span className="text-emerald-400 font-bold block mb-1">Positives:</span>
                    {section.positivePoints && section.positivePoints.length > 0 ? (
                      section.positivePoints.map((p, i) => (
                        <p key={i} className="text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span> {p}
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No standout positive elements</p>
                    )}
                  </div>

                  {/* Negatives & Recommendations */}
                  <div className="space-y-1.5">
                    <span className="text-amber-400 font-bold block mb-1">Improvements & Recommendations:</span>
                    {section.negativePoints && section.negativePoints.map((n, i) => (
                      <p key={i} className="text-rose-300 flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">✗</span> {n}
                      </p>
                    ))}
                    {section.recommendations && section.recommendations.map((r, i) => (
                      <p key={i} className="text-indigo-300 flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">💡</span> {r}
                      </p>
                    ))}
                    {(!section.negativePoints || section.negativePoints.length === 0) && (!section.recommendations || section.recommendations.length === 0) && (
                      <p className="text-emerald-400 italic">Fully optimized</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Bullet Point Rewrites */}
      {activeTab === 'bullets' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-300 flex items-start gap-3 shadow-md">
            <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Google X-Y-Z Formula Engine: </strong>
              Top recruiters score bullets by evaluating: <code className="text-indigo-300 font-mono">"Accomplished [X] as measured by [Y], by doing [Z]"</code>. Each bullet below is evaluated with a rewritten high-impact alternative.
            </div>
          </div>

          <div className="space-y-4">
            {data.bulletAudits.length > 0 ? (
              data.bulletAudits.map((bullet, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${getScoreColor(bullet.score * 10)}`}>
                        {bullet.score} / 10
                      </span>
                      <span className="text-xs font-semibold text-slate-300">{bullet.section || 'Accomplishment'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${bullet.actionVerbFound ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {bullet.actionVerbFound ? `Action Verb: ${bullet.actionVerb}` : 'No Action Verb'}
                      </span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${bullet.metricFound ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {bullet.metricFound ? `Metric: ${bullet.metric}` : 'No Measurable Metric'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-3 italic">{bullet.critique}</p>

                  {/* Original Bullet */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono mb-3 leading-relaxed">
                    <span className="text-slate-500 block mb-1 text-[10px] uppercase tracking-wider font-sans font-bold">Original Bullet from Resume</span>
                    {bullet.original}
                  </div>

                  {/* Improved Suggestion */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-purple-950/40 border border-indigo-700/50 text-xs text-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" /> Google X-Y-Z Recommended Rewrite
                      </span>
                      <button
                        onClick={() => copyToClipboard(bullet.improvedSuggestion, idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-[11px] font-semibold text-indigo-200 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Rewrite
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-semibold text-white leading-relaxed">{bullet.improvedSuggestion}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No distinct bullet points identified.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Live External Links & Profiles */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-200">Live External Link & Contact Verification</h4>
            <span className="text-xs text-slate-500">Recruiters inspect GitHub, LinkedIn and Portfolio before calling</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.links.map((link, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-200">
                      {link.type}
                    </span>
                    <span className={`text-[11px] font-bold flex items-center gap-1.5 ${
                      link.status === 'valid' ? 'text-emerald-400' : link.status === 'warning' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {link.status === 'valid' && <CheckCircle2 className="w-4 h-4" />}
                      {link.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                      {link.status === 'invalid' && <XCircle className="w-4 h-4" />}
                      {link.status.toUpperCase()}
                    </span>
                  </div>

                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-mono break-all inline-flex items-center gap-1.5 my-1 font-semibold"
                  >
                    <span>{link.url}</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">{link.note}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>HTTPS Secure: {link.isHttps ? 'Yes ✓' : 'No ✗'}</span>
                  <span>Clickable In PDF: {link.clickable ? 'Verified ✓' : 'Plain Text'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Skills Catalog */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Indexed Technical Skills ({data.detectedSkills.technical.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.detectedSkills.technical.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md">
              <h5 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Developer Tools & Platforms</h5>
              <div className="flex flex-wrap gap-2">
                {data.detectedSkills.tools.map((tool, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-950/50 border border-indigo-800/50 text-xs font-medium text-indigo-300">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md">
              <h5 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Professional & Soft Competencies</h5>
              <div className="flex flex-wrap gap-2">
                {data.detectedSkills.soft.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-800/50 text-xs font-medium text-purple-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Raw Extracted Text */}
      {activeTab === 'text' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Raw Text Parsed by ATS Parser</span>
            <button
              onClick={() => copyToClipboard(data.extractedText, 999)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              {copiedIndex === 999 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Raw Text
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed border border-slate-850">
            {data.extractedText}
          </pre>
        </div>
      )}
    </div>
  );
};
