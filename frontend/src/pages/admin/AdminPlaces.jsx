import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  MapPin, 
  Edit2, 
  Trash2, 
  PlayCircle,
  X,
  Mic,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: 'temple',
    location: {
      address: '',
      coordinates: [20.2961, 85.8245]
    },
    audioGuideScript: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'temple', label: 'Spiritual Temples', icon: '🛕' },
    { id: 'nature', label: 'Pristine Nature', icon: '🌿' },
    { id: 'beach', label: 'Golden Coasts', icon: '🏖️' },
    { id: 'history', label: 'Ancient Legacy', icon: '🏛️' }
  ];

  const fetchPlaces = async () => {
    try {
      const { data } = await axios.get('/api/places');
      setPlaces(data.data || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPlace) {
        await axios.put(`/api/admin/places/${editingPlace._id}`, formData);
      } else {
        await axios.post('/api/admin/places', formData);
      }
      fetchPlaces();
      setIsModalOpen(false);
      setEditingPlace(null);
      setFormData({ name: '', description: '', image: '', category: 'temple', location: { address: '', coordinates: [20.2961, 85.8245] }, audioGuideScript: '' });
    } catch (error) {
      alert('Transmission failed. Check network link.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Strike this landmark from the atlas?')) {
      try {
        await axios.delete(`/api/admin/places/${id}`);
        setPlaces(places.filter(p => p._id !== id));
      } catch (error) {
        alert('Deletion protocols failed.');
      }
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      description: place.description,
      image: place.image,
      category: place.category,
      location: place.location,
      audioGuideScript: place.audioGuideScript || ''
    });
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-[1.5rem] animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <h2 className="text-4xl font-black tracking-tighter uppercase italic font-serif leading-none mb-4">Atlas of Odisha</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Curating the definitive collection of spiritual landmarks</p>
        </div>
        <button 
          onClick={() => { setEditingPlace(null); setIsModalOpen(true); }}
          className="px-12 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary-500 hover:text-slate-950 transition-all flex items-center group"
        >
          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" /> Register Landmark
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {places?.map((place) => (
          <motion.div 
            layout
            key={place._id} 
            className="group relative bg-white rounded-[3.5rem] shadow-premium border border-surface-50 overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            <div className="relative h-72 overflow-hidden">
               <img src={place.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
               <div className="absolute top-8 right-8 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(place)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(place._id)} className="w-10 h-10 bg-red-500/20 backdrop-blur-md rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
               <div className="absolute bottom-8 left-10 right-10">
                  <span className="inline-block px-4 py-1.5 bg-primary-500 text-slate-950 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 shadow-2xl">
                    {place.category}
                  </span>
                  <h3 className="text-2xl font-black text-white italic font-serif leading-none tracking-tight uppercase truncate">{place.name}</h3>
               </div>
            </div>

            <div className="p-10 space-y-6">
               <div className="flex items-start space-x-3">
                 <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-1" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">{place.location.address}</p>
               </div>
               
               <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                 {place.description}
               </p>

               <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Atlas Entry</span>
                 </div>
                 {place.audioGuideScript && (
                   <span className="flex items-center text-primary-500 text-[8px] font-black uppercase tracking-widest">
                     <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Audio Guide Ready
                   </span>
                 )}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[80vh]"
            >
              <div className="w-full md:w-2/5 bg-slate-950 text-white p-12 lg:p-16 flex flex-col justify-between">
                  <div>
                    <div className="w-20 h-20 bg-primary-500 rounded-[2.5rem] flex items-center justify-center text-slate-950 mb-10 rotate-6 shadow-2xl shadow-primary-500/20">
                       <MapPin className="w-10 h-10" />
                    </div>
                    <h3 className="text-5xl font-black tracking-tighter uppercase italic font-serif leading-[0.9] mb-6">
                      {editingPlace ? 'Refine Entry' : 'New Discovery'}
                    </h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                      DOCUMENTING ODISHA'S SPIRITUAL LEGACY
                    </p>
                  </div>

                  {formData.image && (
                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl group border border-white/10">
                       <img src={formData.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] bg-slate-950/80 px-4 py-2 rounded-full">LIVE PREVIEW</p>
                       </div>
                    </div>
                  )}

                  <div className="pt-10">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Select Domain</p>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {categories.map(cat => (
                          <button 
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData({...formData, category: cat.id})}
                            className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                              formData.category === cat.id ? 'bg-primary-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            {cat.icon} {cat.label}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="flex-1 p-12 lg:p-20 space-y-12 overflow-y-auto max-h-[90vh]">
                  <div className="space-y-10">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Landmark Name</label>
                          <input 
                            type="text" required
                            placeholder="e.g. Lingaraj Temple"
                            className="w-full px-8 py-5 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-none"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Visual Heritage (URL)</label>
                          <input 
                            type="text" required
                            placeholder="Image URL"
                            className="w-full px-8 py-5 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-none"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                          />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Precise Geolocation (Address)</label>
                        <input 
                          type="text" required
                          placeholder="Full administrative address"
                          className="w-full px-8 py-5 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-none"
                          value={formData.location.address}
                          onChange={(e) => setFormData({...formData, location: { ...formData.location, address: e.target.value }})}
                        />
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Landmark Narrative</label>
                        <textarea 
                          rows="3" required
                          placeholder="Describe the divine significance..."
                          className="w-full px-8 py-6 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-relaxed"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                     </div>

                     <div className="p-10 bg-slate-900 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center justify-between">
                           <label className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] ml-2">Audio Guide Script (AI Voiceover)</label>
                           <Mic className="w-5 h-5 text-primary-500" />
                        </div>
                        <textarea 
                          rows="5"
                          placeholder="Write the script for the AI guide to read out to tourists..."
                          className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/20 outline-none font-bold text-sm leading-relaxed text-slate-300 placeholder:text-slate-700"
                          value={formData.audioGuideScript}
                          onChange={(e) => setFormData({...formData, audioGuideScript: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button 
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-6 bg-primary-500 text-slate-950 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-primary-500/30 hover:bg-primary-400 transition-all flex items-center justify-center group"
                     >
                      {submitting ? 'RECONSTITUTING...' : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-3" /> {editingPlace ? 'COMMIT CHANGES' : 'PUBLISH TO ATLAS'}
                        </>
                      )}
                     </button>
                     <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-12 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-slate-200 transition-all"
                     >
                      ABORT
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPlaces;
