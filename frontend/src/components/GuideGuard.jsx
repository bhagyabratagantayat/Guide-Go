import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GuideGuard({ children }) {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const checkStatus = async () => {
      try {
        const { data } = await axios.get('/api/kyc/status');
        if (!mounted) return;
        
        const { kycStatus, profileComplete } = data;
        
        if (kycStatus !== 'approved') {
          navigate('/guide/verify');
        } else if (!profileComplete) {
          navigate('/guide/setup');
        } else {
          setOk(true);
        }
      } catch (error) {
        if (!mounted) return;
        // User probably not logged in or session expired
        navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkStatus();
    
    return () => { mounted = false; };
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
