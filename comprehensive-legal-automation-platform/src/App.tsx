import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DraftFormatter from './components/DraftFormatter';
import CaseLaws from './components/CaseLaws';
import SectionIngredients from './components/SectionIngredients';
import LegalNoticeDrafter from './components/LegalNoticeDrafter';
import RTIApplication from './components/RTIApplication';
import DraftTemplates from './components/DraftTemplates';
import SituationMapper from './components/SituationMapper';
import JurisdictionMapper from './components/JurisdictionMapper';
import GovernmentDepartments from './components/GovernmentDepartments';
import FutureApplications from './components/FutureApplications';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'draft-formatter': return <DraftFormatter />;
      case 'case-laws': return <CaseLaws />;
      case 'section-ingredients': return <SectionIngredients />;
      case 'legal-notice': return <LegalNoticeDrafter />;
      case 'rti-application': return <RTIApplication />;
      case 'draft-templates': return <DraftTemplates />;
      case 'situation-mapper': return <SituationMapper />;
      case 'jurisdiction': return <JurisdictionMapper />;
      case 'departments': return <GovernmentDepartments />;
      case 'future-apps': return <FutureApplications />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden w-10" /> {/* spacer for mobile menu button */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
              <span className="text-slate-300">⚡</span>
              <span>LegalEdge AI — Advocate's Intelligent Legal Assistant Platform</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-600 font-medium">System Active</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-8 max-w-[1400px]">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-100 px-8 py-4 text-center">
          <p className="text-xs text-slate-400">
            LegalEdge AI © {new Date().getFullYear()} — For Indian Advocates & Legal Professionals.
            <span className="hidden sm:inline"> Built with ❤️ for the legal fraternity. All legal data is for reference purposes.</span>
          </p>
        </footer>
      </main>
    </div>
    </AuthProvider>
  );
}
