import { useState } from 'react';
import { AlertTriangle, Search, Scale, BookOpen, Users, Calendar, ChevronDown, ChevronUp, Gavel } from 'lucide-react';
import { situationCategories, type SituationCategory } from '../data/legalData';

export default function SituationMapper() {
  const [query, setQuery] = useState('');
  const [selectedSituation, setSelectedSituation] = useState<SituationCategory | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('substantive');

  const filteredSituations = query.trim()
    ? situationCategories.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
      )
    : situationCategories;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
            <AlertTriangle size={20} />
          </div>
          Situation Analyzer — Real-Time Section Mapping
        </h2>
        <p className="text-slate-500 text-sm mt-1">Select or search a situation to instantly get all relevant procedural & substantive sections, competent authorities, and future filings</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your situation (e.g., theft, domestic violence, accident, cyber fraud)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Situation Cards */}
      {!selectedSituation && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSituations.map(sit => (
            <button
              key={sit.id}
              onClick={() => setSelectedSituation(sit)}
              className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all text-left"
            >
              <span className="text-3xl">{sit.icon}</span>
              <h4 className="font-bold text-slate-900 mt-3">{sit.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sit.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span>{sit.substantiveSections.length} substantive</span>
                <span>•</span>
                <span>{sit.proceduralSections.length} procedural</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Situation Detail */}
      {selectedSituation && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedSituation(null)}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              ← Back
            </button>
            <span className="text-3xl">{selectedSituation.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{selectedSituation.name}</h3>
              <p className="text-sm text-slate-500">{selectedSituation.description}</p>
            </div>
          </div>

          {/* Substantive Sections */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'substantive' ? '' : 'substantive')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                  <Scale size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Substantive Sections</h4>
                  <p className="text-xs text-slate-500">{selectedSituation.substantiveSections.length} applicable sections</p>
                </div>
              </div>
              {expandedSection === 'substantive' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSection === 'substantive' && (
              <div className="border-t border-slate-100 p-5">
                <div className="space-y-2">
                  {selectedSituation.substantiveSections.map((sec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                      <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{sec.section}</span>
                      <p className="text-sm text-slate-700">{sec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Procedural Sections */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'procedural' ? '' : 'procedural')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Procedural Sections</h4>
                  <p className="text-xs text-slate-500">{selectedSituation.proceduralSections.length} applicable sections</p>
                </div>
              </div>
              {expandedSection === 'procedural' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSection === 'procedural' && (
              <div className="border-t border-slate-100 p-5">
                <div className="space-y-2">
                  {selectedSituation.proceduralSections.map((sec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                      <span className="text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{sec.section}</span>
                      <p className="text-sm text-slate-700">{sec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Competent Authority */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'authority' ? '' : 'authority')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Users size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Competent Authority</h4>
                  <p className="text-xs text-slate-500">{selectedSituation.competentAuthority.length} authorities</p>
                </div>
              </div>
              {expandedSection === 'authority' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSection === 'authority' && (
              <div className="border-t border-slate-100 p-5">
                <div className="space-y-2">
                  {selectedSituation.competentAuthority.map((auth, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <span className="w-6 h-6 flex-shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <p className="text-sm text-slate-700 font-medium">{auth}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Future Applications Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'future' ? '' : 'future')}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Future Applications & Filing Timeline</h4>
                  <p className="text-xs text-slate-500">{selectedSituation.futureApplications.length} applications mapped</p>
                </div>
              </div>
              {expandedSection === 'future' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSection === 'future' && (
              <div className="border-t border-slate-100 p-5">
                <div className="relative">
                  <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-purple-200" />
                  <div className="space-y-4">
                    {selectedSituation.futureApplications.map((app, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div className="w-6 h-6 flex-shrink-0 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">{i + 1}</div>
                        <div className="flex-1 bg-purple-50 rounded-lg p-4 border border-purple-100">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h5 className="font-bold text-sm text-purple-900">{app.name}</h5>
                            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-medium">{app.timeline}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{app.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Relevant Drafts */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Gavel size={16} className="text-blue-600" /> Recommended Draft Templates
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedSituation.relevantDrafts.map(draftId => {
                const names: Record<string, string> = {
                  'draft-police-complaint': '🚔 Police Complaint/FIR',
                  'draft-complaint': '🔨 Criminal Complaint',
                  'draft-legal-notice': '📜 Legal Notice',
                  'draft-bail': '⚖️ Bail Application',
                  'draft-writ': '🏛️ Writ Petition',
                  'draft-civil-suit': '📄 Civil Suit',
                  'draft-consumer': '🛒 Consumer Complaint',
                  'draft-divorce': '💔 Divorce Petition',
                  'draft-rti': '📋 RTI Application',
                  'draft-anticipatory-bail': '🛡️ Anticipatory Bail',
                };
                return (
                  <span key={draftId} className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium shadow-sm">
                    {names[draftId] || draftId}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
