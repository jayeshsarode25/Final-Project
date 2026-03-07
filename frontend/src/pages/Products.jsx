import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '../utils/constants';
import { formatPrice, truncateText } from '../utils/helpers';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { Search, Star, X, ShoppingBag } from 'lucide-react';

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchInput) params.search = searchInput;
    if (selectedCategory) params.category = selectedCategory;
    if (sortBy !== 'newest') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [searchInput, selectedCategory, sortBy]);

  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchInput(search);
  }, []);

  const filtered = useMemo(() => {
    let result = [...(products || [])];
    if (searchInput.trim()) {
      const q = searchInput.toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    result = result.filter((p) => {
      const price = p.price?.amount || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0)); break;
      case 'price_desc': result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0)); break;
      case 'name_asc': result.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      default: break;
    }
    return result;
  }, [products, searchInput, selectedCategory, sortBy, priceRange]);

  const clearFilters = () => { setSearchInput(''); setSelectedCategory(''); setSortBy('newest'); setPriceRange([0, 100000]); };
  const hasActiveFilters = searchInput || selectedCategory || sortBy !== 'newest';

  return (
    <div className="mh-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mh-text-primary">All Products</h1>
          <p className="text-sm mt-1 mh-text-secondary">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mh-card p-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 mh-text-tertiary pointer-events-none" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..." className="mh-input w-full pl-10 pr-4 py-2.5 text-sm" />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="mh-input px-3 py-2.5 text-sm cursor-pointer">
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden sm:block w-56 flex-shrink-0">
            <div className="sticky top-24 mh-card p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold mh-text-primary">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs font-medium mh-text-accent cursor-pointer">Clear all</button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-medium uppercase mb-3 mh-text-tertiary">Category</h4>
                <div className="space-y-1">
                  <button onClick={() => setSelectedCategory('')}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer
                      ${!selectedCategory ? 'mh-accent-subtle-bg mh-text-accent font-medium' : 'mh-text-secondary hover:mh-bg-secondary'}`}>
                    All
                  </button>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer
                        ${selectedCategory === cat.id ? 'mh-accent-subtle-bg mh-text-accent font-medium' : 'mh-text-secondary hover:mh-bg-secondary'}`}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-medium uppercase mb-3 mh-text-tertiary">Price Range</h4>
                <input type="range" min={0} max={100000} step={500} value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-[var(--accent)]" />
                <div className="flex justify-between text-xs mt-1 mh-text-tertiary">
                  <span>₹0</span><span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchInput && (
                  <span onClick={() => setSearchInput('')}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full mh-accent-subtle-bg mh-text-accent cursor-pointer">
                    Search: {searchInput} <X size={12} />
                  </span>
                )}
                {selectedCategory && (
                  <span onClick={() => setSelectedCategory('')}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full mh-accent-subtle-bg mh-text-accent cursor-pointer">
                    {selectedCategory} <X size={12} />
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="mh-card overflow-hidden !shadow-none">
                    <div className="h-48 animate-shimmer" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-3/4 rounded animate-shimmer" />
                      <div className="h-3 w-1/2 rounded animate-shimmer" />
                      <div className="h-5 w-1/3 rounded animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                {filtered.map((product) => (
                  <Link to={`/product/${product._id}`} key={product._id} className="animate-fade-in">
                    <Card padding={false} className="overflow-hidden group">
                      <div className="relative h-48 overflow-hidden mh-bg-tertiary">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ backgroundColor: 'var(--warning)', color: '#000' }}>
                            Only {product.stock} left
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1 mh-text-primary">{product.title}</h3>
                        <p className="text-xs mb-3 line-clamp-2 mh-text-tertiary">{truncateText(product.description, 70)}</p>
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
              <div className="text-center py-20">
                <ShoppingBag size={40} className="mx-auto mb-4 mh-text-tertiary" />
                <p className="text-lg font-semibold mb-1 mh-text-secondary">No products found</p>
                <p className="text-sm mb-4 mh-text-tertiary">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
