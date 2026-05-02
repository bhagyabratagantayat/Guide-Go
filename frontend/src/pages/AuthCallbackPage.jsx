import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import api from '../utils/api';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return; }

      const { user } = session;
      const desiredRole = localStorage.getItem('gg_auth_role') || 'user';
      
      // Sync Supabase user with your MongoDB backend
      try {
        const res = await api.post('/auth/google-sync', {
          supabaseId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar_url || '',
          provider: 'google',
          role: desiredRole
        });
        
        // Store JWT from your backend (same as normal login)
        localStorage.setItem('gg_user', JSON.stringify(res.data.user));
        
        // Redirect based on role
        const role = res.data.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'guide') navigate('/guide/verify-identity');
        else navigate('/');
      } catch (err) {
        console.error('Sync error:', err);
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f7f7] dark:bg-[#0f172a] p-10">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#ff385c]/10 rounded-full" />
        <div className="w-16 h-16 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin absolute top-0" />
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-xl font-black italic tracking-tighter text-[#222222] dark:text-white mb-2">Authenticating</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff385c] animate-pulse">Establishing Secure Session</p>
      </div>
    </div>
  );
}
