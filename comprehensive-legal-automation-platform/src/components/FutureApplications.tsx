import { useState } from 'react';
import { Shield, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Plus, Trash2, Bell } from 'lucide-react';

interface FutureApp {
  id: string;
  caseName: string;
  applicationType: string;
  deadline: string;
  status: 'pending' | 'filed' | 'overdue' | 'upcoming';
  notes: string;
  court: string;
  priority: 'high' | 'medium' | 'low';
}

const sampleApps: FutureApp[] = [
  {
    id: '1',
    caseName: 'Ram Kumar v. State (FIR 234/2023)',
    applicationType: 'Regular Bail Application',
    deadline: '2026-02-15',
    status: 'pending',
    notes: 'Chargesheet filed, next hearing on 15th Feb',
    court: 'Sessions Court, Saket',
    priority: 'high'
  },
  {
    id: '2',
    caseName: 'ABC Pvt Ltd v. XYZ Corp',
    applicationType: 'Written Statement Filing',
    deadline: '2026-01-30',
    status: 'upcoming',
    notes: '30 days from service of summons',
    court: 'District Court, Patiala House',
    priority: 'high'
  },
  {
    id: '3',
    caseName: 'Smt. Kamla Devi - DV Act',
    applicationType: 'DV Act Application u/s 12',
    deadline: '2026-03-01',
    status: 'pending',
    notes: 'DIR obtained, need to file application',
    court: 'MM Court, Tis Hazari',
    priority: 'medium'
  },
  {
    id: '4',
    caseName: 'Property dispute - Sec 9 CPC',
    applicationType: 'First Appeal u/s 96 CPC',
    deadline: '2026-02-28',
    status: 'upcoming',
    notes: 'Decree passed on 29th Jan, 30 days limitation',
    court: 'District Court',
    priority: 'high'
  },
  {
    id: '5',
    caseName: 'Consumer Complaint - Defective Product',
    applicationType: 'Consumer Complaint u/s 35 CPA',
    deadline: '2026-04-15',
    status: 'pending',
    notes: 'Legal notice already sent, waiting for response',
    court: 'DCDRC, South Delhi',
    priority: 'low'
  },
  {
    id: '6',
    caseName: 'RTI - Municipal Corporation',
    applicationType: 'First Appeal u/s 19(1) RTI Act',
    deadline: '2026-01-25',
    status: 'overdue',
    notes: 'No response received from PIO within 30 days',
    court: 'First Appellate Authority',
    priority: 'medium'
  },
];

export default function FutureApplications() {
  const [apps, setApps] = useState<FutureApp[]>(sampleApps);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [newApp, setNewApp] = useState<Partial<FutureApp>>({
    priority: 'medium',
    status: 'pending'
  });

  const filteredApps = filter === 'all' ? apps : apps.filter(a => a.status === filter || a.priority === filter);

  const addApplication = () => {
    if (!newApp.caseName || !newApp.applicationType || !newApp.deadline) return;
    const app: FutureApp = {
      id: Date.now().toString(),
      caseName: newApp.caseName || '',
      applicationType: newApp.applicationType || '',
      deadline: newApp.deadline || '',
      status: (newApp.status as FutureApp['status']) || 'pending',
      notes: newApp.notes || '',
      court: newApp.court || '',
      priority: (newApp.priority as FutureApp['priority']) || 'medium'
    };
    setApps(prev => [...prev, app]);
    setNewApp({ priority: 'medium', status: 'pending' });
    setShowAddForm(false);
  };

  const toggleStatus = (id: string) => {
    setApps(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'filed' ? 'pending' : 'filed' } : a
    ));
  };

  const deleteApp = (id: string) => {
    setApps(prev => prev.filter(a => a.id !== id));
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'filed': return { label: 'Filed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'overdue': return { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle };
      case 'upcoming': return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock };
      default: return { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Circle };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getDaysLeft = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)} days overdue`;
    if (diff === 0) return 'Due today!';
    return `${diff} days left`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            Future Applications Tracker
          </h2>
          <p className="text-slate-500 text-sm mt-1">Track all upcoming legal filings, deadlines, and applications</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200"
        >
          <Plus size={16} /> Add Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: apps.length, color: 'bg-slate-50 border-slate-200 text-slate-700' },
          { label: 'Pending', count: apps.filter(a => a.status === 'pending').length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Overdue', count: apps.filter(a => a.status === 'overdue').length, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Filed', count: apps.filter(a => a.status === 'filed').length, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-4 border text-center ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'upcoming', 'overdue', 'filed', 'high', 'medium', 'low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              filter === f ? 'bg-pink-100 border-pink-300 text-pink-700' : 'bg-white border-slate-200 text-slate-500 hover:border-pink-200'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 border border-pink-200 shadow-lg animate-fade-in">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Add New Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Case Name" value={newApp.caseName || ''} onChange={(e) => setNewApp(p => ({ ...p, caseName: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <input type="text" placeholder="Application Type" value={newApp.applicationType || ''} onChange={(e) => setNewApp(p => ({ ...p, applicationType: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <input type="date" value={newApp.deadline || ''} onChange={(e) => setNewApp(p => ({ ...p, deadline: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <input type="text" placeholder="Court/Forum" value={newApp.court || ''} onChange={(e) => setNewApp(p => ({ ...p, court: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <input type="text" placeholder="Notes" value={newApp.notes || ''} onChange={(e) => setNewApp(p => ({ ...p, notes: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
            <select value={newApp.priority || 'medium'} onChange={(e) => setNewApp(p => ({ ...p, priority: e.target.value as FutureApp['priority'] }))} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addApplication} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">Add</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.map(app => {
          const statusInfo = getStatusInfo(app.status);
          const daysLeft = getDaysLeft(app.deadline);
          const isOverdue = daysLeft.includes('overdue');

          return (
            <div key={app.id} className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all ${
              app.status === 'filed' ? 'border-emerald-200 opacity-75' : isOverdue ? 'border-red-200' : 'border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleStatus(app.id)}
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                      app.status === 'filed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-500'
                    }`}
                  >
                    {app.status === 'filed' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-bold text-sm ${app.status === 'filed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {app.applicationType}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${getPriorityColor(app.priority)}`} title={`${app.priority} priority`} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{app.caseName}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(app.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Building2Icon /> {app.court}</span>
                    </div>
                    {app.notes && <p className="text-xs text-slate-400 mt-1 italic">📝 {app.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                    <Bell size={11} className="inline mr-1" />
                    {daysLeft}
                  </span>
                  <button
                    onClick={() => deleteApp(app.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No applications found</p>
          <p className="text-xs text-slate-400 mt-1">Add new applications to track deadlines</p>
        </div>
      )}
    </div>
  );
}

function Building2Icon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  );
}
