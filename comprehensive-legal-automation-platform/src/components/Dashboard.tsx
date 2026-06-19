import {
  FileText, Search, MapPin, Building2, Gavel, BookOpen,
  ScrollText, Shield, AlertTriangle, FileCheck, ArrowRight, Scale, TrendingUp, Users, Clock
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const quickActions = [
  { id: 'draft-formatter', label: 'Format a Draft', icon: FileText, color: 'from-blue-500 to-blue-600', desc: 'One-click draft formatting' },
  { id: 'case-laws', label: 'Find Case Laws', icon: BookOpen, color: 'from-purple-500 to-purple-600', desc: 'Search relevant case laws' },
  { id: 'section-ingredients', label: 'Section Ingredients', icon: Search, color: 'from-emerald-500 to-emerald-600', desc: 'Break down legal sections' },
  { id: 'legal-notice', label: 'Draft Legal Notice', icon: ScrollText, color: 'from-amber-500 to-amber-600', desc: 'Generate legal notices' },
  { id: 'rti-application', label: 'RTI Application', icon: FileCheck, color: 'from-cyan-500 to-cyan-600', desc: 'File RTI applications' },
  { id: 'draft-templates', label: 'All Templates', icon: Gavel, color: 'from-rose-500 to-rose-600', desc: 'Bail, Writ, Complaint & more' },
  { id: 'situation-mapper', label: 'Situation Analyzer', icon: AlertTriangle, color: 'from-orange-500 to-orange-600', desc: 'Real-time section mapping' },
  { id: 'jurisdiction', label: 'Jurisdiction Map', icon: MapPin, color: 'from-teal-500 to-teal-600', desc: 'Police & court mapping' },
  { id: 'departments', label: 'Govt. Departments', icon: Building2, color: 'from-indigo-500 to-indigo-600', desc: 'Officers & functions' },
  { id: 'future-apps', label: 'Future Applications', icon: Shield, color: 'from-pink-500 to-pink-600', desc: 'Track filing timelines' },
];

const stats = [
  { label: 'Legal Sections', value: '500+', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
  { label: 'Case Laws', value: '10,000+', icon: Scale, color: 'text-purple-600 bg-purple-50' },
  { label: 'Draft Templates', value: '15+', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Jurisdictions', value: '700+', icon: MapPin, color: 'text-amber-600 bg-amber-50' },
];

export default function Dashboard({ setActiveTab }: DashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 lg:p-12 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-xl">
              <Scale size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold font-serif">LegalEdge AI</h1>
              <p className="text-blue-200 text-sm">Advocate's Intelligent Legal Assistant</p>
            </div>
          </div>
          <p className="text-blue-100 max-w-2xl text-sm lg:text-base leading-relaxed mt-4">
            Your comprehensive legal toolkit — format drafts in one click, find relevant case laws,
            analyze section ingredients, draft notices & RTI applications, map jurisdictions,
            identify competent authorities, and track future filing deadlines — all in one platform.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setActiveTab('draft-formatter')}
              className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <FileText size={16} /> Format Draft Now
            </button>
            <button
              onClick={() => setActiveTab('situation-mapper')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              <AlertTriangle size={16} /> Analyze a Situation
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="group bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 text-left"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} />
                </div>
                <p className="font-semibold text-sm text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-400 mt-1">{action.desc}</p>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 mt-2 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-900">Real-Time Analysis</h3>
          </div>
          <p className="text-sm text-slate-600">Get instant mapping of all procedural and substantive sections relevant to any legal situation as you type.</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <Users size={20} className="text-purple-600" />
            <h3 className="font-bold text-slate-900">Authority Mapping</h3>
          </div>
          <p className="text-sm text-slate-600">Identify competent police stations, courts, tribunals, and government officers for every legal matter.</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={20} className="text-emerald-600" />
            <h3 className="font-bold text-slate-900">Filing Tracker</h3>
          </div>
          <p className="text-sm text-slate-600">Never miss a deadline — map all future applications, appeals, and filings with automated timeline tracking.</p>
        </div>
      </div>
    </div>
  );
}
