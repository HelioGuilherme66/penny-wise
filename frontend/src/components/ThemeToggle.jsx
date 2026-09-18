import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ label, className = '' }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type='button'
      onClick={toggleTheme}
      title={
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
      className={`relative flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
    >
      <span className='relative flex h-9 w-9 items-center justify-center'>
        <Sun
          size={20}
          className={`absolute transition-all duration-300 ${
            theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
          }`}
        />
        <Moon
          size={20}
          className={`absolute transition-all duration-300 ${
            theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
          }`}
        />
      </span>
      {label && <span className='hidden text-sm max-md:inline'>{label}</span>}
    </button>
  );
}
