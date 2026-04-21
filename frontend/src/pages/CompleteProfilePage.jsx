import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CompleteProfilePage() {
  const navigate      = useNavigate();
  const { login, user } = useAuth();

  const [role,     setRole]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [location, setLocation] = useState('');
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [serverErr,setServerErr]= useState('');

  const validate = () => {
    const e = {};
    if (!role) e.role = 'Please select User or Guide';
    if (!phone || phone.replace(/\D/g,'').length < 10)
      e.phone = 'Enter a valid 10-digit phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerErr('');
    try {
      const res = await api.put('/auth/complete-profile', {
        phone, role, location
      });
      // Update AuthContext with new token (role may have changed)
      login(res.data.user, res.data.token);

      if (role === 'guide') navigate('/guide/verify', { replace: true });
      else navigate('/', { replace: true });

    } catch (err) {
      setServerErr(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', background: '#0c0c18',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '12px 14px',
    color: '#eeeef5', fontSize: 14, outline: 'none',
    boxSizing: 'border-box'
  };
  const errTxt = { fontSize: 12, color: '#E24B4A', display: 'block', marginTop: 4 };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a12',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        background: '#12121e', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 440
      }}>
        {/* Avatar from Google */}
        {user?.avatar && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img src={user.avatar} alt={user.name}
              style={{ width: 64, height: 64, borderRadius: '50%',
                border: '2px solid rgba(79,126,248,0.4)' }}
            />
          </div>
        )}

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#eeeef5',
          textAlign: 'center', marginBottom: 4 }}>
          One more step
        </h2>
        <p style={{ fontSize: 13, color: '#8888a8', textAlign: 'center',
          marginBottom: '1.5rem' }}>
          Hey {user?.name?.split(' ')[0] || 'there'}, just need a few more details
        </p>

        {/* Role selection */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: '#8888a8', marginBottom: 8 }}>
            I want to:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { val: 'user',  icon: '👤', label: 'Explore & Book', sub: 'User' },
              { val: 'guide', icon: '🧑🏫', label: 'Guide & Earn',  sub: 'Guide' }
            ].map(r => (
              <div key={r.val} onClick={() => { setRole(r.val); setErrors(p=>({...p,role:''})); }}
                style={{
                  padding: '14px 10px', borderRadius: 10, cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.18s',
                  border: role === r.val
                    ? `1.5px solid ${r.val === 'user' ? '#4f7ef8' : '#1D9E75'}`
                    : '1.5px solid rgba(255,255,255,0.08)',
                  background: role === r.val
                    ? (r.val === 'user' ? 'rgba(79,126,248,0.12)' : 'rgba(29,158,117,0.12)')
                    : '#0c0c18',
                }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600,
                  color: role === r.val
                    ? (r.val === 'user' ? '#4f7ef8' : '#1D9E75')
                    : '#eeeef5' }}>{r.label}</div>
                <div style={{ fontSize: 10, color: '#8888a8' }}>{r.sub}</div>
              </div>
            ))}
          </div>
          {errors.role && <span style={errTxt}>{errors.role}</span>}
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: '#8888a8', display: 'block', marginBottom: 6 }}>
            Phone Number
          </label>
          <input style={inp} type="tel"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={e => { setPhone(e.target.value); setErrors(p=>({...p,phone:''})); }}
          />
          {errors.phone && <span style={errTxt}>{errors.phone}</span>}
        </div>

        {/* Location (optional) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: '#8888a8', display: 'block', marginBottom: 6 }}>
            Your City <span style={{ color: '#555' }}>(optional)</span>
          </label>
          <input style={inp} type="text"
            placeholder="e.g. Bhubaneswar, Odisha"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        {serverErr && (
          <div style={{
            background: 'rgba(226,75,74,0.1)',
            border: '1px solid rgba(226,75,74,0.3)',
            borderRadius: 8, padding: '10px 14px',
            marginBottom: 12, fontSize: 13, color: '#E24B4A'
          }}>{serverErr}</div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '13px',
          background: loading ? '#1a3080' : '#4f7ef8',
          border: 'none', borderRadius: 12, color: '#fff',
          fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Saving...' : 'Complete Setup →'}
        </button>
      </div>
    </div>
  );
}
