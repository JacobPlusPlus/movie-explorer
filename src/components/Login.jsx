import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Zatrzymuje przeładowanie strony
    
    // Walidacja formularza
    if (username.trim().length < 3) {
      setError('Błąd: Login musi mieć przynajmniej 3 znaki!');
      return;
    }
    
    setError('');
    onLogin(username); // Przekazanie danych w górę (do App.jsx)
  };

  return (
    <div className="card form-container">
      <h3>Logowanie</h3>
      <p>Zaloguj się, aby tworzyć własną listę filmów.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nazwa użytkownika:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Wpisz login..."
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary">Zaloguj się</button>
      </form>
    </div>
  );
}

export default Login;