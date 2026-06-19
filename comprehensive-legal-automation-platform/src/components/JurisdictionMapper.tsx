import { useState } from 'react';
import { MapPin, Search, Building, Shield, Gavel, Filter } from 'lucide-react';
import { jurisdictionData, searchJurisdiction, type JurisdictionInfo } from '../data/legalData';

export default function JurisdictionMapper() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [results, setResults] = useState<JurisdictionInfo[]>(jurisdictionData);

  const handleSearch = (q: string) => {
    setQuery(q);
    let filtered = q.trim() ? searchJurisdiction(q) : jurisdictionData;
    if (typeFilter !== 'all') {
      filtered = filtered.filter(j => j.type === typeFilter);
    }
    setResults(filtered);
  };

  const handleFilter = (type: string) => {
    setTypeFilter(type);
    let filtered = query.trim() ? searchJurisdiction(query) : jurisdictionData;
    if (type !== 'all') {
      filtered = filtered.filter(j => j.type === type);
    }
    setResults(filtered);
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'police_station': return { label: 'Police Station', icon: Shield, color: 'bg-red-100 text-red-600 border-red-200', badge: 'bg-red-500' };
      case 'court': return { label: 'Court', icon: Gavel, color: 'bg-blue-100 text-blue-600 border-blue-200', badge: 'bg-blue-500' };
      case 'tribunal': return { label: 'Tribunal', icon: Building, color: 'bg-purple-100 text-purple-600 border-purple-200', badge: 'bg-purple-500' };
      default: return { label: type, icon: MapPin, color: 'bg-slate-100 text-slate-600 border-slate-200', badge: 'bg-slate-500' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
            <MapPin size={20} />
          </div>
          Jurisdiction Mapper
        </h2>
        <p className="text-slate-500 text-sm mt-1">Map police stations, courts, and tribunals — find competent authorities for your case</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by location, district, state, or type (e.g., Delhi, Mumbai, Criminal cases)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-400" />
        {[
          { id: 'all', label: 'All' },
          { id: 'police_station', label: '🚔 Police Stations' },
          { id: 'court', label: '⚖️ Courts' },
          { id: 'tribunal', label: '🏛️ Tribunals' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => handleFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              typeFilter === f.id
                ? 'bg-teal-100 border-teal-300 text-teal-700'
                : 'bg-white border-slate-200 text-slate-500 hover:border-teal-200'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-2">{results.length} results</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-center">
          <Shield size={24} className="mx-auto text-red-500 mb-2" />
          <p className="text-2xl font-bold text-red-700">{jurisdictionData.filter(j => j.type === 'police_station').length}</p>
          <p className="text-xs text-red-500">Police Stations</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
          <Gavel size={24} className="mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-blue-700">{jurisdictionData.filter(j => j.type === 'court').length}</p>
          <p className="text-xs text-blue-500">Courts</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-center">
          <Building size={24} className="mx-auto text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-purple-700">{jurisdictionData.filter(j => j.type === 'tribunal').length}</p>
          <p className="text-xs text-purple-500">Tribunals</p>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map(j => {
          const typeInfo = getTypeInfo(j.type);
          const Icon = typeInfo.icon;
          return (
            <div key={j.id} className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow ${typeInfo.color.replace('bg-', 'border-').split(' ')[0].replace('100', '200')}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo.color.split(' ').slice(0, 2).join(' ')}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900">{j.name}</h4>
                    <span className={`text-[10px] text-white px-2 py-0.5 rounded ${typeInfo.badge}`}>{typeInfo.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">📍 {j.address}</p>
                  <div className="mt-3 bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Jurisdiction Area:</p>
                    <p className="text-xs text-slate-700">{j.jurisdiction}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Competent For:</p>
                    <div className="flex flex-wrap gap-1">
                      {j.competentFor.map((c, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                    <span>State: {j.state}</span>
                    <span>•</span>
                    <span>District: {j.district}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No jurisdictions found</p>
          <p className="text-xs text-slate-400 mt-1">Try a different search term or filter</p>
        </div>
      )}
    </div>
  );
}
