import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import { formatPrice, truncateText } from '../utils/helpers';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import {
  ArrowRight, Truck, ShieldCheck, Headphones, Sparkles, Star,
  ShoppingCart, Zap
} from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const featured = (products || []).slice(0, 8);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden" style={{ minHeight: '80vh' }}>
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #a855f7 50%, #6366f1 75%, #8b5cf6 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 8s ease infinite',
          }} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: '80vh' }}>
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <Sparkles size={14} /> New Arrivals are here
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Shop Smarter<br />
              with <span className="text-amber-400">MarketHub</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Discover thousands of products at unbeatable prices. Fast delivery, secure payments, and AI-powered shopping assistance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2 cursor-pointer active:scale-95">
                  Explore Products <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/ai-buddy">
                <button className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95">
                  <Zap size={18} /> Try AI Buddy
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="mh-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
            {[
              { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'On orders over ₹499' },
              { icon: <ShieldCheck size={24} />, title: 'Secure Payments', desc: 'Razorpay encrypted checkout' },
              { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'AI Buddy is always here' },
            ].map((item, i) => (
              <div key={i} className="mh-card flex items-center gap-4 p-5 animate-fade-in">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mh-accent-subtle-bg mh-text-accent">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mh-text-primary">{item.title}</h3>
                  <p className="text-xs mh-text-tertiary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 mh-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mh-text-primary">Shop by Category</h2>
            <p className="text-sm mt-2 mh-text-secondary">Browse our wide range of categories</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide stagger-children">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="snap-start flex-shrink-0 w-32 animate-fade-in">
                <Card className="!p-5 text-center group cursor-pointer">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <p className="text-xs font-semibold mh-text-primary">{cat.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 mh-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mh-text-primary">Featured Products</h2>
              <p className="text-sm mt-1 mh-text-secondary">Handpicked just for you</p>
            </div>
            <Link to="/products" className="text-sm font-medium flex items-center gap-1 mh-text-accent hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size={40} /></div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              {featured.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="animate-fade-in">
                  <Card padding={false} className="overflow-hidden group">
                    <div className="relative h-48 overflow-hidden mh-bg-tertiary">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1 mh-text-primary">{product.title}</h3>
                      <p className="text-xs mb-3 line-clamp-2 mh-text-tertiary">{truncateText(product.description, 60)}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg mh-text-accent">{formatPrice(product.price?.amount || 0, product.price?.currency || 'INR')}</span>
                        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--warning)' }}>
                          <Star size={12} fill="currentColor" /><span>4.5</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingCart size={40} className="mx-auto mb-4 mh-text-tertiary" />
              <p className="text-lg font-semibold mh-text-secondary">No products available yet</p>
              <p className="text-sm mh-text-tertiary">Check back later for amazing deals!</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== AI PROMO ===== */}
      <section className="py-16 mh-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12" style={{ background: 'var(--accent-gradient)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="relative max-w-lg">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Your Personal AI Shopping Assistant</h2>
              <p className="text-white/80 mb-6">Get personalized recommendations, compare products, and find the best deals — all powered by AI.</p>
              <Link to="/ai-buddy">
                <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2 cursor-pointer active:scale-95">
                  <Zap size={18} /> Chat with AI Buddy
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16 mh-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 mh-text-primary">Stay Updated</h2>
          <p className="text-sm mb-8 mh-text-secondary">Get the latest deals and product updates straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="mh-input w-full sm:flex-1 px-4 py-3 text-sm" />
            <Button className="w-full sm:w-auto">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}