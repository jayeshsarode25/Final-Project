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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>My Orders</h1>

        {(!orders || orders.length === 0) ? (
          <div className="text-center py-20 animate-fade-in">
            <ShoppingBag size={56} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No orders yet</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>Start shopping to see your orders here.</p>
            <Link to="/products"><Button>Browse Products</Button></Link>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {orders.map((order) => (
              <Link
                to={`/orders/${order._id}`}
                key={order._id}
                className="block animate-fade-in"
              >
                <div
                  className="flex items-center justify-between p-5 rounded-[var(--radius-lg)] border transition-all hover:shadow-[var(--shadow-md)]"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
                    >
                      <Package size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {timeAgo(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-sm" style={{ color: 'var(--accent)' }}>
                        {formatPrice(order.totalAmount || order.total || 0)}
                      </p>
                    </div>
                    <Badge color={statusColor[order.status] || 'default'}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </Badge>
                    <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
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
