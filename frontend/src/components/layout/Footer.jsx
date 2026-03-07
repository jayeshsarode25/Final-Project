import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Categories', to: '/products' },
    { label: 'Deals', to: '/products' },
    { label: 'New Arrivals', to: '/products' },
  ],
  Account: [
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Cart', to: '/cart' },
  ],
  Company: [
    { label: 'About Us', to: '/about-us' },
    { label: 'AI Buddy', to: '/ai-buddy' },
    { label: 'Seller Portal', to: '/seller' },
    { label: 'Contact', to: '/about-us' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-footer)', color: '#94a3b8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'var(--accent-gradient)' }}>
                M
              </div>
              <span className="text-lg font-bold text-white">MarketHub</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Shop smarter with MarketHub. Discover the best deals on electronics, fashion, home essentials, and more.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-white transition-colors hover:pl-1">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p>&copy; 2026 MarketHub. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
