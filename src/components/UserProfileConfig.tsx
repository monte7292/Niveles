import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import config from '../config/config';

interface UserProfile {
  discordId: string;
  username: string;
  avatarUrl: string;
  cardColor: string;
  xp: number;
  level: number;
}

const UserProfileConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [localCardColor, setLocalCardColor] = useState('#0099ff');
  const [isUpdating, setIsUpdating] = useState(false);

  // Función para mostrar notificaciones temporales
  const showTemporaryNotification = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${config.apiUrl}/api/user/profile`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al cargar el perfil del usuario');
        }

        const profileData = await response.json();
        
        if (profileData) {
          setProfile(profileData);
          setLocalCardColor(profileData.cardColor || '#0099ff');
        } else {
          throw new Error('Datos de perfil inválidos');
        }

      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCardColor(e.target.value);
  };

  const updateCardColor = async () => {
    if (!localCardColor || isUpdating) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`${config.apiUrl}/api/user/update-card-color`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ cardColor: localCardColor }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el color de la tarjeta');
      }

      const updatedProfile = await response.json();
      setProfile(prev => prev ? { ...prev, cardColor: updatedProfile.cardColor } : null);
      showTemporaryNotification('Color de tarjeta actualizado correctamente', 'success');
    } catch (err) {
      console.error('Error al actualizar color:', err);
      showTemporaryNotification(
        err instanceof Error ? err.message : 'Error al actualizar el color de la tarjeta', 
        'error'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="user-profile-config">
      <MainHeader />

      <main>
        <div className="container2" style={{ 
          marginTop: '2rem', 
          marginBottom: '2rem',
        }}>
          <button onClick={() => navigate('/dashboard')} className="botonvolver">
            <i className="fa-solid fa-arrow-left"></i> Volver al Dashboard
          </button>

          {loading ? (
            <div className="loading-spinner" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3rem'
            }}>
              <div className="spinner"></div>
              <span style={{ marginLeft: '1rem', color: 'var(--foreground)' }}>
                Cargando perfil...
              </span>
            </div>
          ) : error ? (
            <div className="notification error-message" style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              <span style={{ fontSize: '1.2rem' }}>❌</span>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {success && (
                <div className="notification success-message" style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <p style={{marginTop: '12px'}}>{success}</p>
                </div>
              )}

              <div className="profile-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(67, 164, 229, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(67, 164, 229, 0.2)'
              }}>
                {profile?.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt="Avatar del usuario" 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${localCardColor}`
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    border: `3px solid ${localCardColor}`
                  }}>
                    {profile?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 style={{ marginBottom: '0.5rem' }}>{profile?.username}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      backgroundColor: '#43a4e5',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      Nivel {profile?.level}
                    </span>
                    <span style={{ color: '#6c757d' }}>
                      {profile?.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="config-grid">
                <div className="config-card">
                  <div className="card-header">
                    <div className="card-title">🎨 Personalizar Tarjeta</div>
                  </div>
                  <div className="card-content">
                    <p>
                      Cambia el color de tu tarjeta de perfil que se muestra en el comando /minivel.
                    </p>
                    
                    <div style={{ 
                      margin: '1.5rem 0',
                      padding: '1.5rem',
                      backgroundColor: 'rgba(67, 164, 229, 0.05)',
                      borderRadius: '12px',
                      border: '1px dashed rgba(67, 164, 229, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '100%',
                        maxWidth: '300px',
                        height: '120px',
                        backgroundColor: localCardColor,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(5px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)'
                        }}></div>
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(5px)',
                          border: '2px solid rgba(255, 255, 255, 0.25)'
                        }}></div>
                        <div style={{
                          position: 'relative',
                          zIndex: 1,
                          textAlign: 'center',
                          color: 'white',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                          <div style={{ 
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem'
                          }}>
                            {profile?.username}
                          </div>
                          <div style={{ fontSize: '0.9rem' }}>
                            Nivel {profile?.level}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        width: '100%',
                        maxWidth: '300px'
                      }}>
                        <input
                          type="color"
                          value={localCardColor}
                          onChange={handleColorChange}
                          style={{
                            width: '50px',
                            height: '50px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        />
                        <input
                          type="text"
                          value={localCardColor}
                          onChange={handleColorChange}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(67, 164, 229, 0.2)',
                            background: 'rgba(67, 164, 229, 0.05)',
                            color: 'var(--foreground)',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={updateCardColor}
                      disabled={isUpdating || !localCardColor}
                      className="save-button"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        background: 'var(--secondary)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: '1rem'
                      }}
                    >
                      {isUpdating ? (
                        <>
                          <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                          Guardando...
                        </>
                      ) : 'Guardar Cambios'}
                    </button>
                  </div>
                </div>

                <div className="config-card">
                  <div className="card-header">
                    <div className="card-title">🌈 Colores Predefinidos</div>
                  </div>
                  <div className="card-content">
                    <p>
                      Selecciona uno de nuestros colores prediseñados para tu tarjeta.
                    </p>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      marginTop: '1rem'
                    }}>
                      {[
                        '#0099ff', '#ff3366', '#00cc99',
                        '#9966ff', '#ff9933', '#66ccff',
                        '#ff66b3', '#33cc33', '#ffcc00'
                      ].map(color => (
                        <div 
                          key={color}
                          onClick={() => setLocalCardColor(color)}
                          style={{
                            backgroundColor: color,
                            height: '50px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: localCardColor === color ? '3px solid white' : 'none',
                            boxShadow: localCardColor === color ? '0 0 0 2px var(--primary)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfileConfig;