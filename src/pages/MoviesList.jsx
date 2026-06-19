import { useState, useEffect, useRef } from 'react';
import { fromEvent, from } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fetchMoviesMock } from '../api/mockData';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);

  // Pierwsze ładowanie wszystkich filmów
  useEffect(() => {
    setIsLoading(true);
    fetchMoviesMock('').then(data => {
      setMovies(data);
      setIsLoading(false);
    });
  }, []);

  // RXJS: Reaktywne wyszukiwanie
  useEffect(() => {
    if (!searchInputRef.current) return;

    // Tworzymy strumień ze zdarzeń wpisywania w pole input
    const searchStream$ = fromEvent(searchInputRef.current, 'input').pipe(
      map(event => event.target.value),      // 1. Pobieramy wpisaną wartość
      debounceTime(500),                     // 2. Czekamy 500ms po ostatnim kliknięciu (nie spamujemy API)
      distinctUntilChanged(),                // 3. Puszczamy dalej tylko jeśli tekst się zmienił
      switchMap(searchTerm => {              // 4. Anulujemy poprzednie wyszukiwanie, jeśli przyszło nowe!
        setIsLoading(true);
        return from(fetchMoviesMock(searchTerm)); // Konwersja Promise z naszego API na strumień RxJS
      })
    );

    // Subskrybujemy wyniki
    const subscription = searchStream$.subscribe(results => {
      setMovies(results);
      setIsLoading(false);
    });

    // Sprzątanie strumienia, gdy komponent znika
    return () => subscription.unsubscribe();
  }, []);

  // Funkcja dodająca film do localStorage
  const addToMyList = (movie) => {
    const savedList = JSON.parse(localStorage.getItem('myMovies')) || [];
    // Sprawdzamy czy już nie ma tego filmu
    if (!savedList.find(m => m.id === movie.id)) {
      savedList.push(movie);
      localStorage.setItem('myMovies', JSON.stringify(savedList));
      alert(`Dodano "${movie.title}" do Twojej listy!`);
    } else {
      alert('Ten film jest już na Twojej liście.');
    }
  };

  return (
    <div>
      <h2>Eksplorator Filmów</h2>
      
      <div className="search-box">
        <label>Wyszukaj film (działa w oparciu o RxJS):</label>
        <input 
          type="text" 
          ref={searchInputRef} 
          placeholder="Zacznij pisać (np. Matrix)..."
        />
        {isLoading && <span className="loading-indicator">⏳ Szukam...</span>}
      </div>

      <div className="movies-grid">
        {movies.length === 0 && !isLoading && <p>Nie znaleziono filmów.</p>}
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <h4>{movie.title}</h4>
            <p>Rok: {movie.year}</p>
            <p>Gatunek: {movie.genre}</p>
            <button onClick={() => addToMyList(movie)} className="btn-secondary">
              + Do mojej listy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoviesList;