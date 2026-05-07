import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Volume2,
  Layers,
  Search
} from 'lucide-react';

const AdminPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPlace, setEditPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    category: '',
    city: '',
    audioGuideText: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);

  const fetchPlaces = async () => {
    try {
      const { data } = await api.get('/places');
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleOpenModal = (place = null) => {
    if (place) {
      setEditPlace(place);
      setFormData({
        name: place.name,
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude,
        category: place.category,
        city: place.city || '',
        audioGuideText: place.audioGuideText || ''
      });
    } else {
      setEditPlace(null);
      setFormData({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        category: '',
        city: '',
        audioGuideText: ''
      });
    }
    setImageFile(null);
    setImagesFiles([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this service area?')) {
      try {
        await api.delete(`/places/${id}`);
        fetchPlaces();
      } catch (error) {
        alert('Error deleting service area');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);
    if (imagesFiles.length > 0) {
      imagesFiles.forEach(file => data.append('images', file));
    }

    try {
      if (editPlace) {
        await api.put(`/places/${editPlace._id}`, data);
      } else {
        await api.post('/places', data);
      }
      setShowModal(false);
      fetchPlaces();
    } catch (error) {
      alert('Error saving service area');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">Manage Service Areas</h2>
          <p className="text-xs font-bold text-slate-400">Add, modify, and delete locations with gallery support</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-8 py-4 bg-primary-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-400 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {places.map((place) => (
          <div key={place._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
            <div className="h-48 relative overflow-hidden">
               <img 
                 src={place.image || 'https://images.unsplash.com/photo-1524492459422-ad5193910f54'} 
                 alt={place.name} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute top-4 right-4 flex space-x-2">
                 <button 
                  onClick={() => handleOpenModal(place)}
                  className="p-2 bg-white/90 backdrop-blur rounded-xl text-slate-900 hover:text-primary-600 shadow-lg"
                 >
                   <Edit3 className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => handleDelete(place._id)}
                  className="p-2 bg-white/90 backdrop-blur rounded-xl text-slate-900 hover:text-red-600 shadow-lg"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
               <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-primary-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {place.category}
                  </span>
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {place.city}
                  </span>
               </div>
            </div>
            
            <div className="p-6">
              <h4 className="font-black text-slate-900 uppercase mb-2 truncate">{place.name}</h4>
              <div className="space-y-2 mb-4">
                <p className="text-[10px] text-slate-400 font-bold flex items-center">
                  <MapPin className="w-3 h-3 mr-2" /> {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
                <div className="flex items-center justify-between">
                   <p className="text-[10px] text-slate-400 font-bold flex items-center">
                     <Volume2 className="w-3 h-3 mr-2 text-primary-500" /> {place.audioGuideText ? 'Audio Ready' : 'N/A'}
                   </p>
                   <p className="text-[10px] text-slate-400 font-bold flex items-center">
                     <Layers className="w-3 h-3 mr-2 text-blue-500" /> {place.images?.length || 0} Photos
                   </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">"{place.description}"</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {editPlace ? 'Modify Service Area' : 'Register Service Area'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                  <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                </button>
             </div>
             <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Name</label>
                        <input 
                          type="text" required
                          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                     <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City/District</label>
                        <input 
                          type="text" required
                          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                          placeholder="e.g. Puri"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Latitude</label>
                        <input 
                          type="number" step="any" required
                          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                          value={formData.latitude}
                          onChange={e => setFormData({...formData, latitude: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Longitude</label>
                        <input 
                          type="number" step="any" required
                          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                          value={formData.longitude}
                          onChange={e => setFormData({...formData, longitude: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select 
                          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="">Select Category</option>
                          <option value="temple">Temple</option>
                          <option value="beach">Beach</option>
                          <option value="historic">Historic</option>
                          <option value="nature">Nature</option>
                          <option value="shopping">Shopping</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Cover Image</label>
                        <input 
                          type="file" 
                          className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl font-bold text-xs text-slate-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-primary-500 file:text-slate-900 hover:file:bg-primary-400"
                          onChange={e => setImageFile(e.target.files[0])}
                        />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gallery Images (Multiple)</label>
                        <input 
                          type="file" multiple
                          className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl font-bold text-xs text-slate-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-500 file:text-white hover:file:bg-blue-400"
                          onChange={e => setImagesFiles(Array.from(e.target.files))}
                        />
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2">Selected: {imagesFiles.length} files</p>
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Audio Guide Script (For AI TTS)</label>
                        <textarea 
                          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all h-24 resize-none"
                          value={formData.audioGuideText}
                          onChange={e => setFormData({...formData, audioGuideText: e.target.value})}
                          placeholder="Welcome to this beautiful location..."
                        />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                        <textarea 
                          required
                          className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all h-24 resize-none"
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="pt-6">
                     <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/30">
                        {editPlace ? 'Save Modifications' : 'Create Service Area'}
                     </button>
                  </div>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlaces;
