import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function GuideGuard({ children }) {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const checkStatus = async () => {
      // OPTIMIZATION: If user state already has this info, use it immediately to avoid "buffering"
      if (user && user.kycStatus && user.profileComplete !== undefined) {
        if (user.kycStatus !== 'approved') {
          navigate('/guide/verify-identity');
          setLoading(false);
          return;
        } else if (!user.profileComplete) {
          navigate('/guide/setup');
          setLoading(false);
          return;
        } else {
          setOk(true);
          setLoading(false);
          // We still do a background check to keep it synced, but we don't block the UI
        }
      }

      try {
        const { data } = await api.get('/kyc/status');
        if (!mounted) return;
        
        const { kycStatus, profileComplete } = data;
        
        // Sync global auth state if it differs
        if (user.kycStatus !== kycStatus || user.profileComplete !== profileComplete) {
           updateUser({ kycStatus, profileComplete });
        }
        
        if (kycStatus !== 'approved') {
          navigate('/guide/verify-identity');
        } else if (!profileComplete) {
          navigate('/guide/setup');
        } else {
          setOk(true);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Guard Check Failed:', error);
        // Don't redirect to login if we have a user, just stay on loading or handle error
        if (!user) navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkStatus();

    // 🛡️ SECURITY HARDENING: Block Inspect and Right Click
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => { 
      mounted = false; 
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return ok ? children : null;
}
