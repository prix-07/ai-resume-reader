import React from 'react';
import { 
  FileUp, 
  Sparkles, 
  CheckCircle, 
  Key, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface UploadSectionProps {
  onAnalyze: (file: File, jobDescription: string, modelChoice: 'openrouter' | 'local') => void;
  isLoading: boolean;
  loadSampleResume: () => void;
  loadNikhilResume: () => void;
  statusMessage?: string;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  onAnalyze, 
  isLoading, 
  loadSampleResume,
  loadNikhilResume,
  statusMessage
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [jobDescription, setJobDescription] = React.useState('');
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [engineMode, setEngineMode] = React.useState<'openrouter' | 'local'>('openrouter');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF document (.pdf format)');
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag-and-drop a resume PDF file.');
      return;
    }
    setError(null);
    onAnalyze(file, jobDescription, engineMode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen Deep ATS & Career Intelligence Engine</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Resume Analyzer</span> & Auditor
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Full-spectrum analysis: Live link checker (GitHub, LinkedIn, Portfolios), Google X-Y-Z bullet rewrites, ATS scoring, single-page density, plus positive & negative points breakdown.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone Card */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : file
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
          }`}
          onClick={() => document.getElementById('resume-upload-input')?.click()}
        >
          <input
            id="resume-upload-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center pointer-events-none">
            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-white mb-1">{file.name}</span>
                <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</span>
                <span className="mt-3 text-xs text-indigo-400 font-medium">Click to replace file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
                  <FileUp className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Drag and drop your Resume PDF here
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Supports standard PDF exports from MS Word, Google Docs, Canva, LaTeX
                </p>
                <span className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 pointer-events-auto">
                  Browse File
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Optional Job Description Input */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Target Job Description (Optional for JD Match Score)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target role requirements or job posting text here to calculate skill overlap, missing keywords, and role match percentage..."
            rows={3}
            className="w-full p-3 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-600 resize-none font-sans"
          />
        </div>

        {/* Dual AI Engine Indicator */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 border border-indigo-800/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Dual-Key OpenRouter AI Engine</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Auto-Failover Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pre-configured with 2 redundant high-throughput OpenRouter keys. Automatically flips to Key 2 if Key 1 hits limits, and falls back to Key 1 seamlessly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setEngineMode('openrouter')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  engineMode === 'openrouter'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AI Reasoning (OpenRouter)
              </button>
              <button
                type="button"
                onClick={() => setEngineMode('local')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  engineMode === 'local'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Local Parser
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Button & Sample Resume Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all ${
              isLoading
                ? 'bg-slate-800 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/20 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Running Deep AI Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Complete Resume Audit</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={loadNikhilResume}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-4 rounded-2xl text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/60 transition-all cursor-pointer whitespace-nowrap"
          >
            Load Nikhil's Resume
          </button>

          <button
            type="button"
            onClick={loadSampleResume}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-4 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer whitespace-nowrap"
          >
            Demo Senior Resume
          </button>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850">
            <span className="text-[11px] font-semibold text-slate-300 block">Link Integrity</span>
            <span className="text-[10px] text-slate-500">GitHub, LinkedIn, Portfolios</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850">
            <span className="text-[11px] font-semibold text-slate-300 block">Google X-Y-Z</span>
            <span className="text-[10px] text-slate-500">Bullet rewrites & metrics</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850">
            <span className="text-[11px] font-semibold text-slate-300 block">Single-Page Density</span>
            <span className="text-[10px] text-slate-500">Recruiter 6s scan rule</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850">
            <span className="text-[11px] font-semibold text-slate-300 block">ATS Score Card</span>
            <span className="text-[10px] text-slate-500">Positives & Red Flags</span>
          </div>
        </div>
      </form>
    </div>
  );
};
