import React, { useState, useEffect} from "react";
import './assets/css/App.css';
import './assets/css/Descuento.css';
import './assets/css/Actualizaciones.css'
import './assets/css/ServerConfig.css'
import logo from './assets/img/logo.webp'; // Importa la imagen
import { Link, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from './auth/AuthContext'; // Importa el hook useAuth
import Dashboard from './pages/dashboard';
import ServerConfig from './pages/ServerConfig';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/404';
import AuthCallback from './pages/AuthCallback';
import PrivacyPolicyPage from './pages/privacy-policy';
import TermsConditionsPage from './pages/terms-conditions';
import Leaderboard from './pages/leaderboard';
import GlobalLeaderboard from './pages/TopGlobal';

import AnimateOnVisible from './components/AnimateOnVisible'
import SequentialFadeIn from './components/AnimateOnCartas'

// Constantes de configuración
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const App: React.FC = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { user, logout, loading } = useAuth(); // Accede al contexto de autenticación
  const navigate = useNavigate();
  const location = useLocation();

  const showUpdatesModal = () => {
    const overlay = document.getElementById('updatesOverlay');
    const modal = document.getElementById('updatesModal');
    
    overlay?.classList.add('show');
    modal?.classList.add('show');
  };

  const closeUpdatesModal = () => {
    const overlay = document.getElementById('updatesOverlay');
    const modal = document.getElementById('updatesModal');
    
    modal?.classList.remove('show');
    setTimeout(() => {
      overlay?.classList.remove('show');
    }, 200);
  };

  // Añadir event listener para cerrar con Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeUpdatesModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Verificar la autenticación cuando se carga la página
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isAuthenticated = params.get('authenticated') === 'true';
    const error = params.get('error');

    if (isAuthenticated) {
      // Limpiar la URL después de la autenticación
      navigate('/', { replace: true });
    } else if (error) {
      let errorMessage = '';
      switch (error) {
        case 'sesion_expirada':
          errorMessage = 'La sesión ha expirado. Por favor, intenta iniciar sesión nuevamente.';
          break;
        case 'auth_init_failed':
          errorMessage = 'Error al iniciar la autenticación. Por favor, intenta de nuevo.';
          break;
        default:
          errorMessage = 'Error durante la autenticación. Por favor, intenta de nuevo.';
      }
      setAuthError(errorMessage);
      // Limpiar la URL después de procesar el error
      navigate('/', { replace: true });
      // Limpiar el mensaje de error después de 5 segundos
      setTimeout(() => setAuthError(null), 5000);
    }
  }, [location, navigate]);

  const handleLogin = () => {
    setAuthError(null); // Limpiar cualquier error previo
    window.location.href = `${API_URL}/auth/discord`;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        logout();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const navigateToLeaderboard = () => {
    navigate('/global-leaderboard');
  };
   // Función para cerrar el menú
   const closeMenu = () => setMenuOpen(false);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {authError && (
        <div className="auth-error">
          {authError}
        </div>
      )}
      {/* Modal de actualizaciones (mantenido exactamente igual) */}
      <div className="modal-overlay" id="updatesOverlay"></div>
      <div className="updates-modal" id="updatesModal">
          <button className="close-updates" id="closeUpdates" aria-label="Cerrar modal" onClick={closeUpdatesModal}>
              <i className="fas fa-times" style={{ color: 'red' }}></i>
          </button>
          
          <div className="modal-banner"></div>
          <div className="status-badge">ÚLTIMAS ACTUALIZACIONES</div>
          <img src="https://www.niveles.xyz/static/media/logo.b9b160b7a19443eb8ad5.webp" alt="Avatar" className="modal-avatar" />
          
          <div className="modal-content">
              <div className="modal-header">
                  <h2>Actualizaciones del Sistema</h2>
                  <p>v1.1 - Publicado el 28/03/2025</p>
              </div>
              
              <ul className="updates-list">
                  <li><strong>Sistema de Niveles Mejorado:</strong> Hemos optimizado el algoritmo de XP para una progresión más balanceada.</li>
                  <li><strong>Dashboard Mejorado:</strong> Interfaz de administración rediseñada con más opciones de personalización.</li>
                  <li><strong>Rendimiento:</strong> Reducción del 40% en el uso de recursos del servidor.</li>
                  <li><strong>Seguridad:</strong> Implementado nuevo sistema de protección contra abuso del sistema.</li>
                  <li><strong>Compatibilidad:</strong> Ahora soporta los últimos features de la API de Discord.</li>
              </ul>
          </div>
      </div>



      {/* DESCUENTO HEADER */}
      <div className="banner-container">
        <div className="banner-content">
          <div className="banner-text">
            <span>Consigue </span>
            <span className="descuento">50% de descuento </span>
            <span className="bold">Niveles</span>
          </div>
          <a href="https://discord.com/discovery/applications/1330564254822043761/store/1347581050041401518" className="btn btn-premium" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#prefix__clip0)">
                    <path d="M13.174 17.44h-1.349v.003h1.349v-.003z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M13.174 17.44h-1.349v.003h1.349v-.003z" fill="#fff"></path>
                    <path d="M12.144 6.184a.317.317 0 00-.056-.074l-.019-.015a.44.44 0 00-.059-.037h-.016l-.072-.021a.332.332 0 00-.088 0v4.47l1.137-2.774-.827-1.549z" fill="#FFCB39"></path>
                    <path d="M11.826 18.91v-1.186H4.154a1.62 1.62 0 00-1.135.462c-.301.296-.47.697-.47 1.116v.131c0 .418.169.82.47 1.116.301.295.71.462 1.135.462h6.858l.803-1.986.01-.115z" fill="#FFE570"></path>
                    <path d="M21.977 19.088a.42.42 0 000-.052c-.009-.06-.022-.12-.04-.179v-.018a1.463 1.463 0 00-.072-.19l-.016-.034a1.655 1.655 0 00-.094-.165 1.616 1.616 0 00-.283-.321 1.673 1.673 0 00-.375-.24l-.155-.06-.153-.042h-.016l-.13-.021-1.339 3.26h1.121a1.58 1.58 0 001.012-.357c.079-.065.152-.137.22-.213a1.601 1.601 0 00.352-.818V19.302a1.346 1.346 0 00-.032-.213zM16.548 17.724L15.205 21h1.857l1.343-3.276h-1.857z" fill="#FFCB39"></path>
                    <path d="M11.012 21h.813v-1.985L11.012 21z" fill="#FFE570"></path>
                    <path opacity="0.3" d="M11.012 21h.813v-1.985L11.012 21z" fill="#fff"></path>
                    <path d="M12.355 17.724l-.53 1.29V21h3.38l1.343-3.276h-4.193z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M12.355 17.724l-.53 1.29V21h3.38l1.343-3.276h-4.193z" fill="#fff"></path>
                    <path d="M11.825 19.015l.53-1.291h-.53v1.291zM20.596 17.737h-2.191l-1.338 3.276h2.21l1.338-3.26-.019-.016z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M20.596 17.737h-2.191l-1.338 3.276h2.21l1.338-3.26-.019-.016z" fill="#fff"></path>
                    <path d="M18.763 8.784c-.789-1.717-.647-1.577-2.394-2.366 1.747-.773 1.605-.634 2.394-2.353.787 1.72.645 1.577 2.395 2.366-1.75.776-1.608.64-2.395 2.353zM22.224 6.492c-.587-1.276-.482-1.17-1.777-1.746 1.295-.576 1.19-.47 1.777-1.746.583 1.275.478 1.17 1.776 1.746-1.298.576-1.193.47-1.776 1.746z" fill="#C8D4FF"></path>
                    <path d="M20.968 17.443H3.578a.281.281 0 00-.283.278v.003c0 .154.127.279.284.279h17.39a.281.281 0 00.283-.28v-.002a.281.281 0 00-.284-.278z" fill="#D0A500"></path>
                    <path d="M11.825 6.024a.308.308 0 00-.22.155l-3.7 7.075a.296.296 0 01-.22.157.305.305 0 01-.259-.083l-4.91-4.822a.304.304 0 00-.474.063.293.293 0 00-.04.173l1.496 8.7h5.48l2.847-6.94V6.023z" fill="#FFE570"></path>
                    <path d="M16.297 13.333a.308.308 0 01-.474-.082l-.522-1.001-2.14 5.19h1.806l1.902-4.636-.572.529zM22.303 8.077a.297.297 0 00-.267.074l-1.648 1.488-3.211 7.801h3.917l1.448-9.029a.29.29 0 00-.051-.214.3.3 0 00-.188-.12z" fill="#FFCB39"></path>
                    <path d="M11.825 10.501L8.98 17.443h2.847V10.5z" fill="#FFE570"></path>
                    <path opacity="0.3" d="M11.825 10.501L8.98 17.443h2.847V10.5z" fill="#fff"></path>
                    <path d="M12.957 7.743l-1.132 2.758v6.939h1.349l2.127-5.19-2.344-4.507z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M12.957 7.743l-1.132 2.758v6.939h1.349l2.127-5.19-2.344-4.507z" fill="#fff"></path>
                    <path d="M16.882 12.805L14.98 17.44h2.213l3.2-7.801-3.51 3.166z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M16.882 12.805L14.98 17.44h2.213l3.2-7.801-3.51 3.166z" fill="#fff"></path>
                  </g>
                  <defs>
                    <clipPath id="prefix__clip0">
                      <path fill="#fff" transform="translate(2 3)" d="M0 0h22v18H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                &#160;Actualizar Premium
              </a>
        </div>
      </div>
    {/* DESCUENTO HEADER ARRIBA*/}


      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <a href="/">
                <img src={logo} alt="Niveles Discord Logo" width="35" height="35" style={{ borderRadius: '15px' }} />
                <span>Niveles ✨</span>
              </a>
            </div>

            <nav className="main-nav">
              <ul>
                <li><a href="#hero">Inicio</a></li>
                <li><a href="#commands">Comandos</a></li>
                <li><a href="#pricing">Precios</a></li>
                {user && (
                  <li><a onClick={navigateToLeaderboard}>Tops</a></li>
                )}
              </ul>
            </nav>

            <div className="header-buttons">  
              {/* INICIAR SESION */}
              {user ? (
                <div className="user-menu-container">
                  <div className="user-menu">
                    <div className="user-info" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                      <img
                        src={user.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                        alt={`Avatar de ${user.username}`}
                        className="user-avatar"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                        }}
                      />
                      <span className="username">{user.username}</span>
                      <i className={`fas fa-chevron-down arrow ${isMenuOpen ? 'rotate' : ''}`}></i>
                    </div>
                    <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
                      <button className="dropdown-item"><b>Niveles</b></button>
                      <button className="dropdown-item2" onClick={navigateToDashboard}>
                        <i className="fa fa-server"></i> Mis Servidores
                      </button>
                      <a 
                        className="dropdown-item2" 
                        href="https://top.gg/bot/1330564254822043761#reviews" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <i className="fa fa-star" style={{ marginTop: '7.5px' }}></i> Valóranos
                      </a>
                      <a 
                        className="dropdown-item2" 
                        href="https://discord.com/invite/mu7qfudTuj"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <i className="fa-brands fa-discord" style={{ marginTop: '7.5px' }}></i> Soporte Discord
                      </a>
                      <button className="dropdown-item2" onClick={showUpdatesModal}>
                        <i className="fa fa-sync-alt"></i>Actualizaciones
                      </button>
                      <a 
                        className="dropdown-item2" 
                        href="https://discord.com/discovery/applications/1330564254822043761/store/1347581050041401518"
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: '#e8b74f',
                        }}
                      >
                        <svg width="16" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '3px'}}> 
                        <g clipPath="url(#prefix__clip0)">
                          <path d="M13.174 17.44h-1.349v.003h1.349v-.003z" fill="#FFCB39"></path>
                          <path opacity="0.3" d="M13.174 17.44h-1.349v.003h1.349v-.003z" fill="#fff"></path>
                          <path d="M12.144 6.184a.317.317 0 00-.056-.074l-.019-.015a.44.44 0 00-.059-.037h-.016l-.072-.021a.332.332 0 00-.088 0v4.47l1.137-2.774-.827-1.549z" fill="#FFCB39"></path>
                          <path d="M11.826 18.91v-1.186H4.154a1.62 1.62 0 00-1.135.462c-.301.296-.47.697-.47 1.116v.131c0 .418.169.82.47 1.116.301.295.71.462 1.135.462h6.858l.803-1.986.01-.115z" fill="#FFE570"></path>
                          <path d="M21.977 19.088a.42.42 0 000-.052c-.009-.06-.022-.12-.04-.179v-.018a1.463 1.463 0 00-.072-.19l-.016-.034a1.655 1.655 0 00-.094-.165 1.616 1.616 0 00-.283-.321 1.673 1.673 0 00-.375-.24l-.155-.06-.153-.042h-.016l-.13-.021-1.339 3.26h1.121a1.58 1.58 0 001.012-.357c.079-.065.152-.137.22-.213a1.601 1.601 0 00.352-.818V19.302a1.346 1.346 0 00-.032-.213zM16.548 17.724L15.205 21h1.857l1.343-3.276h-1.857z" fill="#FFCB39"></path>
                          <path d="M11.012 21h.813v-1.985L11.012 21z" fill="#FFE570"></path>
                          <path opacity="0.3" d="M11.012 21h.813v-1.985L11.012 21z" fill="#fff"></path>
                          <path d="M12.355 17.724l-.53 1.29V21h3.38l1.343-3.276h-4.193z" fill="#FFCB39"></path>
                          <path opacity="0.3" d="M12.355 17.724l-.53 1.29V21h3.38l1.343-3.276h-4.193z" fill="#fff"></path>
                          <path d="M11.825 19.015l.53-1.291h-.53v1.291zM20.596 17.737h-2.191l-1.338 3.276h2.21l1.338-3.26-.019-.016z" fill="#FFCB39"></path>
                          <path opacity="0.3" d="M20.596 17.737h-2.191l-1.338 3.276h2.21l1.338-3.26-.019-.016z" fill="#fff"></path>
                          <path d="M18.763 8.784c-.789-1.717-.647-1.577-2.394-2.366 1.747-.773 1.605-.634 2.394-2.353.787 1.72.645 1.577 2.395 2.366-1.75.776-1.608.64-2.395 2.353zM22.224 6.492c-.587-1.276-.482-1.17-1.777-1.746 1.295-.576 1.19-.47 1.777-1.746.583 1.275.478 1.17 1.776 1.746-1.298.576-1.193.47-1.776 1.746z" fill="#C8D4FF"></path>
                          <path d="M20.968 17.443H3.578a.281.281 0 00-.283.278v.003c0 .154.127.279.284.279h17.39a.281.281 0 00.283-.28v-.002a.281.281 0 00-.284-.278z" fill="#D0A500"></path>
                          <path d="M11.825 6.024a.308.308 0 00-.22.155l-3.7 7.075a.296.296 0 01-.22.157.305.305 0 01-.259-.083l-4.91-4.822a.304.304 0 00-.474.063.293.293 0 00-.04.173l1.496 8.7h5.48l2.847-6.94V6.023z" fill="#FFE570"></path>
                          <path d="M16.297 13.333a.308.308 0 01-.474-.082l-.522-1.001-2.14 5.19h1.806l1.902-4.636-.572.529zM22.303 8.077a.297.297 0 00-.267.074l-1.648 1.488-3.211 7.801h3.917l1.448-9.029a.29.29 0 00-.051-.214.3.3 0 00-.188-.12z" fill="#FFCB39"></path>
                          <path d="M11.825 10.501L8.98 17.443h2.847V10.5z" fill="#FFE570"></path>
                          <path opacity="0.3" d="M11.825 10.501L8.98 17.443h2.847V10.5z" fill="#fff"></path>
                          <path d="M12.957 7.743l-1.132 2.758v6.939h1.349l2.127-5.19-2.344-4.507z" fill="#FFCB39"></path>
                          <path opacity="0.3" d="M12.957 7.743l-1.132 2.758v6.939h1.349l2.127-5.19-2.344-4.507z" fill="#fff"></path>
                          <path d="M16.882 12.805L14.98 17.44h2.213l3.2-7.801-3.51 3.166z" fill="#FFCB39"></path>
                          <path opacity="0.3" d="M16.882 12.805L14.98 17.44h2.213l3.2-7.801-3.51 3.166z" fill="#fff"></path>
                        </g>
                        <defs>
                          <clipPath id="prefix__clip0">
                            <path fill="#fff" transform="translate(2 3)" d="M0 0h22v18H0z"></path>
                          </clipPath>
                        </defs>
                      </svg> Premium<span style={{ 
                          backgroundColor: 'crimson',
                          color: 'white',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          borderRadius: '10px',
                          textAlign: 'center',
                        }}>
                          50%
                        </span>
                      </a>
                      <hr className="linemenu"/>
                      <button className="dropdown-item2" onClick={handleLogout} id='CerrarSesion'>
                        <i className="fa fa-sign-out-alt"></i> Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="btn btn-secondary"
                  style={{border: '0px', padding: '12px'}}
                >
                  <i className="fa-brands fa-discord"></i>&#160;Iniciar sesión
                </button>
              )}
              

            {/* Botón para abrir el menú */}
            <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            </div>
          </div>
          <div>


            {/* Menú móvil */}
            <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`}>
              <nav>
                <ul>
                  <li><a href="#hero" className="active" onClick={closeMenu}>Inicio</a></li>
                  <li><a href="#commands" onClick={closeMenu}>Comandos</a></li>
                  <li><a href="#pricing" onClick={closeMenu}>Precios</a></li>
                  {user && (
                    <li><a href="/global-leaderboard" onClick={closeMenu}>Tops</a></li>
                  )}
                  <li>
                  <a href="https://discord.com/discovery/applications/1330564254822043761/store/1347581050041401518" className="btn btn-premium mobile-btn" onClick={closeMenu}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#prefix__clip0)">
                    <path d="M13.174 17.44h-1.349v.003h1.349v-.003z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M13.174 17.44h-1.349v.003h1.349v-.003z" fill="#fff"></path>
                    <path d="M12.144 6.184a.317.317 0 00-.056-.074l-.019-.015a.44.44 0 00-.059-.037h-.016l-.072-.021a.332.332 0 00-.088 0v4.47l1.137-2.774-.827-1.549z" fill="#FFCB39"></path>
                    <path d="M11.826 18.91v-1.186H4.154a1.62 1.62 0 00-1.135.462c-.301.296-.47.697-.47 1.116v.131c0 .418.169.82.47 1.116.301.295.71.462 1.135.462h6.858l.803-1.986.01-.115z" fill="#FFE570"></path>
                    <path d="M21.977 19.088a.42.42 0 000-.052c-.009-.06-.022-.12-.04-.179v-.018a1.463 1.463 0 00-.072-.19l-.016-.034a1.655 1.655 0 00-.094-.165 1.616 1.616 0 00-.283-.321 1.673 1.673 0 00-.375-.24l-.155-.06-.153-.042h-.016l-.13-.021-1.339 3.26h1.121a1.58 1.58 0 001.012-.357c.079-.065.152-.137.22-.213a1.601 1.601 0 00.352-.818V19.302a1.346 1.346 0 00-.032-.213zM16.548 17.724L15.205 21h1.857l1.343-3.276h-1.857z" fill="#FFCB39"></path>
                    <path d="M11.012 21h.813v-1.985L11.012 21z" fill="#FFE570"></path>
                    <path opacity="0.3" d="M11.012 21h.813v-1.985L11.012 21z" fill="#fff"></path>
                    <path d="M12.355 17.724l-.53 1.29V21h3.38l1.343-3.276h-4.193z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M12.355 17.724l-.53 1.29V21h3.38l1.343-3.276h-4.193z" fill="#fff"></path>
                    <path d="M11.825 19.015l.53-1.291h-.53v1.291zM20.596 17.737h-2.191l-1.338 3.276h2.21l1.338-3.26-.019-.016z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M20.596 17.737h-2.191l-1.338 3.276h2.21l1.338-3.26-.019-.016z" fill="#fff"></path>
                    <path d="M18.763 8.784c-.789-1.717-.647-1.577-2.394-2.366 1.747-.773 1.605-.634 2.394-2.353.787 1.72.645 1.577 2.395 2.366-1.75.776-1.608.64-2.395 2.353zM22.224 6.492c-.587-1.276-.482-1.17-1.777-1.746 1.295-.576 1.19-.47 1.777-1.746.583 1.275.478 1.17 1.776 1.746-1.298.576-1.193.47-1.776 1.746z" fill="#C8D4FF"></path>
                    <path d="M20.968 17.443H3.578a.281.281 0 00-.283.278v.003c0 .154.127.279.284.279h17.39a.281.281 0 00.283-.28v-.002a.281.281 0 00-.284-.278z" fill="#D0A500"></path>
                    <path d="M11.825 6.024a.308.308 0 00-.22.155l-3.7 7.075a.296.296 0 01-.22.157.305.305 0 01-.259-.083l-4.91-4.822a.304.304 0 00-.474.063.293.293 0 00-.04.173l1.496 8.7h5.48l2.847-6.94V6.023z" fill="#FFE570"></path>
                    <path d="M16.297 13.333a.308.308 0 01-.474-.082l-.522-1.001-2.14 5.19h1.806l1.902-4.636-.572.529zM22.303 8.077a.297.297 0 00-.267.074l-1.648 1.488-3.211 7.801h3.917l1.448-9.029a.29.29 0 00-.051-.214.3.3 0 00-.188-.12z" fill="#FFCB39"></path>
                    <path d="M11.825 10.501L8.98 17.443h2.847V10.5z" fill="#FFE570"></path>
                    <path opacity="0.3" d="M11.825 10.501L8.98 17.443h2.847V10.5z" fill="#fff"></path>
                    <path d="M12.957 7.743l-1.132 2.758v6.939h1.349l2.127-5.19-2.344-4.507z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M12.957 7.743l-1.132 2.758v6.939h1.349l2.127-5.19-2.344-4.507z" fill="#fff"></path>
                    <path d="M16.882 12.805L14.98 17.44h2.213l3.2-7.801-3.51 3.166z" fill="#FFCB39"></path>
                    <path opacity="0.3" d="M16.882 12.805L14.98 17.44h2.213l3.2-7.801-3.51 3.166z" fill="#fff"></path>
                  </g>
                  <defs>
                    <clipPath id="prefix__clip0">
                      <path fill="#fff" transform="translate(2 3)" d="M0 0h22v18H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                      &#160;Premium
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero">
          <div className="hero-gradient"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Niveles</h1>
              <p>Los miembros ganan XP por <b>escribir</b> en el <b>chat</b> y al estar en <b>llamada.</b> Al acumular XP, los miembros suben de nivel y desbloquean recompensas. 
              Además, puedes personalizar los mensajes, asignar roles automáticos y competir en la clasificación para ver quién es el que más ha progresado.</p>
              <div className="hero-buttons">
                <a href="https://discord.com/oauth2/authorize?client_id=1330564254822043761&permissions=8&integration_type=0&scope=bot" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <i className="fa-brands fa-discord"></i>&#160;Añadir aplicación
                </a>&#160;
                <a href="#commands" className="btn btn-tercero">Ver Comandos</a>
              </div>
            </div>

            <AnimateOnVisible threshold={0.25}>
            <div className="bot-preview">
              <div className="preview-window">
                <div className="window-header">
                  <div className="window-controls">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="window-title">Discord - Niveles</div>
                </div>
                <div className="window-content">
                  <div className="preview-grid">
                    <div className="preview-card">
                      <h3>Leaderboard</h3>
                      <div className="leaderboard-entries">
                        <div className="leaderboard-entry">
                          <div className="entry-info">
                            <span className="rank">1.</span>
                            <img
                              src="https://avatars.githubusercontent.com/u/171730096?v=4"
                              alt="Logo de Niveles"
                              width="30px"
                              style={{ borderRadius: '15px' }}
                            />
                            <span className="username">monte</span>
                          </div>
                          <div className="level">LVL: 12</div>
                        </div>
                        <div className="leaderboard-entry">
                          <div className="entry-info">
                            <span className="rank">2.</span>
                            <img
                              src="https://discordthemes.com/assets/img/pfps/15.png"
                              alt="Avatar de Froggurl"
                              width="30px"
                              style={{ borderRadius: '15px' }}
                            />
                            <span className="username">DevAgus</span>
                          </div>
                          <div className="level">LVL: 10</div>
                        </div>
                        <div className="leaderboard-entry">
                          <div className="entry-info">
                            <span className="rank">3.</span>
                            <img
                              src="https://discordthemes.com/assets/img/pfps/22.png"
                              alt="Avatar de Frinkis"
                              width="30px"
                              style={{ borderRadius: '15px' }}
                            />
                            <span className="username">Frinkis</span>
                          </div>
                          <div className="level">LVL: 8</div>
                        </div>
                        <div className="leaderboard-entry">
                          <div className="entry-info">
                            <span className="rank">4.</span>
                            <img
                              src="https://discordthemes.com/assets/img/pfps/3.png"
                              alt="Avatar de Dapper"
                              width="30px"
                              style={{ borderRadius: '15px' }}
                            />
                            <span className="username">Dapper</span>
                          </div>
                          <div className="level">LVL: 5</div>
                        </div>
                        <div className="leaderboard-entry">
                          <div className="entry-info">
                            <span className="rank">5.</span>
                            <img
                              src="https://discordthemes.com/assets/img/pfps/10.png"
                              alt="Avatar de Wumpis"
                              width="30px"
                              style={{ borderRadius: '15px' }}
                            />
                            <span className="username">Wumpis</span>
                          </div>
                          <div className="level">LVL: 1</div>
                        </div>
                      </div>
                    </div>

                    <div className="preview-card">
                      <h3>Mensajes para subir de nivel</h3>
                      <div className="message-entries">
                        <div className="message">🎉 ¡Felicitaciones, @Usuario1! ¡Has alcanzado el nivel 7!</div>
                        <div className="message">⬆️ @User2 ha subido al nivel 10. ¡Sigue así!</div>
                        <div className="message">🚀 ¡Increíble! ¡@User3 acaba de avanzar al nivel 15!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </AnimateOnVisible>  
          </div>
        </section>
        

        {/* Banner Servers */}
        {/* <section className="banner-servers">
          <div className="container">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">Utilizado por más de 50 servidores</div>
              </div>
            </div>

            <div className="logos-container">          
              <img 
                src="https://cdn.discordapp.com/icons/1316821920871747634/b8c425ac4ce5ac88c1c6093006494497.webp?size=80&quality=lossless" 
                alt="HomeLife" 
                className="logo-item"
              />
              <img 
                src="https://yt3.googleusercontent.com/TeBw4N74g2CiedxJ4_gvq3fKzibqRl6g46tRa8xhPasPdtGBBgS9JQu9gmxqrBy2F6r6RmaMbQ=s900-c-k-c0x00ffffff-no-rj" 
                alt="ZonaGemelos Support" 
                className="logo-item"
              />
              <img 
                src="https://cdn.discordapp.com/icons/1072186127877951580/f9d4a29435f9f6e9a46e4f1c323d740a.webp?size=80&quality=lossless" 
                alt="FutMundo" 
                className="logo-item"
              />
              <img 
                src="https://cdn.discordapp.com/icons/1350449336747819049/db497d3b4f3efeae95a97c57d97e9c60.webp?size=80&quality=lossless" 
                alt="Global Community" 
                className="logo-item"
              />
            </div>
          </div>
        </section>


        {/* Commands Section */}
        <AnimateOnVisible threshold={0.45}>
        <section id="commands" className="commands">
          <div className="container">
            <div className="section-header">
              <h2>Comandos</h2>
              <p>Niveles ofrece diversos comandos para gestionar el sistema de nivelación de tu servidor. Estos son algunos de los más importantes:</p>
            </div>

              
            <div className="commands-grid">
            <SequentialFadeIn>
              <div className="command-card">
                <div className="command-icon">📚</div>
                <h3>Commando Help</h3>
                <p>Muestra toda la información sobre el sistema de niveles, incluido cómo ganar XP, cómo funcionan los roles y las configuraciones disponibles para personalizar la experiencia.</p>
                <div className="command-footer">
                  <code>/help</code>
                </div>
              </div>

              <div className="command-card">
                <div className="command-icon">📊</div>
                <h3>Comando Minivel</h3>
                <p>Muestra tu nivel actual, la cantidad de XP que has acumulado y cuánto más necesitas para alcanzar el siguiente nivel dentro de este servidor.</p>
                <div className="command-footer">
                  <code>/minivel</code>
                </div>
              </div>

              <div className="command-card">
                <div className="command-icon">🏆</div>
                <h3>Comando Leaderboard</h3>
                <p>Muestra la clasificación de los jugadores con más XP en este servidor. Puedes ver quiénes están en las primeras posiciones y cuánta XP tienen.</p>
                <div className="command-footer">
                  <code>/leaderboard</code>
                </div>
              </div>

              <div className="command-card premium-card">
                <div className="command-header">
                  <div className="command-icon">🚀</div>
                  <span className="premium-tag">Premium</span>
                </div>
                <h3>Comando Boostxp</h3>
                <p>Activa un multiplicador de XP para aumentar la experiencia obtenida al enviar mensajes. Esta función solo está disponible con el paquete Premium.</p>
                <div className="command-footer">
                  <code>/boostxp</code>
                </div>
              </div>
            </SequentialFadeIn>
            </div>
            

            <div className="section-footer">
              <a href="#all-commands" className="btn btn-primary">Ver todos los comandos</a>
            </div>
          </div>
        </section>
        </AnimateOnVisible>



        <AnimateOnVisible threshold={0.25}>
        {/* All Commands Section */}
        <section id="all-commands" className="all-commands">
          <div className="container">
            <div className="section-header">
              <h2>Todos nuestros Comandos</h2>
              <p>Explora la lista completa de comandos disponibles en Niveles</p>
            </div>

            <div className="commands-table">
              <div className="table-header">
                <div className="col col-command">Comandos</div>
                <div className="col col-description">Descripción</div>
                <div className="col col-availability">Disponibilidad</div>
              </div>

              <div className="table-category">
                <div className="category-name">📚 Comandos Básicos</div>
              </div>
              <div className="table-row">
                <div className="col col-command">/help</div>
                <div className="col col-description">Muestra esta lista de comandos.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/minivel</div>
                <div className="col col-description">Muestra tu nivel y progreso actual.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/leaderboard</div>
                <div className="col col-description">Muestra el ranking de los jugadores con más niveles.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/buscarusuario (usuario)</div>
                <div className="col col-description">Consulta el nivel y progreso de otro usuario.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>

              <div className="table-category">
                <div className="category-name">⚙️ Comandos de Administración</div>
              </div>

              <div className="table-row">
                <div className="col col-command">/alerts (canal)</div>
                <div className="col col-description">Configura el canal de alertas de nivel.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>

              <div className="table-row">
                <div className="col col-command">/modificarnivel (usuario)</div>
                <div className="col col-description">Modifica el nivel de un usuario</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/modificarxp (usuario)(cantidad)(tipo)</div>
                <div className="col col-description">Añade o quita XP a un usuario.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/modificarmensaje (mensaje)</div>
                <div className="col col-description">Personaliza el mensaje para cuando alguien suba de nivel</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/desactivar_xp (canal)</div>
                <div className="col col-description">Desactiva la ganancia de XP en un canal.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/activar_xp (canal)</div>
                <div className="col col-description">Reactiva la ganancia de XP en un canal.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/listaroles</div>
                <div className="col col-description">Muestra los roles configurados con sus niveles.</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/listacanales (usuario)</div>
                <div className="col col-description">Muestra toda la lista de canales desactivados</div>
                <div className="col col-availability">
                  <span className="badge free">Free</span>
                  <span className="badge premium">Premium</span>
                </div>
              </div>

              <div className="table-category">
                <div className="category-name">⭐ Comandos Premium</div>
              </div>

              <div className="table-row">
                <div className="col col-command">/boostxp</div>
                <div className="col col-description">Los usuarios ganarán durante 1 hora, el doble de XP</div>
                <div className="col col-availability">
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/roles</div>
                <div className="col col-description">Asigna un rol automático al alcanzar un nivel.</div>
                <div className="col col-availability">
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/quitarroles</div>
                <div className="col col-description">Elimina la asignación de un rol para un nivel.</div>
                <div className="col col-availability">
                  <span className="badge premium">Premium</span>
                </div>
              </div>
              <div className="table-row">
                <div className="col col-command">/modificarcartacolor</div>
                <div className="col col-description">Modifica el color de tu carta de /minivel.</div>
                <div className="col col-availability">
                  <span className="badge premium">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        </AnimateOnVisible>


        <AnimateOnVisible threshold={0.25}>
        {/* Pricing Section */}
        <section id="pricing" className="pricing">
          <div className="container">
            <div className="section-header">
              <h2>Precios</h2>
              <p>Elige el plan que mejor se adapte a las necesidades de tu servidor</p>
            </div>

            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <div>
                    <h3>Gratis</h3>
                    <p className="pricing-subtitle">Default</p>
                  </div>
                  <span className="badge free">Gratis</span>
                </div>
                <p className="pricing-description">Sin el pack Premium</p>

                <ul className="feature-list">
                  <li className="feature-available">/help</li>
                  <li className="feature-available">/minivel</li>
                  <li className="feature-available">/leaderboard</li>
                  <li className="feature-available">/alertas</li>
                  <li className="feature-available">/buscarusuario</li>
                  <li className="feature-available">/desactivar_xp</li>
                  <li className="feature-available">/activar_xp</li>
                  <li className="feature-available">/listaroles</li>
                  <li className="feature-available">/listacanales</li>
                  <li className="feature-available">/modificarmensaje</li>
                  <li className="feature-available">/modificarxp</li>
                  <li className="feature-available">/modificarnivel</li>
                  {/* Premiums */}
                  <li className="feature-unavailable">/boostxp</li>
                  <li className="feature-unavailable">/roles</li>
                  <li className="feature-unavailable">/quitarroles</li>
                  <li className="feature-unavailable">/modificarcartacolor</li>
                </ul>

                <a href="https://discord.com/oauth2/authorize?client_id=1330564254822043761&permissions=8&integration_type=0&scope=bot" target="_blank" rel="noopener noreferrer" className="btn btn-outline full-width">
                  <i className="fa-brands fa-discord"></i>&#160;Añadir aplicación
                </a>
              </div>

              <div className="pricing-card premium-pricing">
                <div className="pricing-header">
                  <div>
                    <h3>Premium</h3>
                    <div className="price">
                      <span className="amount">$1.99</span>
                      <span className="period">/mes</span>
                    </div>
                  </div>
                  <span className="badge recommended">Recomendado</span>
                </div>
                <p className="pricing-description">Con el pack Premium</p>
                <ul className="feature-list">
                  <li className="feature-available">/help</li>
                  <li className="feature-available">/minivel</li>
                  <li className="feature-available">/leaderboard</li>
                  <li className="feature-available">/alertas</li>
                  <li className="feature-available">/buscarusuario</li>
                  <li className="feature-available">/desactivar_xp</li>
                  <li className="feature-available">/activar_xp</li>
                  <li className="feature-available">/listaroles</li>
                  <li className="feature-available">/listacanales</li>
                  <li className="feature-available">/modificarmensaje</li>
                  <li className="feature-available">/modificarxp</li>
                  <li className="feature-available">/modificarnivel</li>
                  <li className="feature-available">/boostxp</li>
                  <li className="feature-available">/roles</li>
                  <li className="feature-available">/quitarroles</li>
                  <li className="feature-available">/modificarcartacolor</li>
                </ul>

                <a href="https://discord.com/discovery/applications/1330564254822043761/store/1347581050041401518" className="btn btn-primary full-width" target="_blank" rel="noopener noreferrer">
                  🚀 Mejorar a Premium
                </a>
              </div>
            </div>
          </div>
        </section>
        </AnimateOnVisible>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-about">
              <a href="/" className="footer-logo">Niveles</a>
              <p>Los miembros ganan XP al participar en el chat, suben de nivel y desbloquean recompensas. Personaliza mensajes, asigna roles automáticos y compite en la clasificación.</p>
            </div>

            <div className="footer-links">
              <div className="footer-nav">
                <h4>Navigation</h4>
                <ul>
                  <li><a href="#hero">Inicio</a></li>
                  <li><a href="#commands">Comandos</a></li>
                  <li><a href="#pricing">Precios</a></li>
                </ul>
              </div>

              <div className="footer-nav">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/privacy">Política de privacidad</Link></li>
                  <li><Link to="/terms">Condiciones de uso</Link></li>
                  <li><Link to="/404">404</Link></li>
                </ul>
              </div>

              <div className="footer-nav">
                <h4>Support</h4>
                <ul>
                  <li><a href="https://discord.gg/mu7qfudTuj" target="_blank" rel="noopener noreferrer">Discord Server</a></li>
                  <li><a href="https://top.gg/bot/1330564254822043761" target="_blank" rel="noopener noreferrer">Valoranos</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-separator"></div>

          <div className="footer-bottom">
            <p>&copy; <span id="current-year"></span> Niveles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const RoutesApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsConditionsPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/global-leaderboard" element={
        <ProtectedRoute>
          <GlobalLeaderboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/server/:serverId" element={
        <ProtectedRoute>
          <ServerConfig />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/server/:serverId/leaderboard" element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutesApp;
