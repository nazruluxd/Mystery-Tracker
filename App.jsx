import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, CheckCircle, Clock, AlertCircle, Search, Filter, Calendar, Tag, MessageSquare } from 'lucide-react';

export default function ProfessionalMysteryTracker() {
  const [mysteries, setMysteries] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMystery, setSelectedMystery] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  // LocalStorage থেকে ডেটা লোড করুন
  useEffect(() => {
    const saved = localStorage.getItem('profesionalMysteries');
    if (saved) {
      try {
        setMysteries(JSON.parse(saved));
      } catch (e) {
        console.log('Error loading mysteries');
      }
    }
  }, []);

  // LocalStorage এ সেভ করুন
  useEffect(() => {
    localStorage.setItem('profesionalMysteries', JSON.stringify(mysteries));
  }, [mysteries]);

  const addMystery = () => {
    if (!title.trim()) return;
    
    const newMystery = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'unsolved',
      createdAt: new Date(),
      updatedAt: new Date(),
      solution: '',
      comments: [],
      tags: [],
    };
    
    setMysteries([newMystery, ...mysteries]);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setShowForm(false);
  };

  const updateMystery = (id, updates) => {
    setMysteries(mysteries.map(m => 
      m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
    ));
  };

  const deleteMystery = (id) => {
    setMysteries(mysteries.filter(m => m.id !== id));
    setSelectedMystery(null);
  };

  const addComment = (id, comment) => {
    if (!comment.trim()) return;
    updateMystery(id, {
      comments: [...(mysteries.find(m => m.id === id).comments || []), {
        id: Date.now(),
        text: comment,
        date: new Date(),
      }]
    });
  };

  // ফিল্টার এবং সার্চ অনুযায়ী মিস্ট্রি
  let filteredMysteries = mysteries.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  // সর্টিং
  if (sortBy === 'newest') {
    filteredMysteries = [...filteredMysteries].sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortBy === 'oldest') {
    filteredMysteries = [...filteredMysteries].sort((a, b) => a.createdAt - b.createdAt);
  } else if (sortBy === 'priority') {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    filteredMysteries = [...filteredMysteries].sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
  }

  const stats = {
    total: mysteries.length,
    unsolved: mysteries.filter(m => m.status === 'unsolved').length,
    pending: mysteries.filter(m => m.status === 'pending').length,
    solved: mysteries.filter(m => m.status === 'solved').length,
    highPriority: mysteries.filter(m => m.priority === 'high' && m.status !== 'solved').length,
  };

  const getStatusColor = (status) => {
    if (status === 'solved') return 'from-emerald-500 to-teal-600';
    if (status === 'pending') return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50';
    if (priority === 'medium') return 'text-amber-600 bg-amber-50';
    return 'text-slate-600 bg-slate-50';
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Modern Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Mystery Tracker
              </h1>
              <p className="text-slate-400 text-sm mt-1">সব অমীমাংসিত প্রশ্ন এক জায়গায়</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              নতুন রহস্য
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'মোট', value: stats.total, icon: '📊', color: 'from-blue-500 to-cyan-500' },
            { label: 'অমীমাংসিত', value: stats.unsolved, icon: '❓', color: 'from-red-500 to-rose-500' },
            { label: 'পেন্ডিং', value: stats.pending, icon: '⏳', color: 'from-amber-500 to-orange-500' },
            { label: 'সমাধিত', value: stats.solved, icon: '✅', color: 'from-emerald-500 to-teal-500' },
            { label: 'জরুরি', value: stats.highPriority, icon: '🔥', color: 'from-pink-500 to-red-500' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 border border-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form Section */}
        {showForm && (
          <div
            className="mb-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300"
            ref={formRef}
          >
            <h2 className="text-xl font-bold text-white mb-4">নতুন রহস্য যোগ করুন</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">শিরোনাম *</label>
                <input
                  type="text"
                  placeholder="রহস্যের শিরোনাম..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMystery()}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">বিবরণ</label>
                <textarea
                  placeholder="বিস্তারিত তথ্য, প্রসঙ্গ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-slate-300 text-sm font-semibold mb-2">অগ্রাধিকার</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="low">🟢 কম</option>
                    <option value="medium">🟡 মধ্যম</option>
                    <option value="high">🔴 উচ্চ</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={addMystery}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="রহস্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none"
              >
                <option value="all">সব রহস্য</option>
                <option value="unsolved">❓ অমীমাংসিত</option>
                <option value="pending">⏳ পেন্ডিং</option>
                <option value="solved">✅ সমাধিত</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none"
              >
                <option value="newest">সর্বশেষ প্রথম</option>
                <option value="oldest">সবচেয়ে পুরানো প্রথম</option>
                <option value="priority">অগ্রাধিকার অনুযায়ী</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mysteries Grid */}
        {filteredMysteries.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">কোনো রহস্য পাওয়া যায়নি</h3>
            <p className="text-slate-400">{filter === 'all' ? 'একটি নতুন রহস্য যোগ করুন' : 'এই ফিল্টারে কোনো রহস্য নেই'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredMysteries.map((mystery, idx) => (
                <div
                  key={mystery.id}
                  onClick={() => setSelectedMystery(mystery)}
                  className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedMystery?.id === mystery.id
                      ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br from-cyan-400 to-blue-600 transition-opacity duration-300"></div>
                  
                  <div className="relative p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            mystery.status === 'solved' ? 'bg-emerald-500' :
                            mystery.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                          }`}>
                            <span className="text-white text-xs font-bold">
                              {mystery.status === 'solved' ? '✓' :
                               mystery.status === 'pending' ? '⏳' : '?'}
                            </span>
                          </span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${getPriorityColor(mystery.priority)}`}>
                            {mystery.priority === 'high' ? '🔴 জরুরি' :
                             mystery.priority === 'medium' ? '🟡 মাঝারি' : '🟢 সাধারণ'}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {mystery.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">{mystery.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMystery(mystery.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-700">
                      <span>📅 {formatDate(mystery.createdAt)}</span>
                      {mystery.comments?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {mystery.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Panel - Detail View */}
            {selectedMystery && (
              <div className="lg:col-span-1">
                <div className="sticky top-20 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedMystery.title}</h2>
                    <p className="text-slate-400 leading-relaxed">{selectedMystery.description}</p>
                  </div>

                  {/* Status Buttons */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                    <label className="block text-slate-300 text-sm font-semibold">স্ট্যাটাস</label>
                    <div className="flex gap-2">
                      {['unsolved', 'pending', 'solved'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateMystery(selectedMystery.id, { status })}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                            selectedMystery.status === status
                              ? `bg-gradient-to-r ${getStatusColor(status)} text-white shadow-lg`
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {status === 'unsolved' && '❓'}
                          {status === 'pending' && '⏳'}
                          {status === 'solved' && '✅'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solution Section */}
                  {selectedMystery.status === 'solved' && (
                    <div className="mb-6 pb-6 border-b border-slate-700">
                      <label className="block text-slate-300 text-sm font-semibold mb-2">সমাধান</label>
                      <textarea
                        value={selectedMystery.solution}
                        onChange={(e) => updateMystery(selectedMystery.id, { solution: e.target.value })}
                        placeholder="সমাধান লিখুন..."
                        className="w-full px-3 py-2 bg-emerald-900/20 border border-emerald-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                        rows="3"
                      />
                    </div>
                  )}

                  {/* Comments Section */}
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-3">মন্তব্য ({selectedMystery.comments?.length || 0})</label>
                    <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                      {selectedMystery.comments?.map((comment) => (
                        <div key={comment.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                          <p className="text-white text-sm">{comment.text}</p>
                          <p className="text-slate-500 text-xs mt-1">{formatDate(comment.date)}</p>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="মন্তব্য যোগ করুন..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addComment(selectedMystery.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
