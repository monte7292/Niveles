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
        background: '#1E1F22',
        minHeight: '100vh',
        color: 'white'
      }}>
        <MainHeader />
        <main className="dashboard-content" style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="section-header">
              <h2>🏆 UniversoCraft Leaderboard</h2>
              <p>Cargando datos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ 
      background: '#1E1F22',
      minHeight: '100vh',
      color: 'white'
    }}>
      <MainHeader />
      <main className="dashboard-content" style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{
              background: 'none',
              border: '1px solid #7289DA',
              color: '#7289DA',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Volver
          </button>
          
          <div className="section-header" style={{ 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: '#7289DA'
            }}>
              🏆 UniversoCraft Leaderboard
            </h1>
            <p style={{ 
              color: '#B9BBBE',
              marginBottom: '2rem'
            }}>
              Los mejores jugadores del servidor
            </p>
          </div>

          {/* Top 3 players with cards */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {/* 2nd place */}
            {players.length > 1 && (
              <div style={{
                background: '#2F3136',
                borderRadius: '10px',
                padding: '1.5rem',
                width: '180px',
                textAlign: 'center',
                borderTop: '4px solid #C0C0C0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#C0C0C0',
                  marginBottom: '0.5rem'
                }}>#2</div>
                <img
                  src={players[1].avatarUrl}
                  alt={players[1].username}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${players[1].cardColor}`,
                    marginBottom: '1rem'
                  }}
                />
                <h3 style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: 'white'
                }}>{players[1].username}</h3>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#B9BBBE',
                  marginBottom: '0.5rem'
                }}>{players[1].xp.toLocaleString()} XP</div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#7289DA'
                }}>Nivel {players[1].level}</div>
              </div>
            )}

            {/* 1st place */}
            {players.length > 0 && (
              <div style={{
                background: '#2F3136',
                borderRadius: '10px',
                padding: '2rem',
                width: '200px',
                textAlign: 'center',
                borderTop: '4px solid #FFD700',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-10px)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  marginBottom: '0.5rem'
                }}>#1</div>
                <img
                  src={players[0].avatarUrl}
                  alt={players[0].username}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${players[0].cardColor}`,
                    marginBottom: '1rem'
                  }}
                />
                <h3 style={{
                  fontSize: '1.3rem',
                  marginBottom: '0.5rem',
                  color: 'white'
                }}>{players[0].username}</h3>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#B9BBBE',
                  marginBottom: '0.5rem'
                }}>{players[0].xp.toLocaleString()} XP</div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#7289DA'
                }}>Nivel {players[0].level}</div>
              </div>
            )}

            {/* 3rd place */}
            {players.length > 2 && (
              <div style={{
                background: '#2F3136',
                borderRadius: '10px',
                padding: '1.5rem',
                width: '180px',
                textAlign: 'center',
                borderTop: '4px solid #CD7F32',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#CD7F32',
                  marginBottom: '0.5rem'
                }}>#3</div>
                <img
                  src={players[2].avatarUrl}
                  alt={players[2].username}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${players[2].cardColor}`,
                    marginBottom: '1rem'
                  }}
                />
                <h3 style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: 'white'
                }}>{players[2].username}</h3>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#B9BBBE',
                  marginBottom: '0.5rem'
                }}>{players[2].xp.toLocaleString()} XP</div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#7289DA'
                }}>Nivel {players[2].level}</div>
              </div>
            )}
          </div>

          {/* Rest of the leaderboard */}
          <div style={{
            background: '#2F3136',
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#B9BBBE',
              borderBottom: '1px solid #40444B',
              paddingBottom: '0.5rem'
            }}>Top Jugadores</h3>
            
            {players.slice(3).map((player, index) => (
              <div key={player.discordId} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #40444B'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    color: '#B9BBBE',
                    width: '30px',
                    textAlign: 'center',
                    fontSize: '1rem'
                  }}>#{index + 4}</span>
                  <img
                    src={player.avatarUrl}
                    alt={player.username}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${player.cardColor}`
                    }}
                  />
                  <span style={{
                    fontWeight: '500',
                    color: 'white'
                  }}>{player.username}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
                }}>
                  <span style={{ color: '#B9BBBE', fontSize: '0.9rem' }}>
                    {player.xp.toLocaleString()} XP
                  </span>
                  <span style={{
                    background: '#7289DA',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                  }}>
                    Nivel {player.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tarjeta personal (como en la imagen) */}
          <div style={{
            background: '#2F3136',
            borderRadius: '10px',
            padding: '1.5rem',
            marginTop: '2rem',
            border: '1px solid #40444B',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#B9BBBE'
            }}>Tarjeta personal de frank</h3>
            
            <div style={{
              background: '#36393F',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
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