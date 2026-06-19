const MOVIES_DATABASE = [
  { id: 1, title: 'Incepcja', year: 2010, genre: 'Sci-Fi' },
  { id: 2, title: 'Interstellar', year: 2014, genre: 'Sci-Fi' },
  { id: 3, title: 'Mroczny Rycerz', year: 2008, genre: 'Akcja' },
  { id: 4, title: 'Matrix', year: 1999, genre: 'Sci-Fi' },
  { id: 5, title: 'Władca Pierścieni: Drużyna Pierścienia', year: 2001, genre: 'Fantasy' },
  { id: 6, title: 'Władca Pierścieni: Dwie Wieże', year: 2002, genre: 'Fantasy' },
  { id: 7, title: 'Pulp Fiction', year: 1994, genre: 'Kryminał' },
  { id: 8, title: 'Skazani na Shawshank', year: 1994, genre: 'Dramat' },
  { id: 9, title: 'Forrest Gump', year: 1994, genre: 'Dramat' },
  { id: 10, title: 'Gladiator', year: 2000, genre: 'Akcja' },
];

// Funkcja symulująca fetchowanie danych z opóźnieniem (jak prawdziwe API)
export const fetchMoviesMock = (searchTerm) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!searchTerm) {
        resolve(MOVIES_DATABASE);
      } else {
        const filtered = MOVIES_DATABASE.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve(filtered);
      }
    }, 800); // 800ms opóźnienia, by widzieć jak działa RxJS!
  });
};