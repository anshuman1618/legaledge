import { useState } from 'react';
import { BookOpen, Search, Scale, ExternalLink, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { legalSections, searchSections, type LegalSection } from '../data/legalData';

export default function CaseLaws() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LegalSection[]>(legalSections);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim()) {
      setResults(searchSections(q));
    } else {
      setResults(legalSections);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen size={20} />
          </div>
          Case Laws & Legal Sections
        </h2>
        <p className="text-slate-500 text-sm mt-1">Search sections and find relevant case laws instantly</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by section number (e.g., 302, 420), title, keyword, or code (IPC, CrPC, CPC)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map((section) => {
          const isExpanded = expandedId === section.id;
          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{section.code}</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Section {section.section}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      section.type === 'substantive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {section.type}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-600">{section.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{section.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{section.description}</p>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-5 animate-fade-in">
                  {/* Ingredients */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag size={14} className="text-emerald-600" /> Ingredients / Essential Elements
                    </h4>
                    <div className="space-y-1.5">
                      {section.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-5 h-5 flex-shrink-0 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                          <span className="text-slate-600">{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Punishment */}
                  {section.punishment !== 'N/A - Procedural provision' && section.punishment !== 'N/A - Fundamental Right' && section.punishment !== 'N/A - Right to Information' && section.punishment !== 'N/A - Jurisdictional provision' && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                      <h4 className="text-xs font-bold text-red-700 mb-1">⚖️ Punishment</h4>
                      <p className="text-sm text-red-800 font-medium">{section.punishment}</p>
                    </div>
                  )}

                  {/* Related Sections */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Related Sections</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.relatedSections.map((rs) => (
                        <span key={rs} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 font-medium cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => handleSearch(rs.split(' ').pop() || '')}
                        >
                          {rs}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Case Laws */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Scale size={14} className="text-purple-600" /> Relevant Case Laws ({section.caseLaws.length})
                    </h4>
                    <div className="space-y-3">
                      {section.caseLaws.map((cl, i) => (
                        <div key={i} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h5 className="font-bold text-sm text-purple-900">{cl.name}</h5>
                              <p className="text-xs text-purple-600 mt-0.5">{cl.citation} | {cl.court} | {cl.year}</p>
                            </div>
                            <ExternalLink size={14} className="text-purple-400 flex-shrink-0 mt-1" />
                          </div>
                          <p className="text-sm text-slate-700 mt-2">{cl.summary}</p>
                          <p className="text-xs text-purple-700 font-medium mt-2 bg-purple-100 inline-block px-2 py-0.5 rounded">
                            Relevance: {cl.relevance}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {results.length === 0 && (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No sections found for "{query}"</p>
            <p className="text-xs text-slate-400 mt-1">Try searching by section number, title, or keyword</p>
          </div>
        )}
      </div>
    </div>
  );
}
