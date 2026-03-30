import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { sellerAPI } from '../api/axiosInstances';
import * as productAPI from '../api/product';
import { formatPrice } from '../utils/helpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import {
  Package, ShoppingBag, DollarSign, TrendingUp,
  Plus, Pencil, Trash2, X, Upload
} from 'lucide-react';

export default function SellerDashboard() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', stock: '', category: '',
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAddProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showAddProduct]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsRes, productsRes, ordersRes] = await Promise.allSettled([
        sellerAPI.get('/metrics'),
        sellerAPI.get('/products'),
        sellerAPI.get('/orders'),
      ]);
      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
      if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data.products || productsRes.value.data || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data.orders || ordersRes.value.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newProduct.title);
      formData.append('description', newProduct.description);
      formData.append('price', JSON.stringify({ amount: Number(newProduct.price), currency: 'INR' }));
      formData.append('stock', newProduct.stock);
      formData.append('category', newProduct.category);
      images.forEach((img) => formData.append('images', img));

      await productAPI.createProduct(formData);
      setShowAddProduct(false);
      setNewProduct({ title: '', description: '', price: '', stock: '', category: '' });
      setImages([]);
      loadData();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
  ];

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
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Seller Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user?.fullName?.firstName || 'Seller'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 sm:mb-8 border-b overflow-x-auto scrollbar-hide" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 sm:px-5 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
              style={{
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-tertiary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 stagger-children">
            {[
              { icon: <DollarSign size={22} />, label: 'Revenue', value: formatPrice(metrics?.revenue || 0), color: 'var(--success)' },
              { icon: <ShoppingBag size={22} />, label: 'Total Orders', value: metrics?.totalOrders ?? orders.length, color: 'var(--info)' },
              { icon: <Package size={22} />, label: 'Products', value: metrics?.totalProducts ?? products.length, color: 'var(--accent)' },
              { icon: <TrendingUp size={22} />, label: 'Growth', value: '+12%', color: 'var(--warning)' },
            ].map((stat) => (
              <Card key={stat.label} className="!p-4 sm:!p-5 animate-fade-in">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: stat.color + '20', color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
                    <p className="text-base sm:text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
              <Button size="sm" icon={<Plus size={16} />} onClick={() => setShowAddProduct(true)}>
                Add Product
              </Button>
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: 'var(--bg-overlay)' }}
                onClick={(e) => { if (e.target === e.currentTarget) setShowAddProduct(false); }}>
                <div
                  className="w-full sm:max-w-lg sm:mx-4 p-5 sm:p-6 sm:rounded-[var(--radius-xl)] rounded-t-[20px] border animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-xl)',
                  }}
                >
                  {/* Drag handle on mobile */}
                  <div className="w-10 h-1 rounded-full mx-auto mb-4 sm:hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add Product</h2>
                    <button onClick={() => setShowAddProduct(false)} className="cursor-pointer p-1" style={{ color: 'var(--text-tertiary)' }}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <Input label="Title" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} required />
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Description</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] border outline-none resize-none"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Price (₹)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                      <Input label="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required />
                    </div>
                    <Input label="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} placeholder="e.g. electronics" required />
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Images</label>
                      <label
                        className="flex items-center justify-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed cursor-pointer transition-colors"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
                      >
                        <Upload size={20} />
                        <span className="text-sm">{images.length > 0 ? `${images.length} file(s) selected` : 'Upload images'}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setImages([...e.target.files])}
                        />
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="submit" loading={submitting} className="flex-1 sm:flex-none">Add Product</Button>
                      <Button variant="ghost" type="button" onClick={() => setShowAddProduct(false)} className="flex-1 sm:flex-none">Cancel</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products — Card view on mobile, Table on desktop */}
            <div className="hidden sm:block">
              <div
                className="rounded-[var(--radius-lg)] border overflow-hidden"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Product</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Price</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Stock</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Category</th>
                        <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr
                          key={p._id}
                          className="border-t"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--accent)' }}>
                            {formatPrice(p.price?.amount || 0)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge color={p.stock > 5 ? 'success' : p.stock > 0 ? 'warning' : 'error'}>
                              {p.stock}
                            </Badge>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                            {p.category || '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1.5 mr-1 cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 cursor-pointer"
                              style={{ color: 'var(--error)' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-10" style={{ color: 'var(--text-tertiary)' }}>
                            No products yet. Add your first product!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-3">
              {products.length === 0 ? (
                <div className="text-center py-10 mh-card" style={{ color: 'var(--text-tertiary)' }}>
                  No products yet. Add your first product!
                </div>
              ) : (
                products.map((p) => (
                  <div key={p._id} className="mh-card p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate mh-text-primary">{p.title}</p>
                        <p className="text-sm font-bold mt-1" style={{ color: 'var(--accent)' }}>
                          {formatPrice(p.price?.amount || 0)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge color={p.stock > 5 ? 'success' : p.stock > 0 ? 'warning' : 'error'}>
                            Stock: {p.stock}
                          </Badge>
                          {p.category && (
                            <span className="text-xs mh-text-tertiary">{p.category}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button className="p-2 cursor-pointer rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-2 cursor-pointer rounded-lg"
                          style={{ color: 'var(--error)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <div
                className="rounded-[var(--radius-lg)] border overflow-hidden"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Order ID</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Total</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr
                          key={o._id}
                          className="border-t"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
                        >
                          <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                            #{o._id?.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge color={o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'error' : 'warning'}>
                              {o.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--accent)' }}>
                            {formatPrice(o.totalAmount || o.total || 0)}
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-tertiary)' }}>
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-10" style={{ color: 'var(--text-tertiary)' }}>
                            No orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-10 mh-card" style={{ color: 'var(--text-tertiary)' }}>
                  No orders yet.
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o._id} className="mh-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm mh-text-primary">
                          #{o._id?.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs mh-text-tertiary mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge color={o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'error' : 'warning'}>
                        {o.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold mt-2" style={{ color: 'var(--accent)' }}>
                      {formatPrice(o.totalAmount || o.total || 0)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
