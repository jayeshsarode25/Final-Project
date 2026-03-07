import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
      style={{ backgroundColor: 'var(--bg-tertiary)' }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={18} style={{ color: 'var(--warning)' }} />
      ) : (
        <Moon size={18} style={{ color: 'var(--accent)' }} />
      )}
    </button>
  );
}
