import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import AiBuddy from '../pages/AiBuddy';
import SellerDashboard from '../pages/SellerDashboard';
import AboutUs from '../pages/AboutUs';
import NotFound from '../pages/NotFound';

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/ai-buddy" element={<AiBuddy />} />

      {/* Protected: user */}
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

      {/* Protected: seller */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute roles={['seller', 'admin']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}