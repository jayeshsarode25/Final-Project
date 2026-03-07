import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../redux/slices/authSlice';
import { API_BASE } from '../utils/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', firstName: '', lastName: '', password: '', userType: 'user',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, user } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);
  useEffect(() => { if (success && user) navigate('/', { replace: true }); }, [success, user, navigate]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); dispatch(registerUser(form)); };
  const handleGoogle = () => { window.location.href = `${API_BASE.AUTH}/google`; };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 mh-bg-primary">
      <div className="w-full max-w-md mh-card p-8 animate-fade-in-up mh-shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-5"
            style={{ background: 'var(--accent-gradient)' }}>
            M
          </div>
          <h1 className="text-2xl font-bold mh-text-primary">Create Account</h1>
          <p className="text-sm mt-1 mh-text-secondary">Join MarketHub today</p>
        </div>

        <button onClick={handleGoogle}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border mh-border text-sm font-semibold mh-text-primary mh-bg-secondary hover:opacity-80 cursor-pointer transition-all">
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">G</span>
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t mh-border" />
          <span className="px-4 text-xs mh-text-tertiary">OR</span>
          <div className="flex-1 border-t mh-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" type="text" name="username" id="reg-username"
            value={form.username} onChange={handleChange} placeholder="johndoe"
            icon={<User size={16} />} required />
          <Input label="Email" type="email" name="email" id="reg-email"
            value={form.email} onChange={handleChange} placeholder="you@example.com"
            icon={<Mail size={16} />} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" type="text" name="firstName" id="reg-first"
              value={form.firstName} onChange={handleChange} placeholder="John" required />
            <Input label="Last Name" type="text" name="lastName" id="reg-last"
              value={form.lastName} onChange={handleChange} placeholder="Doe" required />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium mb-2 mh-text-primary">Account Type</label>
            <div className="flex gap-4">
              {['user', 'seller'].map((type) => (
                <label key={type}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium
                    ${form.userType === type ? 'mh-accent-subtle-bg mh-text-accent' : 'mh-bg-input mh-text-secondary'}`}
                  style={{ borderColor: form.userType === type ? 'var(--accent)' : 'var(--border)' }}>
                  <input type="radio" name="userType" value={type} checked={form.userType === type}
                    onChange={handleChange} className="accent-[var(--accent)]" />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <Input label="Password" type="password" name="password" id="reg-password"
            value={form.password} onChange={handleChange} placeholder="••••••••"
            icon={<Lock size={16} />} minLength={8} required />
          <p className="text-xs -mt-2 mh-text-tertiary">Minimum 8 characters</p>

          <Button type="submit" loading={loading} className="w-full !py-3">
            <UserPlus size={16} /> Create Account
          </Button>

          {error && <p className="text-xs text-center" style={{ color: 'var(--error)' }}>{error}</p>}
        </form>

        <p className="text-center text-sm mt-6 mh-text-tertiary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold mh-text-accent">Login</Link>
        </p>
      </div>
    </div>
  );
}
