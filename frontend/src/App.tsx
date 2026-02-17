import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TrainSchedulePage } from './pages/TrainSchedulePage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token, handleLogin, handleLogout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/"
          element={
            token ? (
              <TrainSchedulePage token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
