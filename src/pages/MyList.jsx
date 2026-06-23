import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Film, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function MyList() {
  const [myMovies, setMyMovies] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myMovies')) || [];
    setMyMovies(saved);
  }, []);

  const removeMovie = (id) => {
    const updatedList = myMovies.filter(movie => movie.id !== id);
    setMyMovies(updatedList);
    localStorage.setItem('myMovies', JSON.stringify(updatedList));
    // Powiadomienie innych komponentów o zmianie w localStorage
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="space-y-8">
      {/* Nagłówek sekcji prywatnej */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black tracking-tight">Twoja prywatna lista</h2>
            <span className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {myMovies.length} pozycji
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1">
            Zestawienie filmów zapisanych lokalnie w pamięci Twojej przeglądarki.
          </p>
        </div>
        <Link to="/movies" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-white bg-card border border-border-color px-4 py-2 rounded-xl transition-colors self-start sm:self-center">
          <ArrowLeft className="w-4 h-4" /> Powrót do wyszukiwarki
        </Link>
      </div>

      {/* Lista elementów */}
      <div className="max-w-3xl">
        <AnimatePresence>
          {myMovies.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-card border border-border-color rounded-2xl p-16 space-y-4"
            >
              <div className="w-12 h-12 bg-secondary-bg border border-border-color rounded-xl flex items-center justify-center mx-auto text-text-secondary">
                <Film className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold">Twoja lista jest pusta</p>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">
                  Przejdź do zakładki odkrywania filmów i dodaj interesujące Cię tytuły.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {myMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border-color p-4 rounded-xl flex items-center justify-between group hover:border-primary/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-20 bg-secondary-bg border border-border-color rounded-lg hidden sm:flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors overflow-hidden flex-shrink-0">
                      {movie.poster ? (
                        <img 
                          src={movie.poster} 
                          alt={movie.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <Film className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                        <span>{movie.year} r.</span>
                        <span className="w-1 h-1 bg-border-color rounded-full" />
                        <span>{movie.genre}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeMovie(movie.id)} 
                    className="p-2.5 bg-secondary-bg hover:bg-red-500/10 border border-border-color hover:border-red-500/30 text-text-secondary hover:text-red-400 rounded-xl transition-all duration-200"
                    title="Usuń z listy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MyList;