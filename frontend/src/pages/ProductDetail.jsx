import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import {
  ShoppingCart, Minus, Plus, ArrowLeft, Star, Package,
  Truck, ShieldCheck, RotateCcw, ChevronRight
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading, error } = useSelector((state) => state.product);
  const user = useSelector((state) => state.auth.user);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    setAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
    } catch (err) {
      console.error(err);
    }
    setAddingToCart(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
        <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Product not found</p>
        <Link to="/products">
          <Button variant="outline" className="mt-4">
            <ArrowLeft size={16} /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [null];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
          <Link to="/" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Products</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)' }}>{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in">
            <div
              className="relative h-80 sm:h-[420px] rounded-[var(--radius-xl)] overflow-hidden"
              style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="w-16 h-16 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden border-2 transition-all cursor-pointer"
                    style={{
                      borderColor: i === selectedImage ? 'var(--accent)' : 'var(--border)',
                      backgroundColor: 'var(--bg-tertiary)',
                    }}
                  >
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {product.category && (
              <Badge className="mb-3">{product.category}</Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-1" style={{ color: 'var(--warning)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < 4 ? 'currentColor' : 'none'} />
                ))}
                <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>4.0 (24 reviews)</span>
              </div>
            </div>

            <div className="text-3xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
              {formatPrice(product.price?.amount || 0, product.price?.currency || 'INR')}
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <Badge color="success">In Stock ({product.stock})</Badge>
              ) : (
                <Badge color="error">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <div
                  className="flex items-center gap-3 border rounded-[var(--radius-md)] p-1"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  icon={<ShoppingCart size={18} />}
                  className="flex-1 sm:flex-none"
                >
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Features */}
            <div
              className="grid grid-cols-2 gap-3 p-4 rounded-[var(--radius-lg)] border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              {[
                { icon: <Truck size={18} />, label: 'Free Delivery' },
                { icon: <ShieldCheck size={18} />, label: 'Secure Payment' },
                { icon: <RotateCcw size={18} />, label: 'Easy Returns' },
                { icon: <Package size={18} />, label: 'Quality Assured' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-3 text-sm font-medium capitalize transition-colors cursor-pointer"
                style={{
                  color: activeTab === tab ? 'var(--accent)' : 'var(--text-tertiary)',
                  borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-6">
            {activeTab === 'description' && (
              <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                {product.description || 'No description available.'}
              </p>
            )}
            {activeTab === 'specifications' && (
              <div
                className="max-w-lg rounded-[var(--radius-lg)] border overflow-hidden"
                style={{ borderColor: 'var(--border)' }}
              >
                {[
                  { key: 'Category', value: product.category || 'N/A' },
                  { key: 'Stock', value: product.stock },
                  { key: 'Price', value: formatPrice(product.price?.amount || 0) },
                ].map((row, i) => (
                  <div
                    key={row.key}
                    className="flex justify-between px-4 py-3 text-sm"
                    style={{
                      backgroundColor: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-card)',
                    }}
                  >
                    <span style={{ color: 'var(--text-tertiary)' }}>{row.key}</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Reviews feature coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
