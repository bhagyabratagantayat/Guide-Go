import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  Plus, Search, Edit2, Trash2, Headphones, MapPin, 
  Clock, Globe, X, Save, AlertCircle, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAudioGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    category: 'Heritage',
    duration: '',
    description: '',
    image: '',
    audioUrl: '',
    accent: '#ff385c',
    fullDetails: {
      history: '',
      highlights: [],
      bestTime: '',
      stops: []
    }
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data } = await api.get('/audio-guides');
      setGuides(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching guides:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (guide = null) => {
    if (guide) {
      setEditingGuide(guide);
      setFormData(guide);
    } else {
      setEditingGuide(null);
      setFormData({
        name: '',
        location: '',
        category: 'Heritage',
        duration: '',
        description: '',
        image: '',
        audioUrl: '',
        accent: '#ff385c',
        fullDetails: {
          history: '',
          highlights: [],
          bestTime: '',
          stops: []
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuide) {
        await api.put(`/audio-guides/${editingGuide._id}`, formData);
      } else {
        await api.post('/audio-guides', formData);
      }
      setIsModalOpen(false);
      fetchGuides();
    } catch (error) {
      console.error('Error saving guide:', error);
      alert('Error saving guide: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this audio guide?')) {
      try {
        await api.delete(`/audio-guides/${id}`);
        fetchGuides();
      } catch (error) {
        console.error('Error deleting guide:', error);
      }
    }
  };

  const filteredGuides = (guides || []).filter(g => {
    if (!g) return false;
    const name = g.name || g.title || '';
    const location = g.location || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Headphones className="text-[#ff385c]" size={32} />
              Audio Guides Management
            </h1>
            <p className="text-slate-500 mt-1">Manage interactive narration for tourist monuments.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#ff385c] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#ff385c]/20 hover:bg-[#e00b41] transition-all"
          >
            <Plus size={20} />
            Add New Guide
          </button>
        </div>

        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff385c] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search guides..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-6 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c] transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredGuides.map((guide) => (
                <motion.div 
                  key={guide._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <img src={guide.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-lg truncate">{guide.name || guide.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <MapPin size={12} />
                      {guide.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-50">
                    <div className="flex gap-2 items-center">
                      <button 
                        onClick={() => handleOpenModal(guide)}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(guide._id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      {guide.audioUrl ? (
                         <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">Audio</div>
                      ) : (
                         <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">AI</div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {guide.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* EDIT/ADD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingGuide ? 'Edit Audio Guide' : 'Add New Audio Guide'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monument Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
                    <input 
                      required
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duration (e.g. 15:20)</label>
                    <input 
                      required
                      type="text" 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cover Image URL</label>
                    <input 
                      required
                      type="text" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Audio File URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Leave empty for AI Narration"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({...formData, audioUrl: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    />
                    <p className="text-[9px] text-slate-400 font-medium italic">If empty, system will read the description below using AI voice.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Narrative Description</label>
                    <button 
                      type="button"
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        const utt = new SpeechSynthesisUtterance(formData.description);
                        window.speechSynthesis.speak(utt);
                      }}
                      className="text-[10px] font-bold text-[#ff385c] flex items-center gap-1 hover:underline"
                    >
                      <Play size={10} fill="currentColor" />
                      Preview AI Voice
                    </button>
                  </div>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Write what the visitor will hear..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                  />
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-6">
                  <h3 className="font-bold text-slate-900">Historical & Extended Details</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full History</label>
                    <textarea 
                      value={formData.fullDetails.history}
                      onChange={(e) => setFormData({
                        ...formData, 
                        fullDetails: { ...formData.fullDetails, history: e.target.value }
                      })}
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Best Time to Visit</label>
                    <input 
                      type="text" 
                      value={formData.fullDetails.bestTime}
                      onChange={(e) => setFormData({
                        ...formData, 
                        fullDetails: { ...formData.fullDetails, bestTime: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c]"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <AlertCircle size={18} className="text-[#ff385c]" />
                      Data Structure Notice
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Highlights and Stops are complex arrays. For now, please edit them via the database or a specialized JSON editor if needed. The core details are editable here.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-[#ff385c] text-white rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-[#ff385c]/20 hover:bg-[#e00b41] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Save size={20} />
                  {editingGuide ? 'Save Changes' : 'Create Audio Experience'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CATEGORIES = ['All', 'Heritage', 'Spiritual', 'Nature'];

export default AdminAudioGuides;
