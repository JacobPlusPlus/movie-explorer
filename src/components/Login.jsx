import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, AlertCircle } from 'lucide-react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Nazwa użytkownika musi posiadać minimum 3 znaki.');
      return;
    }
    setError('');
    onLogin(username);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card border border-border-color p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Dekoracyjne światło w tle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />

        <div className="relative z-10">
          <h3 className="text-3xl font-extrabold text-white text-center tracking-tight mb-2">
            Witaj ponownie
          </h3>
          <p className="text-text-secondary text-center text-sm mb-8">
            Zaloguj się, aby odblokować zapisywanie własnych kolekcji filmowych.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary block">
                Nazwa użytkownika
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-secondary-bg border border-border-color focus:border-primary text-white pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 placeholder:text-text-secondary/40 text-base"
                  placeholder="Wpisz swój login..."
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-hover-accent text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98]"
            >
              Autoryzuj dostęp
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;