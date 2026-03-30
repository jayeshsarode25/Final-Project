import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItemQty } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQty = (productId, quantity) => {
    dispatch(updateCartItemQty({ productId, quantity }));
  };

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price?.amount || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const shipping = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <ShoppingBag size={56} className="mx-auto mb-6" style={{ color: 'var(--text-tertiary)' }} />
            <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Your cart is empty
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Looks like you haven't added anything yet.
            </p>
            <Link to="/products">
              <Button icon={<ArrowLeft size={16} />}>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => {
                const product = item.product || item;
                const price = product.price?.amount || item.price || 0;
                return (
                  <div
                    key={item.productId || product._id}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-[var(--radius-lg)] border transition-all animate-fade-in"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {/* Image */}
                    <div
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-[var(--radius-md)] overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">📦</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                        {product.title || 'Product'}
                      </h3>
                      <p className="text-sm sm:text-lg font-bold mt-0.5 sm:mt-1" style={{ color: 'var(--accent)' }}>
                        {formatPrice(price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                        <div
                          className="flex items-center border rounded-[var(--radius-md)]"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <button
                            onClick={() => handleUpdateQty(item.productId || product._id, Math.max(0, item.quantity - 1))}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.productId || product._id, item.quantity + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleUpdateQty(item.productId || product._id, 0)}
                          className="p-1.5 sm:p-2 rounded-[var(--radius-sm)] cursor-pointer transition-colors"
                          style={{ color: 'var(--error)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Line total — Desktop */}
                    <div className="hidden sm:flex items-start pt-1 text-right">
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {formatPrice(price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div>
              <div
                className="sticky top-24 p-5 sm:p-6 rounded-[var(--radius-xl)] border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <h3 className="text-lg font-bold mb-4 sm:mb-5" style={{ color: 'var(--text-primary)' }}>
                  Order Summary
                </h3>
                <div className="space-y-3 mb-4 sm:mb-5">
                  {[
                    { label: 'Subtotal', value: formatPrice(subtotal) },
                    { label: 'Shipping', value: shipping === 0 ? 'FREE' : formatPrice(shipping) },
                    { label: 'Tax (18% GST)', value: formatPrice(tax) },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                      <span className="font-medium" style={{ color: row.label === 'Shipping' && shipping === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="flex justify-between py-4 border-t text-base sm:text-lg font-bold"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>{formatPrice(total)}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full mt-4"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Button>
                {shipping > 0 && (
                  <p className="text-xs text-center mt-3" style={{ color: 'var(--text-tertiary)' }}>
                    Add ₹{499 - subtotal > 0 ? 499 - subtotal : 0} more for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
