import { useState, useEffect } from 'react';

function MyList() {
  const [myMovies, setMyMovies] = useState([]);

  useEffect(() => {
    // Odczyt z localStorage
    const saved = JSON.parse(localStorage.getItem('myMovies')) || [];
    setMyMovies(saved);
  }, []);

  const removeMovie = (id) => {
    const updatedList = myMovies.filter(movie => movie.id !== id);
    setMyMovies(updatedList);
    // Aktualizacja localStorage
    localStorage.setItem('myMovies', JSON.stringify(updatedList));
  };

  return (
    <div>
      <h2>Twoja prywatna lista</h2>
      <p>Te filmy są widoczne tylko dla Ciebie, zapisane w przeglądarce.</p>

      {myMovies.length === 0 ? (
        <p className="empty-state">Twoja lista jest pusta. Znajdź coś w wyszukiwarce!</p>
      ) : (
        <ul className="my-movies-list">
          {myMovies.map(movie => (
            <li key={movie.id} className="card">
              <span><strong>{movie.title}</strong> ({movie.year})</span>
              <button onClick={() => removeMovie(movie.id)} className="btn-danger">
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyList;