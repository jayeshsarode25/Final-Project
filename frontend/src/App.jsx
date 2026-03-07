import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MainRoutes from './routes/MainRoutes';
import { fetchCurrentUser } from './redux/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => { dispatch(fetchCurrentUser()); }, [dispatch]);

  // Hide footer on AI Buddy page (it fills the viewport)
  const hideFooter = location.pathname === '/ai-buddy';

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col mh-bg-primary mh-text-primary">
        <Navbar />
        <main className="flex-1 pt-16">
          <MainRoutes />
        </main>
        {!hideFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
}