import { useState } from 'react';
import { Building2, Search, Users, ChevronDown, ChevronUp, Shield, BookOpen } from 'lucide-react';
import { governmentDepartments, searchDepartments, type GovernmentDepartment } from '../data/legalData';

export default function GovernmentDepartments() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GovernmentDepartment[]>(governmentDepartments);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSearch = (q: string) => {
    setQuery(q);
    setResults(q.trim() ? searchDepartments(q) : governmentDepartments);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Building2 size={20} />
          </div>
          Government Departments & Officers
        </h2>
        <p className="text-slate-500 text-sm mt-1">Map departments, officers, their powers, and functions for specific government work</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search departments by name, function, or relevant act (e.g., police, revenue, RTI, labour)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          {results.length} department{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Quick Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 self-center">Quick search:</span>
        {['Police', 'Revenue', 'Labour', 'Municipal', 'RTI', 'Women'].map(tag => (
          <button
            key={tag}
            onClick={() => handleSearch(tag)}
            className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all font-medium"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Departments */}
      <div className="space-y-4">
        {results.map(dept => {
          const isExpanded = expandedId === dept.id;
          return (
            <div key={dept.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : dept.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{dept.name}</h3>
                    <p className="text-xs text-indigo-600 mt-0.5">{dept.ministry}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dept.functions.slice(0, 4).map((f, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{f}</span>
                      ))}
                      {dept.functions.length > 4 && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">+{dept.functions.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-5 animate-fade-in">
                  {/* Functions */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Shield size={14} className="text-indigo-600" /> Functions & Responsibilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dept.functions.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                          <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                          <span className="text-slate-700">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Officers */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Users size={14} className="text-blue-600" /> Officers & Their Powers
                    </h4>
                    <div className="space-y-3">
                      {dept.officers.map((officer, i) => (
                        <div key={i} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">{officer.designation}</span>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{officer.role}</p>
                          <div className="flex flex-wrap gap-1">
                            {officer.powers.map((p, j) => (
                              <span key={j} className="text-[10px] bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200">{p}</span>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2">Appointed under: {officer.appointedUnder}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relevant Acts */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <BookOpen size={14} className="text-amber-600" /> Relevant Acts & Legislation
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dept.relevantActs.map((act, i) => (
                        <span key={i} className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">{act}</span>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500">📞 {dept.contactInfo}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No departments found for "{query}"</p>
          <p className="text-xs text-slate-400 mt-1">Try searching by department name, function, or relevant act</p>
        </div>
      )}
    </div>
  );
}
