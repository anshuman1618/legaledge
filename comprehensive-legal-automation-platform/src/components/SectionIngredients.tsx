import { useState } from 'react';
import { Search, Tag, AlertCircle, CheckCircle2, BookOpen, Scale } from 'lucide-react';
import { legalSections, searchSections, type LegalSection } from '../data/legalData';

export default function SectionIngredients() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LegalSection | null>(null);
  const [suggestions, setSuggestions] = useState<LegalSection[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 1) {
      setSuggestions(searchSections(q).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const selectSection = (section: LegalSection) => {
    setSelected(section);
    setQuery(`${section.code} Section ${section.section} - ${section.title}`);
    setSuggestions([]);
    setCheckedIngredients(new Set());
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
            <Tag size={20} />
          </div>
          Section Ingredients Analyzer
        </h2>
        <p className="text-slate-500 text-sm mt-1">Break down any legal section into its essential ingredients and verify applicability</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Type section number or keyword (e.g., 302, cheating, theft, murder, FIR)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-10 max-h-80 overflow-y-auto">
            {suggestions.map(s => (
              <button
                key={s.id}
                onClick={() => selectSection(s)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{s.code} {s.section}</span>
                  <span className="text-sm font-medium text-slate-900">{s.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick section buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 mr-1 self-center">Quick select:</span>
        {legalSections.slice(0, 8).map(s => (
          <button
            key={s.id}
            onClick={() => selectSection(s)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
              selected?.id === s.id
                ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {s.code} {s.section}
          </button>
        ))}
      </div>

      {/* Selected Section */}
      {selected && (
        <div className="space-y-5 animate-fade-in">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded">{selected.code}</span>
              <span className="text-xs font-bold bg-slate-700 text-white px-2.5 py-0.5 rounded">Section {selected.section}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                selected.type === 'substantive' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {selected.type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-2">{selected.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{selected.description}</p>

            {selected.punishment !== 'N/A - Procedural provision' && selected.punishment !== 'N/A - Fundamental Right' && (
              <div className="mt-4 bg-white rounded-lg p-3 border border-emerald-100">
                <p className="text-xs font-bold text-red-600">⚖️ Punishment: <span className="font-semibold text-slate-800">{selected.punishment}</span></p>
              </div>
            )}
          </div>

          {/* Ingredients Checklist */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag size={18} className="text-emerald-600" /> Essential Ingredients
              </h4>
              <div className="text-xs text-slate-400">
                {checkedIngredients.size} / {selected.ingredients.length} verified
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full mb-5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${(checkedIngredients.size / selected.ingredients.length) * 100}%` }}
              />
            </div>

            <div className="space-y-3">
              {selected.ingredients.map((ing, i) => (
                <button
                  key={i}
                  onClick={() => toggleIngredient(i)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    checkedIngredients.has(i)
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                    checkedIngredients.has(i)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {checkedIngredients.has(i) ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <span className={`text-sm ${checkedIngredients.has(i) ? 'text-emerald-800 font-medium' : 'text-slate-600'}`}>
                    {ing}
                  </span>
                </button>
              ))}
            </div>

            {checkedIngredients.size === selected.ingredients.length && (
              <div className="mt-5 bg-emerald-100 rounded-lg p-4 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">All ingredients satisfied!</p>
                  <p className="text-xs text-emerald-600 mt-0.5">The offence/provision under {selected.code} Section {selected.section} is prima facie made out.</p>
                </div>
              </div>
            )}

            {checkedIngredients.size > 0 && checkedIngredients.size < selected.ingredients.length && (
              <div className="mt-5 bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-center gap-3">
                <AlertCircle size={24} className="text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Partial ingredients met</p>
                  <p className="text-xs text-amber-600 mt-0.5">{selected.ingredients.length - checkedIngredients.size} more ingredient(s) needed to establish the offence/provision.</p>
                </div>
              </div>
            )}
          </div>

          {/* Related Sections & Case Laws */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <BookOpen size={14} className="text-blue-600" /> Related Sections
              </h4>
              <div className="flex flex-wrap gap-2">
                {selected.relatedSections.map(rs => (
                  <span key={rs} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 font-medium">
                    {rs}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Scale size={14} className="text-purple-600" /> Key Case Laws
              </h4>
              <div className="space-y-2">
                {selected.caseLaws.map((cl, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-semibold text-purple-800">{cl.name}</p>
                    <p className="text-xs text-slate-500">{cl.citation} ({cl.year})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Search size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">Search for a legal section to analyze</p>
          <p className="text-xs text-slate-400 mt-1">View essential ingredients and verify applicability</p>
        </div>
      )}
    </div>
  );
}
