import { useState, useEffect, useRef } from 'react';
import { fromEvent, from } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { motion, AnimatePresence } from 'framer-motion';
// Dodaliśmy ikonę Check
import { Search, Loader2, Plus, Calendar, Bookmark, Film, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMoviesMock } from '../api/mockData';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // NOWE: Stan przechowujący ID zapisanych filmów do zmiany koloru przycisku
  const [savedMovieIds, setSavedMovieIds] = useState([]); 
  const [hoveredId, setHoveredId] = useState(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  //Synchronizacja przycisków z localStorage przy starcie aplikacji
  useEffect(() => {
    const updateSavedIds = () => {
      const savedList = JSON.parse(localStorage.getItem('myMovies')) || [];
      setSavedMovieIds(savedList.map(movie => movie.id));
    };
    
    updateSavedIds();
    // Nasłuchujemy zmian w pamięci (jak ktoś usunie film w innej zakładce, przycisk sam wróci do normy)
    window.addEventListener('storage', updateSavedIds);
    return () => window.removeEventListener('storage', updateSavedIds);
  }, []);

  const fetchMoviesWithFallback = async (searchTerm) => {
    //domyślnie "Avengers"
    const apiQuery = searchTerm || 'Avengers';

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${apiQuery}&apikey=${OMDB_API_KEY}`);
      const data = await response.json();

      if (data.Response === "True") {
        return data.Search.map(movie => ({
          id: movie.imdbID,
          title: movie.Title,
          year: movie.Year,
          genre: movie.Type === 'movie' ? 'Film' : 'Serial',
          poster: movie.Poster !== 'N/A' ? movie.Poster : null
        }));
      } else {
        throw new Error("Brak wyników z API");
      }
    } catch (error) {
      console.warn("API niedostępne. Przełączanie na Mocki...");
      // Jeśli searchTerm było puste i API padło, fetchMoviesMock zwróci po prostu całą bazę domyślną
      return fetchMoviesMock(searchTerm);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMoviesWithFallback('').then(data => {
      setMovies(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!searchInputRef.current) return;

    const searchStream$ = fromEvent(searchInputRef.current, 'input').pipe(
      map(event => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        setIsLoading(true);
        return from(fetchMoviesWithFallback(searchTerm));
      })
    );

    const subscription = searchStream$.subscribe(results => {
      setMovies(results);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMyList = (movie) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      alert("🔒 Musisz być zalogowany, aby tworzyć swoją własną kolekcję!");
      navigate('/login');
      return;
    }

    const savedList = JSON.parse(localStorage.getItem('myMovies')) || [];
    const isAlreadySaved = savedList.find(m => m.id === movie.id);

    if (isAlreadySaved) {
      const updated = savedList.filter(m => m.id !== movie.id);
      localStorage.setItem('myMovies', JSON.stringify(updated));
      setSavedMovieIds(prev => prev.filter(id => id !== movie.id));
    } else {
      savedList.push(movie);
      localStorage.setItem('myMovies', JSON.stringify(savedList));
      setSavedMovieIds(prev => [...prev, movie.id]);
    }
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <div className="relative py-20 text-center overflow-hidden rounded-3xl border border-border-color/50 px-6 bg-[#121826]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-hover-accent/10 via-transparent to-transparent opacity-70" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
            Discover Your Next <br />
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-hover-accent text-transparent bg-clip-text">
              Favorite Movie
            </span>
          </h1>
          <p className="text-text-secondary text-base md:text-xl font-normal max-w-xl mx-auto">
            Przeglądaj kinowe arcydzieła, sprawdzaj gatunki i twórz własne unikalne listy rekomendacji. Wszystko w mgnieniu oka.
          </p>

          <div className="max-w-xl mx-auto pt-4 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-hover-accent rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-300" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                ref={searchInputRef} 
                placeholder="Zacznij pisać tytuł filmu (np. Matrix)..."
                className="w-full h-[60px] bg-card/90 border border-border-color focus:border-primary text-white pl-14 pr-12 rounded-2xl outline-none text-base shadow-2xl transition-all duration-300 placeholder:text-text-secondary/50"
              />
              {isLoading && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Katalog filmów</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {movies.map((movie, index) => {
              // NOWE: Sprawdzamy, czy ten konkretny film jest już na liście
              const isAdded = savedMovieIds.includes(movie.id);

              return (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -6, scale: 1.04 }}
                  className="bg-card border border-border-color rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-between h-[360px] relative will-change-transform"
                >
                  {/* DYNAMICZNY PLAKAT */}
                  {movie.poster ? (
                    <div className="h-44 w-full relative overflow-hidden border-b border-border-color">
                      <img 
                        src={movie.poster} 
                        alt={movie.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      {isAdded && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          <Bookmark className="w-10 h-10 text-primary fill-primary drop-shadow-lg" />
                        </div>
                      )}
                      <span className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md border border-border-color text-xs font-semibold px-2.5 py-1 rounded-md text-primary z-20 shadow-xl">
                        {movie.genre}
                      </span>
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-secondary-bg to-card relative flex items-center justify-center p-4 border-b border-border-color group-hover:from-primary/10 transition-colors duration-300">
                      {isAdded ? (
                        <Bookmark className="w-10 h-10 text-primary fill-primary drop-shadow-lg" />
                      ) : (
                        <Film className="w-12 h-12 text-text-secondary/20 group-hover:text-primary/40 transition-colors" />
                      )}
                      <span className="absolute bottom-3 left-3 bg-card border border-border-color text-xs font-semibold px-2.5 py-1 rounded-md text-primary shadow-lg z-20">
                        {movie.genre}
                      </span>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-text-secondary font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{movie.year} r.</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleMyList(movie)}
                      onMouseEnter={() => isAdded && setHoveredId(movie.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`w-full flex items-center justify-center gap-1.5 border text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-300 ${
                        isAdded 
                          ? hoveredId === movie.id
                            ? 'bg-red-600 border-red-500'
                            : 'bg-green-600 border-green-500'
                          : 'bg-secondary-bg hover:bg-primary border-border-color hover:border-primary'
                      }`}
                    >
                      {isAdded ? (
                        hoveredId === movie.id
                          ? <><Trash2 className="w-4 h-4" /> Usuń</>
                          : <><Check className="w-4 h-4" /> Added</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Add to List</>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {movies.length === 0 && !isLoading && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-text-secondary bg-card border border-border-color p-12 rounded-2xl"
          >
            Brak filmów spełniających kryteria wyszukiwania. Spróbuj innego słowa kluczowego.
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default MoviesList;