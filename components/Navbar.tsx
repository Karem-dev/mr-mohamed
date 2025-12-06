import React from 'react';
import { 
  Menu, X, Moon, Sun, Atom, 
  Home, Info, BookOpen, FlaskConical, 
  BrainCircuit, Library, Mail 
} from 'lucide-react';
import { SectionId } from '../types';

interface NavbarProps {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> },
    { id: 'lessons', label: 'Lessons', icon: <BookOpen size={18} /> },
    { id: 'simulators', label: 'Simulators', icon: <FlaskConical size={18} /> },
    { id: 'quizzes', label: 'Quizzes', icon: <BrainCircuit size={18} /> },
    { id: 'resources', label: 'Resources', icon: <Library size={18} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => setActiveSection('home')}>
            <div className="relative">
              <Atom className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            </div>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
              Mr. Mohamed
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm transform scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2"></div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full flex items-center justify-center text-slate-500 hover:text-yellow-500 dark:text-slate-400 dark:hover:text-yellow-400 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-yellow-50 dark:hover:bg-slate-700"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-4">
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-slate-500 hover:text-yellow-500 dark:text-slate-400 dark:hover:text-yellow-400 transition-colors bg-slate-100 dark:bg-slate-800"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in-up">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;