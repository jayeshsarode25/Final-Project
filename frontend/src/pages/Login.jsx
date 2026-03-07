import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';
import { API_BASE } from '../utils/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, success, user } = useSelector((state) => state.auth);
  const from = location.state?.from || '/';

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);
  useEffect(() => { if (success && user) navigate(from, { replace: true }); }, [success, user, navigate, from]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(form)); };
  const handleGoogle = () => { window.location.href = `${API_BASE.AUTH}/google`; };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 mh-bg-primary">
      <div className="w-full max-w-md mh-card p-8 animate-fade-in-up mh-shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-5"
            style={{ background: 'var(--accent-gradient)' }}>
            M
          </div>
          <h1 className="text-2xl font-bold mh-text-primary">Welcome Back</h1>
          <p className="text-sm mt-1 mh-text-secondary">Login to your MarketHub account</p>
        </div>

        {/* Google */}
        <button onClick={handleGoogle}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border mh-border text-sm font-semibold mh-text-primary mh-bg-secondary hover:opacity-80 cursor-pointer transition-all">
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">G</span>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t mh-border" />
          <span className="px-4 text-xs mh-text-tertiary">OR</span>
          <div className="flex-1 border-t mh-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Username" type="text" name="username" id="login-username"
            value={form.username} onChange={handleChange} placeholder="johndoe"
            icon={<User size={16} />} required />
          <Input label="Email" type="email" name="email" id="login-email"
            value={form.email} onChange={handleChange} placeholder="you@example.com"
            icon={<Mail size={16} />} required />
          <Input label="Password" type="password" name="password" id="login-password"
            value={form.password} onChange={handleChange} placeholder="••••••••"
            icon={<Lock size={16} />} required />

          <Button type="submit" loading={loading} className="w-full !py-3">
            Login <ArrowRight size={16} />
          </Button>

          {error && <p className="text-xs text-center" style={{ color: 'var(--error)' }}>{error}</p>}
        </form>

        <p className="text-center text-sm mt-6 mh-text-tertiary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold mh-text-accent">Register</Link>
        </p>
      </div>
    </div>
  );
}