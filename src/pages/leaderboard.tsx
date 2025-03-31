import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const Leaderboard: React.FC = () => {
  const { serverId } = useParams<{ serverId: string }>();
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
        const response = await fetch(`${config.apiUrl}/api/leaderboard/${serverId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error al obtener los datos del leaderboard');
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
  }, [serverId]);

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
              <h2>🏆 Leaderboard del Servidor</h2>
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
              <h2>🏆 Leaderboard del Servidor</h2>
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
          {/* Botón "Volver al Dashboard" */}
          <button onClick={() => navigate('/dashboard')} className="botonvolver">
          <i className="fa-solid fa-arrow-left"></i> Volver al Dashboard
          </button>
          <div className="section-header" style={{ marginBottom: '2rem'}}>
            <h2>🏆 Leaderboard del Servidor</h2>
            <p>Top jugadores con más niveles en este servidor</p>
          </div>

          {/* Primeros tres puestos */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'flex-end',
            gap: '1rem',
            marginBottom: '2rem',
            width: '100%', // Ocupa el mismo ancho que el leaderboard-container
          }}>
            {/* Plata (2do puesto) */}
            {players.length > 1 && (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1rem',
                  background: `linear-gradient(to bottom, rgba(67, 164, 229, 0.20), transparent)`,
                  borderRadius: '16px',
                  textAlign: 'center',
                  width: '20%', // Ancho relativo
                  position: 'relative',
                  top: '20px', // Plata un poco más alta que el bronce
                }}
              >
                <img
                  src={players[1].avatarUrl}
                  alt={`Avatar de ${players[1].username}`}
                  onError={handleImageError} // Maneja errores de carga de imagen
                  style={{
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${players[1].cardColor}`,
                    marginBottom: '1rem',
                  }}
                />
                <span style={{ 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#C0C0C0', // Plata
                  marginBottom: '0.5rem',
                }}>
                  {players[1].username}
                </span>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: 'var(--muted-foreground)',
                }}>
                  <div>Nivel {players[1].level}</div>
                  <div>{players[1].xp} XP</div>
                </div>
              </div>
            )}

            {/* Oro (1er puesto) */}
            {players.length > 0 && (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1rem',
                  background: `linear-gradient(to bottom, rgba(67, 164, 229, 0.50), transparent)`,
                  borderRadius: '16px',
                  textAlign: 'center',
                  width: '20%', // Ancho relativo
                  position: 'relative',
                  top: '-20px', // Oro más alto que plata y bronce
                }}
              >
                <img
                  src={players[0].avatarUrl}
                  alt={`Avatar de ${players[0].username}`}
                  onError={handleImageError} // Maneja errores de carga de imagen
                  style={{
                    width: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${players[0].cardColor}`,
                    marginBottom: '1rem',
                  }}
                />
                <span style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#FFD700', // Oro
                  marginBottom: '0.5rem',
                }}>
                  {players[0].username}
                </span>
                <div style={{ 
                  fontSize: '1rem',
                  color: 'var(--muted-foreground)',
                }}>
                  <div>Nivel {players[0].level}</div>
                  <div>{players[0].xp} XP</div>
                </div>
              </div>
            )}

            {/* Bronce (3er puesto) */}
            {players.length > 2 && (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1rem',
                  background: `linear-gradient(to bottom, rgba(67, 164, 229, 0.05), transparent)`,
                  borderRadius: '16px',
                  textAlign: 'center',
                  width: '20%', // Ancho relativo
                  position: 'relative',
                  top: '20px', // Bronce más bajo que plata
                }}
              >
                <img
                  src={players[2].avatarUrl}
                  alt={`Avatar de ${players[2].username}`}
                  onError={handleImageError} // Maneja errores de carga de imagen
                  style={{
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${players[2].cardColor}`,
                    marginBottom: '1rem',
                  }}
                />
                <span style={{ 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#CD7F32', // Bronce
                  marginBottom: '0.5rem',
                }}>
                  {players[2].username}
                </span>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: 'var(--muted-foreground)',
                }}>
                  <div>Nivel {players[2].level}</div>
                  <div>{players[2].xp} XP</div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard para los demás puestos */}
          <div className="leaderboard-container" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(67, 164, 229, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            width: '100%', // Mismo ancho que los primeros tres puestos
          }}>
            <div className="leaderboard-entries" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {players.slice(3).map((player, index) => (
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
                      color: 'var(--muted-foreground)',
                      fontFamily: 'monospace',
                      width: '2rem',
                      textAlign: 'right',
                      fontSize: '1rem',
                      fontWeight: 'normal'
                    }}>
                      {index + 4}.
                    </span>
                    <img
                      src={player.avatarUrl}
                      alt={`Avatar de ${player.username}`}
                      onError={handleImageError} // Maneja errores de carga de imagen
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
                      }}>
                        {player.username}
                      </span>
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

export default Leaderboard;