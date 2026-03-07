import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import * as authApi from '../api/auth';
import * as paymentApi from '../api/payment';
import { formatPrice } from '../utils/helpers';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { MapPin, Plus, CreditCard, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.order);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    authApi.getAddresses()
      .then((res) => {
        const addrs = res.data.addresses || res.data || [];
        setAddresses(addrs);
        if (addrs.length > 0) setSelectedAddress(addrs[0]._id);
      })
      .catch(() => {});
  }, []);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price?.amount || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.addAddress(newAddress);
      const addr = res.data.address || res.data;
      setAddresses((prev) => [...prev, addr]);
      setSelectedAddress(addr._id);
      setShowAddForm(false);
      setNewAddress({ street: '', city: '', state: '', pincode: '', country: 'India' });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setProcessing(true);
    try {
      const orderRes = await dispatch(
        createOrder({ addressId: selectedAddress })
      ).unwrap();

      const orderId = orderRes.order?._id || orderRes._id;

      // Create Razorpay payment
      try {
        const payRes = await paymentApi.createPayment(orderId);
        const payData = payRes.data;

        // Open Razorpay
        const options = {
          key: payData.key || payData.key_id,
          amount: payData.amount,
          currency: payData.currency || 'INR',
          order_id: payData.orderId || payData.razorpayOrderId,
          name: 'MarketHub',
          description: 'Order Payment',
          handler: async (response) => {
            try {
              await paymentApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
            } catch (e) {
              console.error(e);
            }
            dispatch(clearCart());
            navigate(`/orders/${orderId}`);
          },
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Razorpay not loaded, just navigate
          dispatch(clearCart());
          navigate(`/orders/${orderId}`);
        }
      } catch (payErr) {
        // Payment service may not be running — still created order
        dispatch(clearCart());
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--success)' }} />
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Nothing to checkout
        </h2>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div
              className="p-6 rounded-[var(--radius-xl)] border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={20} style={{ color: 'var(--accent)' }} /> Delivery Address
              </h2>

              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all"
                      style={{
                        borderColor: selectedAddress === addr._id ? 'var(--accent)' : 'var(--border)',
                        backgroundColor: selectedAddress === addr._id ? 'var(--accent-subtle)' : 'transparent',
                      }}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="mt-1 accent-[var(--accent)]"
                      />
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No saved addresses.</p>
              )}

              {showAddForm ? (
                <form onSubmit={handleAddAddress} className="mt-4 space-y-3">
                  <Input label="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
                    <Input label="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required />
                  </div>
                  <Input label="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} required />
                  <div className="flex gap-2">
                    <Button type="submit">Save Address</Button>
                    <Button variant="ghost" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 mt-4 text-sm font-medium cursor-pointer"
                  style={{ color: 'var(--accent)' }}
                >
                  <Plus size={16} /> Add New Address
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div
              className="sticky top-24 p-6 rounded-[var(--radius-xl)] border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => {
                  const product = item.product || item;
                  const price = product.price?.amount || item.price || 0;
                  return (
                    <div key={item.productId || product._id} className="flex justify-between text-sm">
                      <span className="line-clamp-1 flex-1" style={{ color: 'var(--text-secondary)' }}>
                        {product.title || 'Item'} × {item.quantity}
                      </span>
                      <span className="font-medium ml-2" style={{ color: 'var(--text-primary)' }}>
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text-primary)' }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Tax</span>
                  <span style={{ color: 'var(--text-primary)' }}>{formatPrice(tax)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t mt-4 font-bold text-lg" style={{ borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Total</span>
                <span style={{ color: 'var(--accent)' }}>{formatPrice(total)}</span>
              </div>
              <Button
                size="lg"
                className="w-full mt-5"
                onClick={handlePlaceOrder}
                loading={processing || orderLoading}
                disabled={!selectedAddress}
                icon={<CreditCard size={18} />}
              >
                Place Order & Pay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
