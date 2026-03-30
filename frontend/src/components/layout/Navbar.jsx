import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search, ShoppingCart, Menu, X, User, LogOut, Package,
  LayoutDashboard, ChevronDown
} from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';
import { logoutUser } from '../../redux/slices/authSlice';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.items?.length || 0);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/ai-buddy', label: 'AI Buddy' },
    { to: '/about-us', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 glass ${scrolled ? 'mh-shadow-md' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm transition-transform group-hover:scale-110"
                style={{ background: 'var(--accent-gradient)' }}>
                M
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">MarketHub</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95 ${
                    isActive(link.to) ? 'mh-accent-subtle-bg mh-text-accent' : 'mh-text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 animate-slide-down">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    autoFocus
                    className="mh-input px-3 py-1.5 text-sm w-48 focus:w-64 transition-all"
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="p-1.5 rounded-full mh-text-tertiary cursor-pointer">
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)}
                  className="hidden sm:flex p-2.5 rounded-full mh-text-secondary cursor-pointer hover:scale-110 transition-transform" aria-label="Search">
                  <Search size={20} />
                </button>
              )}

              <ThemeToggle />

              {/* Cart */}
              <Link to="/cart" className="relative p-2 sm:p-2.5 rounded-full mh-text-secondary hover:scale-110 transition-transform" aria-label="Cart">
                <ShoppingCart size={20} />
                {cartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: 'var(--error)' }}>
                    {cartItems > 9 ? '9+' : cartItems}
                  </span>
                )}
              </Link>

              {/* Profile / Login */}
              {user ? (
                <div className="relative hidden sm:block" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full mh-bg-tertiary cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'var(--accent-gradient)' }}>
                      {user.fullName?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={14} className={`hidden sm:block mh-text-tertiary transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 mh-card py-2 animate-slide-down mh-shadow-xl z-50">
                      <div className="px-4 py-2.5 border-b mh-border">
                        <p className="text-sm font-semibold mh-text-primary">{user.fullName?.firstName} {user.fullName?.lastName}</p>
                        <p className="text-xs mh-text-tertiary truncate">{user.email}</p>
                      </div>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm mh-text-secondary hover:mh-bg-secondary" onClick={() => setProfileOpen(false)}>
                        <Package size={16} /> My Orders
                      </Link>
                      {user.role === 'seller' && (
                        <Link to="/seller" className="flex items-center gap-3 px-4 py-2.5 text-sm mh-text-secondary hover:mh-bg-secondary" onClick={() => setProfileOpen(false)}>
                          <LayoutDashboard size={16} /> Seller Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm cursor-pointer" style={{ color: 'var(--error)' }}>
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white mh-btn">
                  <User size={16} /> Login
                </Link>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg mh-text-secondary cursor-pointer" aria-label="Toggle menu">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay + Drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="mobile-drawer md:hidden">
            <div className="px-5 pt-4 pb-6">
              {/* Drag handle */}
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }} />

              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-5">
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 mh-text-tertiary pointer-events-none" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="mh-input w-full pl-10 pr-4 py-3 text-sm rounded-xl" />
                </div>
              </form>

              {/* Nav links */}
              <div className="space-y-1 mb-5">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive(link.to) ? 'mh-accent-subtle-bg mh-text-accent' : 'mh-text-secondary hover:mh-bg-secondary'
                    }`}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* User section on mobile */}
              {user ? (
                <div className="border-t mh-border pt-4 space-y-1">
                  <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: 'var(--accent-gradient)' }}>
                      {user.fullName?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold mh-text-primary truncate">
                        {user.fullName?.firstName} {user.fullName?.lastName}
                      </p>
                      <p className="text-xs mh-text-tertiary truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-sm mh-text-secondary rounded-xl hover:mh-bg-secondary">
                    <Package size={16} /> My Orders
                  </Link>
                  {user.role === 'seller' && (
                    <Link to="/seller" className="flex items-center gap-3 px-4 py-3 text-sm mh-text-secondary rounded-xl hover:mh-bg-secondary">
                      <LayoutDashboard size={16} /> Seller Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm cursor-pointer rounded-xl" style={{ color: 'var(--error)' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="border-t mh-border pt-4 flex gap-3">
                  <Link to="/login" className="flex-1 text-center py-3 text-sm font-semibold rounded-xl text-white mh-btn">
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 text-center py-3 text-sm font-semibold rounded-xl mh-btn-outline">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
