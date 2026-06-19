import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import MoviesList from './pages/MoviesList';
import MyList from './pages/MyList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Inicjalizacja z localStorage przy uruchomieniu aplikacji
  useEffect(() => {
    const savedAuth = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('username');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setUsername(savedUser);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', user);
    setIsAuthenticated(true);
    setUsername(user);
    navigate('/movies');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h2>Filmoteka</h2>
        <div className="nav-links">
          <Link to="/movies">Wyszukiwarka</Link>
          {/* Link widoczny tylko dla zalogowanych */}
          {isAuthenticated && <Link to="/my-list">Moja Lista</Link>}
          
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-logout">
              Wyloguj ({username})
            </button>
          ) : (
            <Link to="/login" className="btn-login">Zaloguj</Link>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/movies" />} 
          />
          {/* Chroniony widok (Protected Route) */}
          <Route 
            path="/my-list" 
            element={isAuthenticated ? <MyList /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;