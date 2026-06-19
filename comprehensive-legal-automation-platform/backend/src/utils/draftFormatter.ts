/**
 * LegalEdge AI - Draft Formatting Engine
 * Stateless text processing for legal document formatting
 */

import type { FormatConfig } from '../types/index.js';

export interface FormattingResult {
  formattedText: string;
  statistics: {
    originalLength: number;
    formattedLength: number;
    paragraphCount: number;
    wordCount: number;
  };
}

// Legal document patterns for detection
const COURT_HEADER_PATTERNS = [
  /^(in the|before the|to the)/i,
  /^(hon'ble|honorable|honourable)/i,
  /^(high court|supreme court|district court|sessions court)/i,
  /^(criminal|civil|writ|original|appellate)/i,
];

const PARTY_PATTERNS = [
  /\s*\.{3,}\s*(petitioner|respondent|appellant|applicant|accused|complainant|plaintiff|defendant)/i,
  /^versus$/i,
  /^vs\.?$/i,
  /^v\.$/i,
];

const SECTION_HEADERS = [
  /^prayer\s*:?$/i,
  /^verification\s*:?$/i,
  /^affidavit\s*:?$/i,
  /^grounds\s*:?$/i,
  /^relief\s*(sought)?\s*:?$/i,
  /^facts\s*:?$/i,
  /^cause of action\s*:?$/i,
  /^jurisdiction\s*:?$/i,
  /^limitation\s*:?$/i,
  /^valuation\s*:?$/i,
  /^enclosures?\s*:?$/i,
  /^annexures?\s*:?$/i,
];

const LEGAL_STARTERS = [
  /^that\s+/i,
  /^whereas\s+/i,
  /^it is\s+/i,
  /^the\s+(petitioner|respondent|applicant|accused)\s+/i,
];

/**
 * Main formatting function - processes raw legal text
 */
export function formatLegalDraft(rawText: string, config: FormatConfig): FormattingResult {
  const originalLength = rawText.length;
  
  // Split into lines and clean
  let lines = rawText
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const formattedLines: string[] = [];
  let paragraphNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const processedLine = processLine(line, config, paragraphNumber);
    
    if (processedLine.shouldNumber) {
      paragraphNumber++;
    }
    
    if (processedLine.addBlankBefore && formattedLines.length > 0) {
      formattedLines.push('');
    }
    
    formattedLines.push(processedLine.text);
    
    if (processedLine.addBlankAfter) {
      formattedLines.push('');
    }
  }

  // Add legal header if configured
  let result = formattedLines.join('\n');
  
  if (config.legalHeader) {
    const date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    result = `Date: ${date}\n\n${result}`;
  }

  // Clean up multiple blank lines
  result = result.replace(/\n{3,}/g, '\n\n');

  // Apply double spacing if configured
  if (config.doubleSpacing) {
    result = result.replace(/\n\n/g, '\n\n\n');
  }

  // Calculate statistics
  const wordCount = result.split(/\s+/).filter((w) => w.length > 0).length;
  const paragraphCount = result.split(/\n\n+/).filter((p) => p.trim().length > 0).length;

  return {
    formattedText: result.trim(),
    statistics: {
      originalLength,
      formattedLength: result.length,
      paragraphCount,
      wordCount,
    },
  };
}

interface ProcessedLine {
  text: string;
  shouldNumber: boolean;
  addBlankBefore: boolean;
  addBlankAfter: boolean;
}

function processLine(
  line: string,
  config: FormatConfig,
  currentNumber: number
): ProcessedLine {
  const result: ProcessedLine = {
    text: line,
    shouldNumber: false,
    addBlankBefore: false,
    addBlankAfter: false,
  };

  // Check for court header patterns
  if (COURT_HEADER_PATTERNS.some((p) => p.test(line))) {
    result.text = config.courtFormatting ? line.toUpperCase() : capitalizeFirst(line);
    result.addBlankBefore = true;
    result.addBlankAfter = true;
    return result;
  }

  // Check for versus/party lines
  if (PARTY_PATTERNS.some((p) => p.test(line))) {
    if (/^(versus|vs\.?|v\.)$/i.test(line)) {
      result.text = config.courtFormatting 
        ? '                                    VERSUS' 
        : '                                    Versus';
      result.addBlankBefore = true;
      result.addBlankAfter = true;
    } else {
      result.text = config.autoCapitalize ? capitalizeProper(line) : line;
    }
    return result;
  }

  // Check for section headers
  if (SECTION_HEADERS.some((p) => p.test(line))) {
    result.text = config.courtFormatting ? line.toUpperCase() : capitalizeFirst(line);
    result.addBlankBefore = true;
    result.addBlankAfter = true;
    return result;
  }

  // Check for numbered paragraphs with legal starters
  if (config.numbering && LEGAL_STARTERS.some((p) => p.test(line))) {
    let formattedLine = config.autoCapitalize ? capitalizeFirst(line) : line;
    
    // Ensure proper ending punctuation
    if (config.courtFormatting && !/[.!?]$/.test(formattedLine)) {
      formattedLine += '.';
    }
    
    result.text = `${currentNumber}. ${formattedLine}`;
    result.shouldNumber = true;
    result.addBlankBefore = true;
    return result;
  }

  // Regular paragraph processing
  if (config.autoCapitalize) {
    result.text = capitalizeFirst(line);
  }

  // Ensure proper ending punctuation for court formatting
  if (config.courtFormatting && !/[.!?:,]$/.test(result.text) && result.text.length > 10) {
    result.text += '.';
  }

  return result;
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirst(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize first letter of each sentence
 */
function capitalizeProper(str: string): string {
  return str.replace(/(^\w|\.\s+\w)/g, (match) => match.toUpperCase());
}

/**
 * Convert number to Indian numbering words
 */
export function numberToIndianWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToIndianWords(Math.abs(num));

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
  ];

  const convertBelowHundred = (n: number): string => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  };

  const convertBelowThousand = (n: number): string => {
    if (n < 100) return convertBelowHundred(n);
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertBelowHundred(n % 100) : '');
  };

  if (num < 1000) return convertBelowThousand(num);
  if (num < 100000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertBelowThousand(thousands) + ' Thousand' + (remainder ? ' ' + convertBelowThousand(remainder) : '');
  }
  if (num < 10000000) {
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return convertBelowThousand(lakhs) + ' Lakh' + (remainder ? ' ' + numberToIndianWords(remainder) : '');
  }
  const crores = Math.floor(num / 10000000);
  const remainder = num % 10000000;
  return convertBelowThousand(crores) + ' Crore' + (remainder ? ' ' + numberToIndianWords(remainder) : '');
}

/**
 * Format date in legal document style
 */
export function formatLegalDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format currency with Indian numbering
 */
export function formatIndianCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}
