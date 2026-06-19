import { useState } from 'react';
import { ScrollText, Copy, Download, Check, Sparkles } from 'lucide-react';

interface NoticeFormData {
  advocateName: string;
  advocateAddress: string;
  enrolmentNo: string;
  senderName: string;
  fatherName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  relevantAct: string;
  facts: string;
  causeOfAction: string;
  relevantSections: string;
  reliefSought: string;
  demand: string;
  timeLimit: string;
  noticeCost: string;
}

const initialForm: NoticeFormData = {
  advocateName: '',
  advocateAddress: '',
  enrolmentNo: '',
  senderName: '',
  fatherName: '',
  senderAddress: '',
  recipientName: '',
  recipientAddress: '',
  subject: '',
  relevantAct: '',
  facts: '',
  causeOfAction: '',
  relevantSections: '',
  reliefSought: '',
  demand: '',
  timeLimit: '15',
  noticeCost: '5000',
};

export default function LegalNoticeDrafter() {
  const [form, setForm] = useState<NoticeFormData>(initialForm);
  const [generatedNotice, setGeneratedNotice] = useState('');
  const [copied, setCopied] = useState(false);

  const updateForm = (key: keyof NoticeFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const generateNotice = () => {
    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const notice = `LEGAL NOTICE

Date: ${date}

Through: ${form.advocateName || '[Advocate Name]'}, Advocate
${form.advocateAddress || '[Advocate Address]'}
Enrolment No: ${form.enrolmentNo || '[Enrolment No.]'}

To,
${form.recipientName || '[Recipient Name]'}
${form.recipientAddress || '[Recipient Address]'}

Subject: Legal Notice under ${form.relevantAct || '[Relevant Act/Section]'} regarding ${form.subject || '[Subject Matter]'}

Sir/Madam,

Under instructions from and on behalf of my client ${form.senderName || '[Client Name]'}, S/o / D/o ${form.fatherName || '[Father\'s Name]'}, R/o ${form.senderAddress || '[Client Address]'}, I serve upon you the following Legal Notice:

1. FACTS OF THE CASE:

${form.facts || '[Detailed facts of the matter to be stated here]'}

2. CAUSE OF ACTION:

${form.causeOfAction || '[The cause of action and how the recipient is liable]'}

3. LEGAL PROVISIONS:

That the above acts/omissions on your part constitute violation of the provisions of ${form.relevantSections || '[Relevant Sections]'} and my client is entitled to the relief of ${form.reliefSought || '[Relief Sought]'}.

4. DEMAND:

You are hereby called upon to ${form.demand || '[specific demand/action required]'} within ${form.timeLimit || '15'} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, both civil and criminal, at your risk, cost and consequences, which please note.

5. That the cost of this notice amounting to Rs. ${form.noticeCost || '5,000'}/- (Rupees ${numberToWords(parseInt(form.noticeCost) || 5000)} Only) be borne by you.

6. That a copy of this notice is being retained in my office for record and further action.

You are advised to take this notice seriously and comply with the demand herein within the stipulated time.

${form.advocateName || '[Advocate Name]'}
Advocate
High Court of [State]
Enrolment No: ${form.enrolmentNo || '[Enrolment No.]'}
${form.advocateAddress || '[Advocate Address]'}`;

    setGeneratedNotice(notice);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNotice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fields: { key: keyof NoticeFormData; label: string; type: 'text' | 'textarea'; placeholder: string; half?: boolean }[] = [
    { key: 'advocateName', label: 'Advocate Name', type: 'text', placeholder: 'Adv. Rajesh Sharma', half: true },
    { key: 'enrolmentNo', label: 'Enrolment No.', type: 'text', placeholder: 'D/1234/2020', half: true },
    { key: 'advocateAddress', label: 'Advocate Address', type: 'text', placeholder: 'Chamber No. 5, District Court, New Delhi' },
    { key: 'senderName', label: 'Client/Sender Name', type: 'text', placeholder: 'Ram Kumar', half: true },
    { key: 'fatherName', label: "Father's Name", type: 'text', placeholder: 'Shyam Lal', half: true },
    { key: 'senderAddress', label: 'Client Address', type: 'text', placeholder: 'House No. 123, Sector 5, New Delhi' },
    { key: 'recipientName', label: 'Recipient Name (Noticee)', type: 'text', placeholder: 'ABC Pvt. Ltd. / Mr. John Doe' },
    { key: 'recipientAddress', label: 'Recipient Address', type: 'text', placeholder: 'Office No. 456, Business Park, Mumbai' },
    { key: 'subject', label: 'Subject of Notice', type: 'text', placeholder: 'Non-payment of dues / Breach of agreement / Illegal possession' },
    { key: 'relevantAct', label: 'Relevant Act', type: 'text', placeholder: 'Section 80 CPC / Indian Contract Act / RERA Act' },
    { key: 'relevantSections', label: 'Relevant Sections', type: 'text', placeholder: 'Section 73, 74 of Indian Contract Act, 1872' },
    { key: 'facts', label: 'Detailed Facts', type: 'textarea', placeholder: 'State the complete facts of the case including dates, amounts, agreements, and all relevant details...' },
    { key: 'causeOfAction', label: 'Cause of Action', type: 'textarea', placeholder: 'Explain how the recipient is liable and what wrong has been done...' },
    { key: 'reliefSought', label: 'Relief Sought', type: 'text', placeholder: 'Recovery of Rs. 5,00,000/- with interest / Specific performance / Damages' },
    { key: 'demand', label: 'Specific Demand', type: 'textarea', placeholder: 'Pay the outstanding amount of Rs. 5,00,000/- with interest at 18% per annum...' },
    { key: 'timeLimit', label: 'Time Limit (days)', type: 'text', placeholder: '15', half: true },
    { key: 'noticeCost', label: 'Notice Cost (₹)', type: 'text', placeholder: '5000', half: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
            <ScrollText size={20} />
          </div>
          Legal Notice Drafter
        </h2>
        <p className="text-slate-500 text-sm mt-1">Generate professional legal notices by filling in the details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Fill in Notice Details</h3>
          <div className="grid grid-cols-1 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.half ? 'inline-block w-[calc(50%-0.5rem)] align-top' : ''}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.key]}
                    onChange={(e) => updateForm(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => updateForm(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={generateNotice}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-200 mt-4"
          >
            <Sparkles size={16} /> Generate Legal Notice
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-slate-700">Generated Notice</h3>
            {generatedNotice && (
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 border border-emerald-200">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedNotice], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'legal_notice.txt';
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
            {generatedNotice ? (
              <pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">{generatedNotice}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center">
                <div>
                  <ScrollText size={48} className="mx-auto mb-3 text-slate-300" />
                  <p>Fill in the form and click "Generate" to create your legal notice</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}
