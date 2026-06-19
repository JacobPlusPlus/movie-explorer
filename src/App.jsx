import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Film, Search, Compass, List, User, LogIn, LogOut } from 'lucide-react';
import Login from './components/Login';
import MoviesList from './pages/MoviesList';
import MyList from './pages/MyList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('username');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setUsername(savedUser);
    }

    const updateCount = () => {
      const savedList = JSON.parse(localStorage.getItem('myMovies')) || [];
      setSavedCount(savedList.length);
    };
    
    updateCount();
    // Reagujemy tylko na faktyczne zmiany, a nie co sekundę w ciemno!
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
    };
  }, [isAuthenticated]);

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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30">
      <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border-color transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/movies" className="flex items-center gap-2 text-2xl font-black tracking-tight text-white hover:opacity-90 transition-opacity">
            <span className="bg-gradient-to-r from-primary to-hover-accent text-transparent bg-clip-text flex items-center gap-2">
              <Film className="text-primary w-7 h-7" /> MovieVault
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <Link to="/movies" className="flex items-center gap-1.5 hover:text-white transition-colors py-2">
              <Compass className="w-4 h-4" /> Discover
            </Link>
            {isAuthenticated && (
              <Link to="/my-list" className="flex items-center gap-1.5 hover:text-white transition-colors py-2 relative">
                <List className="w-4 h-4" /> My List
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-4 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {savedCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-secondary-bg px-4 py-2 border border-border-color rounded-full text-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-text-secondary font-medium">{username}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2.5 bg-card hover:bg-red-500/10 border border-border-color hover:border-red-500/30 rounded-xl text-text-secondary hover:text-red-400 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-primary hover:bg-hover-accent text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20">
                <LogIn className="w-4 h-4" /> Zaloguj
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/movies" />} />
          <Route path="/my-list" element={isAuthenticated ? <MyList /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;