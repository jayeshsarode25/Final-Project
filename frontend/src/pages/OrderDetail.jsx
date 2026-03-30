import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrderThunk } from '../redux/slices/orderSlice';
import { formatPrice } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { ArrowLeft, MapPin, XCircle } from 'lucide-react';

const statusColor = {
  pending: 'warning',
  processing: 'info',
  confirmed: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder: order } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrderThunk(id));
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-sm mb-5 sm:mb-6 cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Order #{order._id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          <Badge color={statusColor[order.status] || 'default'}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </Badge>
        </div>

        {/* Items */}
        <div
          className="p-4 sm:p-6 rounded-[var(--radius-xl)] border mb-4 sm:mb-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Items</h3>
          <div className="space-y-3 sm:space-y-4">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    📦
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.title || item.productId || 'Product'}
                    </p>
                    <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-tertiary)' }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium text-xs sm:text-sm flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                  {formatPrice(item.price || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div
            className="p-4 sm:p-6 rounded-[var(--radius-xl)] border mb-4 sm:mb-6"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h3 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
              <MapPin size={16} style={{ color: 'var(--accent)' }} /> Delivery Address
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {order.address.street}, {order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
          </div>
        )}

        {/* Total */}
        <div
          className="p-4 sm:p-6 rounded-[var(--radius-xl)] border mb-4 sm:mb-6"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex justify-between text-base sm:text-lg font-bold">
            <span style={{ color: 'var(--text-primary)' }}>Total</span>
            <span style={{ color: 'var(--accent)' }}>
              {formatPrice(order.totalAmount || order.total || 0)}
            </span>
          </div>
        </div>

        {/* Cancel */}
        {order.status === 'pending' && (
          <Button variant="danger" onClick={handleCancel} icon={<XCircle size={16} />}>
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  );
}
