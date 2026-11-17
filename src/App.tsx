import React from 'react';
import { UploadSection } from './components/UploadSection';
import { ResultsDashboard } from './components/ResultsDashboard';
import { extractTextAndLinksFromPdf } from './utils/pdfExtractor';
import { analyzeResumeLocally } from './utils/analyzerEngine';
import { analyzeResumeWithOpenRouter } from './utils/openRouterService';
import { SAMPLE_ANALYSIS } from './data/sampleData';
import { type DetailedAnalysisResult } from './types';
import { ShieldCheck, Sparkles } from 'lucide-react';

export function App() {
  const [analysisResult, setAnalysisResult] = React.useState<DetailedAnalysisResult | null>(null);
  const [currentFileName, setCurrentFileName] = React.useState<string>('Nikhil_Rawat_Resume.pdf');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [statusMessage, setStatusMessage] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleAnalyze = async (file: File, jobDescription: string, modelChoice: 'openrouter' | 'local') => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentFileName(file.name);
    setStatusMessage('Extracting text and deep hyperlinks from PDF...');

    try {
      // 1. Extract text and link annotations from PDF using pdfjs
      const { text, pageCount, extractedLinks } = await extractTextAndLinksFromPdf(file);

      if (!text || text.trim().length < 50) {
        throw new Error('Unable to extract meaningful text from this PDF. Please check if the PDF contains scanned images instead of selectable text.');
      }

      let result: DetailedAnalysisResult;

      if (modelChoice === 'openrouter') {
        setStatusMessage('Auditing resume with OpenRouter AI (Primary Key 1 with Auto-Failover to Key 2)...');
        try {
          result = await analyzeResumeWithOpenRouter(
            text, 
            pageCount, 
            extractedLinks, 
            jobDescription,
            (keyIdx, model) => {
              setStatusMessage(`Analyzing with OpenRouter Key #${keyIdx} (${model})...`);
            }
          );
        } catch (openRouterErr: any) {
          console.warn('OpenRouter API failover exhausted, falling back to local deep audit engine:', openRouterErr);
          setStatusMessage('OpenRouter reached limit, running local deep deterministic engine fallback...');
          result = analyzeResumeLocally(text, pageCount, extractedLinks, jobDescription);
        }
      } else {
        setStatusMessage('Running comprehensive local deep audit engine...');
        result = analyzeResumeLocally(text, pageCount, extractedLinks, jobDescription);
      }

      setAnalysisResult(result);
    } catch (err: any) {
      console.error('Error during analysis:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while analyzing the resume PDF.');
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  const loadNikhilResume = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('Fetching and analyzing Nikhil_Rawat_Resume.pdf...');
    try {
      const response = await fetch('/Nikhil_Rawat_Resume.pdf');
      const blob = await response.blob();
      const file = new File([blob], 'Nikhil_Rawat_Resume.pdf', { type: 'application/pdf' });
      await handleAnalyze(file, '', 'openrouter');
    } catch (e: any) {
      console.error('Could not fetch Nikhil resume:', e);
      setErrorMessage('Failed to load Nikhil_Rawat_Resume.pdf from server.');
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    setCurrentFileName('Alex-Morgan-Senior-FullStack.pdf');
    setAnalysisResult(SAMPLE_ANALYSIS);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Apex<span className="text-indigo-400">Resume</span> Auditor
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO v2.5
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              100% Client-Side Privacy First
            </span>
            <button
              onClick={loadSample}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              Demo Preview
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-center">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 font-bold ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {!analysisResult ? (
          <UploadSection 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            loadSampleResume={loadSample} 
            loadNikhilResume={loadNikhilResume}
            statusMessage={statusMessage}
          />
        ) : (
          <ResultsDashboard 
            data={analysisResult} 
            onReset={() => setAnalysisResult(null)} 
            fileName={currentFileName} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Built with deep ATS parsing algorithms, PDF.js, Google X-Y-Z formula & Lucide icons.</span>
          <span>Fast, accurate, single-page & link verified.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
