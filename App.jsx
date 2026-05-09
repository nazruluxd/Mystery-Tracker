import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { 
  Search, Plus, Trash2, Edit2, CheckCircle, 
  XCircle, AlertCircle, Save, X, Github, Clock, Check
} from 'lucide-react';

// --- Firebase Initialization ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

export default function App() {
  const [user, setUser] = useState(null);
  const [mysteries, setMysteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. Authentication (Strict Rule: Auth Before Queries)
  useEffect(() => {
    if (!auth) {
      setError("Firebase environment not configured.");
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Error:", err);
        setError("Authentication failed.");
        setLoading(false);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Data Fetching (Strict Rule: Public Path, No Complex Queries)
  useEffect(() => {
    if (!user || !db) return;

    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'mysteries');
    
    const unsubscribe = onSnapshot(
      collectionRef, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sorting in memory (Rule 2)
        data.sort((a, b) => b.createdAt - a.createdAt);
        setMysteries(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore Error:", err);
        setError("Failed to load mysteries.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --- Handlers ---

  const handleAddMystery = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user || !db) return;

    try {
      const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'mysteries');
      await addDoc(collectionRef, {
        title: title.trim(),
        description: description.trim(),
        status: 'unsolved',
        createdAt: Date.now(),
        authorId: user.uid
      });
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error("Error adding:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'mysteries', id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!db) return;
    try {
      const newStatus = currentStatus === 'solved' ? 'unsolved' : 'solved';
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'mysteries', id), {
        status: newStatus
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const startEditing = (mystery) => {
    setEditingId(mystery.id);
    setEditTitle(mystery.title);
    setEditDescription(mystery.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (id) => {
    if (!db || !editTitle.trim() || !editDescription.trim()) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'mysteries', id), {
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving edit:", err);
    }
  };

  // --- UI Components ---

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 flex flex-col items-center gap-3">
          <Search className="w-8 h-8 animate-pulse" />
          <span className="font-mono text-sm tracking-widest uppercase">Initializing Tracker...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-xl text-center max-w-md w-full">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-4" />
          <h2 className="text-rose-100 font-semibold mb-2">System Error</h2>
          <p className="text-rose-200/70 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Search className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-slate-100 font-semibold text-lg leading-tight">Mystery Tracker</h1>
              <p className="text-xs text-slate-500 font-mono">Global Board</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <Github className="w-4 h-4" />
            <span>v1.0.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Entry Form */}
        <section className="mb-10 bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-slate-800/30 px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-medium text-slate-200">Log New Mystery</h2>
          </div>
          <form onSubmit={handleAddMystery} className="p-5 flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mystery Heading (e.g., Unexplained latency on Auth Server)"
                className="w-full bg-[#0d1117] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                required
              />
            </div>
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description, clues, or replication steps..."
                rows="4"
                className="w-full bg-[#0d1117] border border-slate-800 rounded-lg px-4 py-3 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-y text-sm"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!title.trim() || !description.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Entry
              </button>
            </div>
          </form>
        </section>

        {/* List of Mysteries */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            Active Records
            <span className="bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full font-mono">
              {mysteries.length}
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {mysteries.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl">
              <Search className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No mysteries found in the database.</p>
            </div>
          ) : (
            mysteries.map((mystery) => (
              <div 
                key={mystery.id} 
                className={`group bg-[#161b22] border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  mystery.status === 'solved' 
                    ? 'border-emerald-500/20 bg-emerald-500/[0.02]' 
                    : 'border-slate-800'
                }`}
              >
                {editingId === mystery.id ? (
                  // Edit Mode
                  <div className="p-5 flex flex-col gap-4 bg-slate-800/20">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                      className="w-full bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:border-emerald-500 focus:outline-none text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={cancelEditing}
                        className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-sm"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button 
                        onClick={() => saveEdit(mystery.id)}
                        className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {mystery.status === 'solved' ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle className="w-3.5 h-3.5" /> Solved
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <AlertCircle className="w-3.5 h-3.5" /> Unsolved
                            </span>
                          )}
                          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(mystery.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className={`text-lg font-medium mb-2 ${mystery.status === 'solved' ? 'text-slate-300' : 'text-slate-100'}`}>
                          {mystery.title}
                        </h3>
                        <p className="text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
                          {mystery.description}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleStatus(mystery.id, mystery.status)}
                          title={mystery.status === 'solved' ? 'Mark as Unsolved' : 'Mark as Solved'}
                          className={`p-2 rounded-lg transition-colors ${
                            mystery.status === 'solved' 
                              ? 'text-amber-400 hover:bg-amber-400/10' 
                              : 'text-emerald-400 hover:bg-emerald-400/10'
                          }`}
                        >
                          {mystery.status === 'solved' ? <XCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => startEditing(mystery)}
                          title="Edit"
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mystery.id)}
                          title="Delete"
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
