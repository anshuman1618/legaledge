import { useState } from 'react';
import { FileCheck, Copy, Download, Check, Sparkles, Info } from 'lucide-react';

interface RTIFormData {
  applicantName: string;
  fatherName: string;
  applicantAddress: string;
  phone: string;
  email: string;
  department: string;
  departmentAddress: string;
  informationSought: string;
  period: string;
  paymentMode: string;
  bplStatus: string;
  place: string;
}

const initialForm: RTIFormData = {
  applicantName: '',
  fatherName: '',
  applicantAddress: '',
  phone: '',
  email: '',
  department: '',
  departmentAddress: '',
  informationSought: '',
  period: '',
  paymentMode: 'Indian Postal Order',
  bplStatus: 'Not Applicable',
  place: '',
};

const rtiTips = [
  'Fee: ₹10 for Central Govt., varies for State Govt.',
  'Response time: 30 days (48 hours for life/liberty)',
  'First Appeal: Within 30 days of response/non-response',
  'Second Appeal: Within 90 days to Information Commission',
  'No need to give reasons for seeking information',
  'If wrongly addressed, PIO must transfer within 5 days',
  'BPL applicants are exempt from fee',
  'Information can be sought for any period',
];

export default function RTIApplication() {
  const [form, setForm] = useState<RTIFormData>(initialForm);
  const [generatedRTI, setGeneratedRTI] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeType, setActiveType] = useState<'application' | 'first-appeal' | 'complaint'>('application');

  const updateForm = (key: keyof RTIFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const generateRTI = () => {
    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    let rtiText = '';

    if (activeType === 'application') {
      rtiText = `APPLICATION UNDER SECTION 6 OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${date}

To,
The Public Information Officer,
${form.department || '[Department/Office Name]'},
${form.departmentAddress || '[Department Address]'}

Subject: Request for Information under the Right to Information Act, 2005

Sir/Madam,

I, ${form.applicantName || '[Applicant Name]'}, S/o / D/o ${form.fatherName || "[Father's Name]"}, R/o ${form.applicantAddress || '[Address]'}, do hereby request the following information under Section 6 of the Right to Information Act, 2005:

INFORMATION SOUGHT:

${form.informationSought || '[Specify the information you seek in detail - be specific about documents, records, dates, file numbers, etc.]'}

PERIOD OF INFORMATION: ${form.period || '[Specify the period, e.g., From January 2023 to December 2024]'}

ENCLOSURES:
1. Application fee of Rs. 10/- (Rupees Ten Only) by way of ${form.paymentMode || 'Indian Postal Order'}.
2. BPL Certificate: ${form.bplStatus || 'Not Applicable'}

DECLARATION:
I hereby declare that:
(a) I am a citizen of India.
(b) The information sought does not relate to any matter that has been expressly excluded under Section 8 and Section 9 of the RTI Act, 2005.
(c) The above particulars given by me are true and correct to the best of my knowledge and belief.

REQUEST:
1. Kindly provide the above information within the statutory period of 30 days as prescribed under Section 7(1) of the RTI Act, 2005.
2. If the information sought or a part thereof falls within the jurisdiction of another public authority or is supplied by another public authority, kindly transfer the application or such part of it to such authority under Section 6(3) of the Act within 5 days of receipt.
3. If the information is to be provided in the form of certified copies, please provide the same on payment of additional fee as prescribed.

I would prefer to receive the information in the form of: ☐ Photocopies ☐ Certified Copies ☐ Electronic Format (CD/Email)

Place: ${form.place || '[Place]'}
Date: ${date}

Yours faithfully,

${form.applicantName || '[Applicant Name]'}
${form.applicantAddress || '[Address]'}
Phone: ${form.phone || '[Phone]'}
Email: ${form.email || '[Email]'}`;
    } else if (activeType === 'first-appeal') {
      rtiText = `FIRST APPEAL UNDER SECTION 19(1) OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${date}

To,
The First Appellate Authority,
${form.department || '[Department/Office Name]'},
${form.departmentAddress || '[Department Address]'}

Subject: First Appeal under Section 19(1) of the RTI Act, 2005 against the order/non-response of PIO

Sir/Madam,

I, ${form.applicantName || '[Applicant Name]'}, S/o / D/o ${form.fatherName || "[Father's Name]"}, R/o ${form.applicantAddress || '[Address]'}, do hereby prefer this First Appeal under Section 19(1) of the Right to Information Act, 2005.

1. DETAILS OF ORIGINAL APPLICATION:
   Application dated: [Date of original RTI application]
   Filed before: Public Information Officer, ${form.department || '[Department]'}
   Date of receipt by PIO: [Date]

2. INFORMATION SOUGHT IN ORIGINAL APPLICATION:
${form.informationSought || '[State the information that was sought]'}

3. GROUNDS OF APPEAL:
${form.period || '[State whether - No response received within 30 days / Information provided is incomplete / Excess fee charged / Unreasonable denial of information / Any other ground]'}

4. RELIEF SOUGHT:
   a) Direction to the PIO to provide the information sought
   b) Imposition of penalty on PIO under Section 20 of the RTI Act
   c) Award of compensation for any loss or detriment suffered

PRAYER:
It is prayed that the First Appellate Authority may be pleased to:
(a) Call for the records from the PIO
(b) Direct the PIO to provide the information as sought
(c) Pass any other order as deemed fit

Place: ${form.place || '[Place]'}
Date: ${date}

${form.applicantName || '[Applicant Name]'}
${form.applicantAddress || '[Address]'}
Phone: ${form.phone || '[Phone]'}`;
    } else {
      rtiText = `COMPLAINT UNDER SECTION 18 OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${date}

To,
The Central/State Information Commissioner,
Central/State Information Commission,
[Address of Information Commission]

Subject: Complaint under Section 18 of the RTI Act, 2005

Sir/Madam,

I, ${form.applicantName || '[Applicant Name]'}, S/o / D/o ${form.fatherName || "[Father's Name]"}, R/o ${form.applicantAddress || '[Address]'}, do hereby file this complaint under Section 18 of the Right to Information Act, 2005.

1. Name of the PIO against whom complaint is filed:
   [PIO Name], ${form.department || '[Department]'}

2. FACTS:
${form.informationSought || '[State the complete facts]'}

3. GROUNDS:
${form.period || '[State the specific grounds of complaint]'}

4. RELIEF SOUGHT:
   a) Direction to provide information
   b) Penalty on PIO under Section 20
   c) Compensation for loss suffered

Place: ${form.place || '[Place]'}
Date: ${date}

${form.applicantName || '[Applicant Name]'}
Phone: ${form.phone || '[Phone]'}
Email: ${form.email || '[Email]'}`;
    }

    setGeneratedRTI(rtiText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRTI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
            <FileCheck size={20} />
          </div>
          RTI Application Drafter
        </h2>
        <p className="text-slate-500 text-sm mt-1">Generate RTI Applications, First Appeals & Complaints under RTI Act, 2005</p>
      </div>

      {/* Type Selector */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: 'application' as const, label: 'RTI Application' },
          { id: 'first-appeal' as const, label: 'First Appeal' },
          { id: 'complaint' as const, label: 'Complaint u/s 18' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveType(t.id); setGeneratedRTI(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeType === t.id
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
        <h4 className="text-xs font-bold text-cyan-800 mb-2 flex items-center gap-1.5">
          <Info size={13} /> RTI Quick Tips
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {rtiTips.map((tip, i) => (
            <p key={i} className="text-xs text-cyan-700 flex items-start gap-1.5">
              <span className="text-cyan-400 mt-0.5">•</span> {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">
            {activeType === 'application' ? 'RTI Application Details' : activeType === 'first-appeal' ? 'First Appeal Details' : 'Complaint Details'}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Applicant Name</label>
              <input type="text" value={form.applicantName} onChange={(e) => updateForm('applicantName', e.target.value)} placeholder="Your full name" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Father's Name</label>
              <input type="text" value={form.fatherName} onChange={(e) => updateForm('fatherName', e.target.value)} placeholder="Father's name" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
            <input type="text" value={form.applicantAddress} onChange={(e) => updateForm('applicantAddress', e.target.value)} placeholder="Complete address" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="Phone number" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input type="text" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="Email address" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Department / Public Authority</label>
            <input type="text" value={form.department} onChange={(e) => updateForm('department', e.target.value)} placeholder="e.g., Ministry of Home Affairs / Municipal Corporation" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Department Address</label>
            <input type="text" value={form.departmentAddress} onChange={(e) => updateForm('departmentAddress', e.target.value)} placeholder="Address of the department" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {activeType === 'application' ? 'Information Sought (Be specific)' : activeType === 'first-appeal' ? 'Information Originally Sought' : 'Facts of Complaint'}
            </label>
            <textarea value={form.informationSought} onChange={(e) => updateForm('informationSought', e.target.value)} placeholder={activeType === 'application' ? "1. Certified copies of all files/documents related to...\n2. Details of funds allocated and spent on...\n3. Names and designations of officers responsible for..." : "State the details..."} rows={5} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {activeType === 'application' ? 'Period of Information' : 'Grounds'}
            </label>
            <input type="text" value={form.period} onChange={(e) => updateForm('period', e.target.value)} placeholder={activeType === 'application' ? "January 2023 to December 2024" : "State the grounds..."} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
              <select value={form.paymentMode} onChange={(e) => updateForm('paymentMode', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option>Indian Postal Order</option>
                <option>Demand Draft</option>
                <option>Court Fee Stamp</option>
                <option>Cash</option>
                <option>Online Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Place</label>
              <input type="text" value={form.place} onChange={(e) => updateForm('place', e.target.value)} placeholder="New Delhi" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>

          <button
            onClick={generateRTI}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-200 mt-2"
          >
            <Sparkles size={16} /> Generate {activeType === 'application' ? 'RTI Application' : activeType === 'first-appeal' ? 'First Appeal' : 'Complaint'}
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-slate-700">Generated Document</h3>
            {generatedRTI && (
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 border border-emerald-200">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedRTI], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `rti_${activeType}.txt`;
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
            {generatedRTI ? (
              <pre className="text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">{generatedRTI}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center">
                <div>
                  <FileCheck size={48} className="mx-auto mb-3 text-slate-300" />
                  <p>Fill in the details and generate your RTI document</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
