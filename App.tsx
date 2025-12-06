import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Simulators from './components/Simulators';
import Quizzes from './components/Quizzes';
import GeminiTutor from './components/GeminiTutor';
import { SectionId } from './types';
import { BookOpen, Atom, Zap, Thermometer, Box, ArrowRight, Download, Mail, Video, FileText, Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Hero onStart={() => setActiveSection('lessons')} />;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">The World of Physics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Mechanics", icon: <Box size={40} />, desc: "Motion, forces, energy, and momentum." },
                { title: "Electricity", icon: <Zap size={40} />, desc: "Circuits, fields, and electromagnetic forces." },
                { title: "Thermodynamics", icon: <Thermometer size={40} />, desc: "Heat, temperature, and entropy." },
                { title: "Optics", icon: <Lightbulb size={40} />, desc: "Light reflection, refraction, and lenses." },
                { title: "Modern Physics", icon: <Atom size={40} />, desc: "Quantum mechanics and relativity." },
              ].map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition-all hover:-translate-y-1 group">
                  <div className="text-indigo-600 dark:text-indigo-400 mb-4 transform group-hover:scale-110 transition-transform">{card.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{card.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{card.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Why Learn Physics?</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Physics is the fundamental science that helps us understand how the universe works. From the smallest subatomic particles to the vast galaxies, physics explains the nature of reality itself. Under the guidance of Mr. Mohamed Abdealsamee, you'll discover that physics isn't just equations—it's the poetry of nature.
              </p>
            </div>
          </div>
        );
      case 'lessons':
        return (
          <div className="max-w-6xl mx-auto px-4 py-20">
             <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">Interactive Lessons</h2>
             <div className="space-y-8">
                {[
                  { title: "Newton's Laws of Motion", category: "Mechanics", content: "An object remains at rest or in uniform motion unless acted upon by a force. Force equals mass times acceleration (F=ma). For every action, there is an equal and opposite reaction." },
                  { title: "Ohm's Law", category: "Electricity", content: "The current through a conductor between two points is directly proportional to the voltage across the two points. I = V/R." },
                  { title: "Reflection & Refraction", category: "Optics", content: "Reflection involves a change in direction of waves when they bounce off a barrier. Refraction of waves involves a change in the direction of waves as they pass from one medium to another." },
                ].map((lesson, idx) => (
                  <div key={idx} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row hover:shadow-xl transition-shadow">
                    <div className="md:w-1/3 bg-indigo-100 dark:bg-slate-700 flex items-center justify-center p-8">
                       <BookOpen size={64} className="text-indigo-600 dark:text-indigo-400 opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">{lesson.category}</div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{lesson.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">{lesson.content}</p>
                      <button className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        Start Lesson <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'simulators':
        return <div className="max-w-7xl mx-auto px-4 py-20"><Simulators /></div>;
      case 'quizzes':
        return <div className="max-w-7xl mx-auto px-4 py-20"><Quizzes /></div>;
      case 'resources':
        return (
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">Student Resources</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                 <div className="flex items-center mb-6">
                    <FileText size={32} className="text-red-500 mr-4" />
                    <h3 className="text-xl font-bold">Downloadable Materials</h3>
                 </div>
                 <ul className="space-y-4">
                    {['Formula Sheet 2024.pdf', 'Mechanics Summary.pdf', 'Electricity Practice Problems.pdf'].map((file, i) => (
                      <li key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
                        <span className="text-slate-700 dark:text-slate-300">{file}</span>
                        <Download size={18} className="text-slate-400" />
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                 <div className="flex items-center mb-6">
                    <Video size={32} className="text-red-600 mr-4" />
                    <h3 className="text-xl font-bold">Video Lectures</h3>
                 </div>
                 <div className="space-y-4">
                   {[1, 2, 3].map((v) => (
                     <div key={v} className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg group cursor-pointer">
                       <div className="w-24 h-16 bg-slate-300 dark:bg-slate-700 rounded flex items-center justify-center group-hover:opacity-80 transition-opacity">
                          <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">▶</div>
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm">Lecture {v}: Fundamental Concepts</h4>
                         <p className="text-xs text-slate-500 mt-1">15 mins • HD</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-3xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">Get in Touch</h2>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-12">Have a question about a lesson? Need help with a specific problem? Send Mr. Mohamed a message.</p>
            
            <form className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="your.email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Mail size={20} /> Send Message
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${activeSection === 'home' ? '' : 'pt-16'}`}>
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="min-h-screen animate-fade-in">
        {renderSection()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center text-white mb-4">
               <Atom className="mr-2" /> <span className="font-bold text-xl">Mr. Mohamed</span>
            </div>
            <p className="text-sm">Empowering the next generation of physicists and engineers through interactive learning.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li onClick={() => setActiveSection('lessons')} className="hover:text-white cursor-pointer">Lessons</li>
              <li onClick={() => setActiveSection('simulators')} className="hover:text-white cursor-pointer">Simulators</li>
              <li onClick={() => setActiveSection('contact')} className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <p className="text-sm">Cairo, Egypt</p>
            <p className="text-sm">support@physics-mohamed.com</p>
          </div>
        </div>
        <div className="text-center mt-12 text-xs border-t border-slate-800 pt-8">
          © {new Date().getFullYear()} Mr Mohamed Abdealsamee. All rights reserved.
        </div>
      </footer>

      {/* AI Tutor Integration */}
      <GeminiTutor />
    </div>
  );
};

export default App;