import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="text-center animate-fade-in-up max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1
            className="text-[120px] sm:text-[160px] font-extrabold leading-none select-none gradient-text animate-float"
          >
            404
          </h1>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h2>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Oops! The page you're looking for seems to have wandered off.
          <br />
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button icon={<Home size={16} />}>Back to Home</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" icon={<Search size={16} />}>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
