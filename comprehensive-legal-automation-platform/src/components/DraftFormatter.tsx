import { useState } from 'react';
import { FileText, Wand2, Copy, Download, Check, RotateCcw, Type, AlignLeft, AlignCenter } from 'lucide-react';

const sampleDraft = `to the honorable court of sessions judge at delhi.
criminal misc application for bail
in the matter of ram kumar son of shyam lal accused vs state of delhi
the applicant most humbly submits as follows
that the applicant was arrested on 15 january 2024 in fir no 234 of 2023 under sections 420 467 468 471 of ipc at ps saket delhi
that the investigation is complete and chargesheet has been filed
that the applicant is a respectable citizen with deep roots in society
that there is no chance of the applicant fleeing from justice
that the applicant is ready to furnish bail bonds as directed by this court
prayer
it is prayed that this court may release the applicant on bail
applicant through advocate
ram kumar through adv rajesh sharma`;

export default function DraftFormatter() {
  const [inputText, setInputText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formatOptions, setFormatOptions] = useState({
    capitalize: true,
    addSpacing: true,
    numberParagraphs: true,
    addHeaders: true,
    legalFormatting: true,
  });

  const formatDraft = () => {
    if (!inputText.trim()) return;
    setIsFormatting(true);

    setTimeout(() => {
      let text = inputText;

      // Split into lines
      let lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      let formatted: string[] = [];
      let paragraphNum = 1;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Detect and format headers/titles
        const isHeader = /^(to the|in the|before the|criminal|civil|writ|petition|application|prayer|verification|most respectfully|humble|versus|vs|v\.|complainant|respondent|petitioner|applicant|accused)/i.test(line);
        const isParty = /^(.*?\.\.\.|versus|vs\.|v\.)/i.test(line);
        const isPrayer = /^prayer/i.test(line);
        const isVerification = /^verification/i.test(line);
        const isCourt = /^(to the|in the|before the)/i.test(line);

        if (formatOptions.capitalize) {
          // Capitalize first letter of each sentence
          line = line.replace(/(^\w|\.\s+\w)/g, m => m.toUpperCase());
        }

        if (isCourt && formatOptions.addHeaders) {
          line = line.toUpperCase();
          formatted.push('');
          formatted.push(line);
          formatted.push('');
        } else if (isPrayer || isVerification) {
          formatted.push('');
          formatted.push(line.toUpperCase());
          formatted.push('');
        } else if (/^(versus|vs\.?|v\.)/i.test(line)) {
          formatted.push('');
          formatted.push('                                    VERSUS');
          formatted.push('');
        } else if (isParty) {
          formatted.push(line);
        } else if (isHeader && formatOptions.addHeaders) {
          if (formatOptions.legalFormatting) {
            line = line.toUpperCase();
          }
          formatted.push('');
          formatted.push(line);
          formatted.push('');
        } else {
          // Regular paragraph
          if (formatOptions.numberParagraphs && /^that\s/i.test(line)) {
            line = `${paragraphNum}. ${line.charAt(0).toUpperCase() + line.slice(1)}`;
            paragraphNum++;
          } else if (formatOptions.capitalize) {
            line = line.charAt(0).toUpperCase() + line.slice(1);
          }

          // Ensure sentence ends with period
          if (formatOptions.legalFormatting && !/[.!?]$/.test(line)) {
            line += '.';
          }

          if (formatOptions.addSpacing) {
            formatted.push('');
          }
          formatted.push(line);
        }
      }

      // Add legal header if not present
      let result = formatted.join('\n').trim();

      // Clean up multiple blank lines
      result = result.replace(/\n{3,}/g, '\n\n');

      // Add proper spacing and indentation
      if (formatOptions.legalFormatting) {
        // Add standard legal document header line
        const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        result = `Date: ${date}\n\n${result}`;
      }

      setFormattedText(result);
      setIsFormatting(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInputText(sampleDraft);
    setFormattedText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <FileText size={20} />
            </div>
            Draft Formatter
          </h2>
          <p className="text-slate-500 text-sm mt-1">Format your legal draft professionally in one click</p>
        </div>
        <button
          onClick={loadSample}
          className="text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-medium transition-colors flex items-center gap-2"
        >
          <RotateCcw size={14} /> Load Sample
        </button>
      </div>

      {/* Format Options */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Wand2 size={14} className="text-blue-600" /> Formatting Options
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'capitalize' as const, label: 'Auto Capitalize', icon: Type },
            { key: 'addSpacing' as const, label: 'Add Spacing', icon: AlignLeft },
            { key: 'numberParagraphs' as const, label: 'Number Paragraphs', icon: AlignCenter },
            { key: 'addHeaders' as const, label: 'Format Headers', icon: FileText },
            { key: 'legalFormatting' as const, label: 'Legal Formatting', icon: Wand2 },
          ].map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setFormatOptions(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border
                  ${formatOptions[opt.key]
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }
                `}
              >
                <Icon size={13} />
                {opt.label}
                {formatOptions[opt.key] && <Check size={12} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Input Draft (Unformatted)</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your unformatted legal draft here..."
            className="w-full h-[500px] p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-slate-400">{inputText.length} characters</span>
            <button
              onClick={formatDraft}
              disabled={!inputText.trim() || isFormatting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormatting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Formatting...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Format Draft
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700">Formatted Output</label>
            {formattedText && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([formattedText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'formatted_draft.txt';
                    a.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            )}
          </div>
          <div className="w-full h-[500px] p-4 rounded-xl border border-slate-200 bg-slate-50 overflow-y-auto shadow-sm">
            {formattedText ? (
              <pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap">{formattedText}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                <div className="text-center">
                  <Wand2 size={40} className="mx-auto mb-3 text-slate-300" />
                  <p>Formatted draft will appear here</p>
                  <p className="text-xs mt-1">Paste your draft and click "Format Draft"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
