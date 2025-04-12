import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import config from '../config/config';

interface Player {
  discordId: string;
  username: string;
  xp: number;
  level: number;
  avatarUrl: string;
  cardColor: string;
}

const GlobalLeaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Datos de ejemplo basados en tu imagen
  const mockPlayers: Player[] = [
    {
      discordId: '1',
      username: 'kathh',
      xp: 2200000,
      level: 105,
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
      cardColor: '#FFD700'
    },
    {
      discordId: '2',
      username: 'pabloxizi9',
      xp: 2100000,
      level: 103,
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
      cardColor: '#C0C0C0'
    },
    {
      discordId: '3',
      username: 'onlyfemando',
      xp: 1900000,
      level: 100,
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/2.png',
      cardColor: '#CD7F32'
    },
    {
      discordId: '4',
      username: '07_k',
      xp: 1700000,
      level: 95,
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/3.png',
      cardColor: '#7289DA'
    },
    {
      discordId: '5',
      username: 'zpacham_',
      xp: 1500000,
      level: 91,
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/4.png',
      cardColor: '#7289DA'
    },
  ];

  useEffect(() => {
    // En una implementación real, harías fetch a tu API aquí
    // Para este ejemplo, usamos los datos mock
    setTimeout(() => {
      setPlayers(mockPlayers);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="dashboard" style={{ 
        background: `radial-gradient(circle at 50% 50%, rgba(67, 164, 229, 0.15), transparent 60%)`,
        minHeight: '100vh' 
      }}>
        <MainHeader />
        <main className="dashboard-content" style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="section-header">
              <h2>🏆 Leaderboard Global</h2>
              <p>Cargando datos...</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard" style={{ 
        background: `radial-gradient(circle at 50% 50%, rgba(67, 164, 229, 0.15), transparent 60%)`,
        minHeight: '100vh' 
      }}>
        <MainHeader />
        <main className="dashboard-content" style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="section-header">
              <h2>🏆 Leaderboard Global</h2>
              <p>Error al cargar los datos</p>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#ff4444',
              background: 'rgba(255, 68, 68, 0.1)',
              borderRadius: '8px',
              margin: '1rem 0'
            }}>
              {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ 
      background: `radial-gradient(circle at 50% 50%, rgba(67, 164, 229, 0.15), transparent 60%)`,
      minHeight: '100vh' 
    }}>
      <MainHeader />
      <main className="dashboard-content" style={{ padding: '2rem 0' }}>
        <div className="container">
          <button onClick={() => navigate('/')} className="botonvolver">
            <i className="fa-solid fa-arrow-left"></i> Volver al Inicio
          </button>
          <div className="section-header" style={{ marginBottom: '2rem'}}>
            <h2>🏆 Leaderboard Global</h2>
            <p>Top jugadores con más niveles en todos los servidores</p>
          </div>

          {/* Leaderboard para todos los puestos (incluyendo los 3 primeros) */}
          <div className="leaderboard-container" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(67, 164, 229, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            width: '100%',
          }}>
            <div className="leaderboard-entries" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {players.map((player, index) => (
                <div 
                  key={player.discordId} 
                  className="leaderboard-entry"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'rgba(67, 164, 229, 0.05)',
                    borderRadius: '12px',
                    border: `1px solid ${
                      index === 0 ? 'rgba(255, 215, 0, 0.3)' : 
                      index === 1 ? 'rgba(192, 192, 192, 0.3)' : 
                      index === 2 ? 'rgba(205, 127, 50, 0.3)' : 
                      'rgba(67, 164, 229, 0.1)'
                    }`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="entry-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="rank" style={{ 
                      color: 'var(--muted-foreground)',
                      fontFamily: 'monospace',
                      width: '2rem',
                      textAlign: 'right',
                      fontSize: '1rem',
                      fontWeight: 'normal',
                    }}>
                      {index + 1}.
                    </span>
                    <img
                      src={player.avatarUrl}
                      alt={`Avatar de ${player.username}`}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid ${
                          index === 0 ? '#FFD700' : 
                          index === 1 ? '#C0C0C0' : 
                          index === 2 ? '#CD7F32' : 
                          player.cardColor
                        }`
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="username" style={{ 
                        fontWeight: '500',
                        fontSize: '1rem',
                        color: 
                          index === 0 ? '#FFD700' : 
                          index === 1 ? '#C0C0C0' : 
                          index === 2 ? '#CD7F32' : 
                          'white'
                      }}>
                        {player.username}
                      </span>
                      {player.username === 'monte7292' && (
                        <span style={{ 
                          fontSize: '0.8rem',
                          backgroundColor: 'crimson',
                          color: 'white',
                          padding: '1px',
                          borderRadius: '10px',
                          textAlign: 'center',
                        }}>
                          Fundador
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="level-info" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="xp" style={{ 
                      color: 'var(--muted-foreground)',
                      fontSize: '0.9rem'
                    }}>
                      {player.xp.toLocaleString()} XP
                    </div>
                    <div className="level" style={{ 
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'var(--primary)',
                      background: 'rgba(67, 164, 229, 0.1)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      border: '1px solid rgba(67, 164, 229, 0.2)'
                    }}>
                      Nivel {player.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta personal de frank (manteniendo el estilo original) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginTop: '2rem',
            border: '1px solid rgba(67, 164, 229, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{ 
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: 'white'
            }}>Tarjeta personal de frank</h3>
            
            <div style={{
              background: 'rgba(67, 164, 229, 0.05)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid rgba(67, 164, 229, 0.1)'
            }}>
              <div style={{
                fontWeight: 'bold',
                color: '#7289DA',
                marginBottom: '0.5rem'
              }}>BUSCO #444 INGLÉS</div>
              <div style={{ color: '#B9BBBE' }}>monte/282</div>
              <div style={{ color: '#B9BBBE' }}>480 | 500 V</div>
            </div>
            
            <div style={{
              color: '#B9BBBE',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>Utilizar la tarjeta de rango del servidor</div>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input type="checkbox" style={{
                width: '1.2rem',
                height: '1.2rem',
                accentColor: '#7289DA'
              }} />
              <span>Edita tu tarjeta personal de frank</span>
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GlobalLeaderboard;