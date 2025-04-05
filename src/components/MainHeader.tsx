import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import discord from '../config/discord';
import logo from '../assets/img/logo.webp';
import '../assets/css/Actualizaciones.css'

interface MainHeaderProps {
  showBackButton?: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ showBackButton = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogin = () => {
    window.location.href = discord.oauthUrl;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const navigateToLeaderboard = () => {
    navigate('/global-leaderboard');
  };

  const navigateToHero = () => {
    navigate('/#hero');
  };
  const navigateToPrecios = () => {
    navigate('/#pricing');
  };
  const navigateToComandos = () => {
    navigate('/#commands');
  };

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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
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
                <li><a onClick={navigateToHero}>Inicio</a></li>
                <li><a onClick={navigateToComandos}>Comandos</a></li>
                <li><a onClick={navigateToPrecios}>Precios</a></li>
                <li><a onClick={navigateToLeaderboard}>Tops</a></li>
              </ul>
            </nav>

            <div className="header-buttons">
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
                  Iniciar sesión
                </button>
              )}

              <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            </div>
          </div>

          <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <nav>
              <ul>
                <li><a href="/#hero" className="active" onClick={closeMenu}>Inicio</a></li>
                <li><a href="/#commands" onClick={closeMenu}>Comandos</a></li>
                <li><a href="/#pricing" onClick={closeMenu}>Precios</a></li>
                <li><a href="/global-leaderboard" onClick={closeMenu}>Tops</a></li>
                <li>
                  <a href="https://discord.com/discovery/applications/1330564254822043761/store/1347581050041401518" className="btn btn-premium mobile-btn" onClick={closeMenu}>
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
                      </svg>
                    &#160;Premium
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;