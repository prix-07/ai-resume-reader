import * as pdfjsLib from 'pdfjs-dist';

// Point worker to standard cdnjs build for browser reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ExtractedPdfData {
  text: string;
  pageCount: number;
  extractedLinks: string[];
}

export async function extractTextAndLinksFromPdf(file: File): Promise<ExtractedPdfData> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  let fullText = '';
  const linksSet = new Set<string>();

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    
    // Extract text content
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter((s: string) => s.length > 0);
    
    fullText += pageStrings.join(' ') + '\n\n';

    // Extract link annotations
    try {
      const annotations = await page.getAnnotations();
      for (const annot of annotations) {
        if (annot.subtype === 'Link' && annot.url) {
          linksSet.add(annot.url);
        }
      }
    } catch (e) {
      console.warn('Could not read annotations for page', pageNum, e);
    }
  }

  // Also parse regex-based URLs in raw text if link annotations weren't embedded
  // Recognizes http/https or bare domains like bob-jade-tau.vercel.app, github.com/user, etc.
  const urlRegex = /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+(?:vercel\.app|netlify\.app|github\.com|linkedin\.com|com|dev|io|org|app|me)(?:\/[^\s<>"'{}|\\^`[\]]*)?/gi;
  const matches = fullText.match(urlRegex) || [];
  matches.forEach(m => {
    let clean = m.replace(/[.,;:)\]]+$/, '');
    if (!clean.includes('@') && !clean.startsWith('http')) {
      clean = 'https://' + clean;
    }
    if (!clean.includes('@')) {
      linksSet.add(clean);
    }
  });

  // Also look for emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatches = fullText.match(emailRegex) || [];
  emailMatches.forEach(email => {
    linksSet.add(`mailto:${email}`);
  });

  return {
    text: fullText.trim(),
    pageCount: pdfDoc.numPages,
    extractedLinks: Array.from(linksSet)
  };
}
