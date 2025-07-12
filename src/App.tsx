import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignInPage } from './pages/SignInPage';
import { HomePage } from './pages/HomePage';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-700">Cargando...</p>
            </div>
        );
    }
    // Si no está logueado, redirige a la página de login
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // Si está logueado, renderiza el contenido protegido
    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Rutas públicas (accesibles para todos) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignInPage />} />
                {/* Ruta raíz redirige a /login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                {/* Rutas protegidas (solo para usuarios autenticados) */}
                <Route path="/*" element={<ProtectedRoute><HomePage /></ProtectedRoute>} /> 
            </Routes>
        </Router>
    );
}

export default App;