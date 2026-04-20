import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import axios from 'axios';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return; }

      const { user } = session;
      
      // Sync Supabase user with your MongoDB backend
      try {
        const res = await axios.post('/api/auth/google-sync', {
          supabaseId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar_url || '',
          provider: 'google'
        });
        
        // Store JWT from your backend (same as normal login)
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Redirect based on role
        const role = res.data.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'guide') navigate('/guide/verify');
        else navigate('/');
      } catch (err) {
        console.error('Sync error:', err);
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div style={{
      display:'flex',
      height:'100vh',
      alignItems:'center',
      justifyContent:'center',
      background:'var(--bg-base)',
      color:'var(--text-primary)'
    }}>
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Reawakening Session...</p>
      </div>
    </div>
  );
}
