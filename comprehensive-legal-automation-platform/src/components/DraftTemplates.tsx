import { useState } from 'react';
import { Gavel, Copy, Download, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { draftTemplates, type DraftTemplate } from '../data/legalData';

export default function DraftTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<DraftTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = [...new Set(draftTemplates.map(t => t.category))];

  const selectTemplate = (template: DraftTemplate) => {
    setSelectedTemplate(template);
    setFormValues({});
    setGeneratedDraft('');
  };

  const generateDraft = () => {
    if (!selectedTemplate) return;
    let text = selectedTemplate.template;

    // Replace all template variables
    Object.entries(formValues).forEach(([key, value]) => {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });

    // Replace remaining template variables with placeholders
    text = text.replace(/{{(\w+)}}/g, '[$1]');

    // Add date
    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    text = text.replace(/{{date}}/g, date);
    text = text.replace(/{{year}}/g, new Date().getFullYear().toString());

    setGeneratedDraft(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (selectedTemplate) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedTemplate(null); setGeneratedDraft(''); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
          >
            <ArrowLeft size={16} /> Back to Templates
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-3xl">{selectedTemplate.icon}</span>
            {selectedTemplate.name}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{selectedTemplate.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedTemplate.relatedSections.map(s => (
              <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">{s}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Fill in Details</h3>
            {selectedTemplate.requiredFields.map(field => (
              <div key={field}>
                <label className="block text-xs font-semibold text-slate-600 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {['facts', 'grounds', 'demand', 'causeOfAction', 'prayer', 'evidence', 'incident', 'informationSought', 'briefFacts', 'deficiency', 'apprehension'].includes(field) ? (
                  <textarea
                    value={formValues[field] || ''}
                    onChange={(e) => setFormValues(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}...`}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={formValues[field] || ''}
                    onChange={(e) => setFormValues(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}...`}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )}
              </div>
            ))}
            <button
              onClick={generateDraft}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 mt-2"
            >
              Generate {selectedTemplate.name}
            </button>
          </div>

          {/* Output */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-700">Generated Draft</h3>
              {generatedDraft && (
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 border border-emerald-200">
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedDraft], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '_')}.txt`;
                      a.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200"
                  >
                    <Download size={12} /> Download
                  </button>
                </div>
              )}
            </div>
            <div className="w-full h-[700px] p-5 rounded-xl border border-slate-200 bg-slate-50 overflow-y-auto shadow-sm">
              {generatedDraft ? (
                <pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">{generatedDraft}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center">
                  <div>
                    <Gavel size={48} className="mx-auto mb-3 text-slate-300" />
                    <p>Fill in the form to generate your legal draft</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center text-white">
            <Gavel size={20} />
          </div>
          Legal Draft Templates
        </h2>
        <p className="text-slate-500 text-sm mt-1">Choose from {draftTemplates.length} professionally crafted legal templates</p>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftTemplates.filter(t => t.category === category).map(template => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template)}
                className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{template.icon}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors mt-1" />
                </div>
                <h4 className="font-bold text-slate-900 mt-3">{template.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {template.relatedSections.slice(0, 2).map(s => (
                    <span key={s} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{s}</span>
                  ))}
                  {template.relatedSections.length > 2 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">+{template.relatedSections.length - 2}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
