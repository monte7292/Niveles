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

// Función para verificar si una imagen existe
const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok; // Devuelve true si la imagen existe
  } catch (err) {
    return false; // Devuelve false si hay un error
  }
};

const GlobalLeaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // URL de imagen por defecto
  const defaultAvatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';

  // Función para manejar el error de carga de la imagen
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    img.src = defaultAvatarUrl; // Cambia la URL de la imagen a la imagen por defecto
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/global-leaderboard`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error al obtener los datos del leaderboard global');
        }
        const data = await response.json();

        // Verificar y corregir las URLs de los avatares
        const playersWithValidAvatars = await Promise.all(
          data.map(async (player: Player) => {
            const avatarExists = await checkImageExists(player.avatarUrl);
            return {
              ...player,
              avatarUrl: avatarExists ? player.avatarUrl : defaultAvatarUrl, // Usa la imagen por defecto si no existe
            };
          })
        );

        const sortedPlayers = playersWithValidAvatars.sort((a: Player, b: Player) => b.level - a.level);
        setPlayers(sortedPlayers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
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

  // Función para obtener el color del puesto
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return '#FFD700'; // Oro
      case 2: return '#C0C0C0'; // Plata
      case 3: return '#CD7F32'; // Bronce
      default: return 'var(--text)';
    }
  };

  return (
    <div className="dashboard" style={{ 
      background: `radial-gradient(circle at 50% 50%, rgba(67, 164, 229, 0.15), transparent 60%)`,
      minHeight: '100vh' 
    }}>
      <MainHeader />
      <main className="dashboard-content" style={{ padding: '2rem 0' }}>
        <div className="container">
          {/* Botón "Volver al Dashboard" */}
          <button onClick={() => navigate('/')} className="botonvolver">
            <i className="fa-solid fa-arrow-left"></i> Volver al Inicio
          </button>
          <div className="section-header" style={{ marginBottom: '2rem'}}>
            <h2>🏆 Leaderboard Global</h2>
            <p>Top jugadores con más niveles en todos los servidores</p>
          </div>

          {/* Leaderboard completo */}
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
                    border: '1px solid rgba(67, 164, 229, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="entry-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="rank" style={{ 
                      color: getRankColor(index + 1),
                      fontFamily: 'monospace',
                      width: '2rem',
                      textAlign: 'right',
                      fontSize: '1rem',
                      fontWeight: index < 3 ? 'bold' : 'normal'
                    }}>
                      {index + 1}.
                    </span>
                    <img
                      src={player.avatarUrl}
                      alt={`Avatar de ${player.username}`}
                      onError={handleImageError}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid ${player.cardColor}`
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="username" style={{ 
                        fontWeight: '500',
                        fontSize: '1rem',
                        color: getRankColor(index + 1)
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
                      {player.xp} XP
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
        </div>
      </main>
    </div>
  );
};

export default GlobalLeaderboard;