import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import { formatPrice, timeAgo } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

const statusColor = {
  pending: 'warning',
  processing: 'info',
  confirmed: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>My Orders</h1>

        {(!orders || orders.length === 0) ? (
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No orders yet</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>Start shopping to see your orders here.</p>
            <Link to="/products"><Button>Browse Products</Button></Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 stagger-children">
            {orders.map((order) => (
              <Link
                to={`/orders/${order._id}`}
                key={order._id}
                className="block animate-fade-in"
              >
                <div
                  className="p-4 sm:p-5 rounded-[var(--radius-lg)] border transition-all hover:shadow-[var(--shadow-md)]"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* Mobile: stacked layout */}
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
                      >
                        <Package size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--text-primary)' }}>
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {timeAgo(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-4 flex-shrink-0">
                      <p className="font-bold text-xs sm:text-sm" style={{ color: 'var(--accent)' }}>
                        {formatPrice(order.totalAmount || order.total || 0)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge color={statusColor[order.status] || 'default'}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </Badge>
                        <ChevronRight size={16} className="hidden sm:block" style={{ color: 'var(--text-tertiary)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
