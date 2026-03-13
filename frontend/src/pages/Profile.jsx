import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Shield, Radio, Power } from 'lucide-react';
import useGuideTracking from '../hooks/useGuideTracking';

const Profile = () => {
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const { startTracking } = useGuideTracking(user);

  useEffect(() => {
    let stopTracking;
    if (isLive) {
      stopTracking = startTracking();
    }
    return () => stopTracking && stopTracking();
  }, [isLive]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Please login to view your profile</h2>
        <a href="/login" className="btn-primary px-8 py-3 rounded-xl">Login Now</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-500"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-3xl uppercase overflow-hidden">
                {user.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user.role === 'guide' && (
                <button 
                  onClick={() => setIsLive(!isLive)}
                  className={`flex items-center px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                    isLive 
                      ? 'bg-green-500 text-white shadow-green-500/20 animate-pulse' 
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Radio className={`w-4 h-4 mr-2 ${isLive ? 'animate-pulse' : ''}`} />
                  {isLive ? 'Live Tracking ON' : 'Go Live'}
                </button>
              )}
              <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                {isLive && (
                  <div className="flex items-center text-green-600 space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Broadcasting Location</span>
                  </div>
                )}
              </div>
              <p className="text-slate-500 font-medium flex items-center mt-1 uppercase tracking-wider text-xs">
                <Shield className="w-4 h-4 mr-1 text-primary-500" /> {user.role}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Email Address</p>
                  <p className="text-slate-800 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Phone Number</p>
                  <p className="text-slate-800 font-medium">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                  <p className="text-slate-800 font-medium">{user.location || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Member Since</p>
                  <p className="text-slate-800 font-medium">March 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
