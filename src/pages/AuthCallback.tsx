import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../config/config';
import MainHeader from '../components/MainHeader';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('No se recibió el código de autorización');
        }

        // Redirigir al usuario al backend para procesar el código
        window.location.href = `${config.apiUrl}/auth/discord/callback${location.search}`;
      } catch (error) {
        console.error('Error en el callback:', error);
        navigate('/?error=auth_failed');
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `radial-gradient(circle at 50% 50%, rgba(67, 164, 229, 0.15), transparent 60%)`
    }}>
      <MainHeader />
      <div className="loading-screen" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--foreground)' }}>Autenticando...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 