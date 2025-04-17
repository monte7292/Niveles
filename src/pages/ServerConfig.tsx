import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import PremiumButton from '../components/PremiumButton';
import config from '../config/config';

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface DiscordRole {
  id: string;
  name: string;
  color?: number;
}

interface Role {
  id: string;
  name: string;
  color: number;
}

interface ServerSettings {
  guildId: string;
  alertChannelId: string | null;
  customLevelUpMessage: string;
  disabledXpChannels: string[];
  levelRoles: { [key: number]: string };
  voiceXpEnabled: boolean; // Nuevo campo
}

function Componente1() {
  return <PremiumButton />;
}

interface UserCardSettings {
  discordId: string;
  username: string;
  cardColor: string;
  avatarUrl: string;
}

interface VoiceXPResponse extends ServerSettings {
  levelRoles: { [key: number]: string }; // Asegurar que levelRoles es un objeto
}

// En tu componente ServerConfig
interface MissionSettings {
  misionesDiarias: boolean;
  misionesDiariasMensaje: string;
}

const ServerConfig: React.FC = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [settings, setSettings] = useState<ServerSettings | null>(null);
  const [localLevelMessage, setLocalLevelMessage] = useState('');
  const [serverName, setServerName] = useState('');
  const [serverIcon, setServerIcon] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPremiumActive, setIsPremiumActive] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isUpdatingVoiceXP, setIsUpdatingVoiceXP] = useState(false);
  const [userCardSettings, setUserCardSettings] = useState<UserCardSettings | null>(null);
  const [newCardColor, setNewCardColor] = useState('#0099ff');
  const [isUpdatingColor, setIsUpdatingColor] = useState(false);
  const [newLevelRole, setNewLevelRole] = useState({ level: '', roleId: '' });
  const [missionSettings, setMissionSettings] = useState<MissionSettings>({
    misionesDiarias: false,
    misionesDiariasMensaje: ''
  });
  const [isUpdatingMissions, setIsUpdatingMissions] = useState(false);

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

  const fetchUserCardSettings = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/user-card`, {
        credentials: 'include'
      });
  
      if (response.ok) {
        const data = await response.json();
        setUserCardSettings(data);
        setNewCardColor(data.cardColor || '#0099ff');
      }
    } catch (err) {
      console.error('Error al cargar configuración de carta:', err);
    }
  };

  // Función para cargar la configuración
const fetchMissionSettings = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/api/server/${serverId}/mission-settings`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      setMissionSettings({
        misionesDiarias: data.misionesDiarias || false,
        misionesDiariasMensaje: data.misionesDiariasMensaje || ''
      });
    }
  } catch (err) {
    console.error('Error al cargar configuración de misiones:', err);
  }
};

// Función para alternar el estado
const toggleMisionesDiarias = async () => {
  if (!serverId || isUpdatingMissions) return;
  
  const newValue = !missionSettings.misionesDiarias;
  setIsUpdatingMissions(true);
  
  try {
    const response = await fetch(`${config.apiUrl}/api/server/${serverId}/mission-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        misionesDiarias: newValue,
        misionesDiariasMensaje: missionSettings.misionesDiariasMensaje
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar misiones diarias');
    }

    const updatedSettings = await response.json();
    setMissionSettings(updatedSettings);
    showTemporaryNotification(
      newValue ? 'Misiones diarias activadas' : 'Misiones diarias desactivadas', 
      'success'
    );
  } catch (err) {
    showTemporaryNotification(
      err instanceof Error ? err.message : 'Error al actualizar misiones', 
      'error'
    );
  } finally {
    setIsUpdatingMissions(false);
  }
};

// Función para actualizar el canal
const handleMissionChannelChange = async (channelId: string) => {
  if (!serverId || isUpdatingMissions) return;
  
  setIsUpdatingMissions(true);
  try {
    const response = await fetch(`${config.apiUrl}/api/server/${serverId}/mission-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        misionesDiarias: missionSettings.misionesDiarias,
        misionesDiariasMensaje: channelId
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar canal de misiones');
    }

    const updatedSettings = await response.json();
    setMissionSettings(updatedSettings);
    showTemporaryNotification('Canal de misiones actualizado', 'success');
  } catch (err) {
    showTemporaryNotification(
      err instanceof Error ? err.message : 'Error al actualizar canal', 
      'error'
    );
  } finally {
    setIsUpdatingMissions(false);
  }
};


  useEffect(() => {
    const fetchData = async () => {
      if (!serverId) {
        setError('ID de servidor no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [channelsResponse, settingsResponse, premiumResponse] = await Promise.all([
          fetch(`${config.apiUrl}/api/server/${serverId}/channels`, {
            credentials: 'include'
          }),
          fetch(`${config.apiUrl}/api/server/${serverId}/settings`, {
            credentials: 'include'
          }),
          fetch(`${config.apiUrl}/api/server/${serverId}/premium-status`, {
            credentials: 'include'
          }),
          fetchUserCardSettings()
        ]);

        if (!channelsResponse.ok) {
          throw new Error('Error al cargar los canales del servidor');
        }
        if (!settingsResponse.ok) {
          throw new Error('Error al cargar la configuración del servidor');
        }
        if (!premiumResponse.ok) {
          throw new Error('Error al verificar el estado de Premium');
        }

        const channelsData = await channelsResponse.json();
        const settingsData = await settingsResponse.json();
        const premiumData = await premiumResponse.json();

        // Validar y establecer los datos de canales y roles
        if (channelsData) {
          if (Array.isArray(channelsData.channels)) {
            setChannels(channelsData.channels);
          }
          setServerName(channelsData.name || 'Servidor');
          setServerIcon(channelsData.icon);
          
          // Establecer roles desde la respuesta de canales
          if (Array.isArray(channelsData.roles)) {
            setRoles(channelsData.roles.map((role: DiscordRole) => ({
              id: role.id,
              name: role.name,
              color: role.color || 0
            })));
          }
        } else {
          throw new Error('Datos de canales inválidos');
        }

        // Validar y establecer la configuración
        if (settingsData) {
          const levelRoles = settingsData.levelRoles || {};
          setSettings({
            guildId: settingsData.guildId || serverId,
            alertChannelId: settingsData.alertChannelId || null,
            customLevelUpMessage: settingsData.customLevelUpMessage || '¡{user} ha alcanzado el nivel {level}!',
            disabledXpChannels: Array.isArray(settingsData.disabledXpChannels) ? settingsData.disabledXpChannels : [],
            levelRoles: levelRoles,
            voiceXpEnabled: settingsData.voiceXpEnabled || false // Nuevo campo
          });
          setLocalLevelMessage(settingsData.customLevelUpMessage || '¡{user} ha alcanzado el nivel {level}!');
        } else {
          throw new Error('Datos de configuración inválidos');
        }

        // Validar y establecer el estado de Premium
        if (typeof premiumData.isPremiumActive === 'boolean') {
          setIsPremiumActive(premiumData.isPremiumActive);
        } else {
          throw new Error('Datos de Premium inválidos');
        }

      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serverId]);




  const handleCardColorUpdate = async () => {
    if (!serverId || !newCardColor) return;
  
    setIsUpdatingColor(true);
    try {
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/user-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ color: newCardColor }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el color de la carta');
      }
  
      const updatedData = await response.json();
      setUserCardSettings(updatedData);
      showTemporaryNotification('Color de tu carta actualizado correctamente', 'success');
    } catch (err) {
      showTemporaryNotification(
        err instanceof Error ? err.message : 'Error al actualizar el color de la carta', 
        'error'
      );
    } finally {
      setIsUpdatingColor(false);
    }
  };



  const handleAlertChannelChange = async (channelId: string) => {
    if (!serverId || !settings) return;

    try {
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/settings/alert-channel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ channelId }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el canal de alertas');
      }

      const updatedSettings = await response.json();
      setSettings({
        guildId: updatedSettings.guildId,
        alertChannelId: updatedSettings.alertChannelId || null,
        customLevelUpMessage: updatedSettings.customLevelUpMessage || '¡{user} ha alcanzado el nivel {level}!',
        disabledXpChannels: Array.isArray(updatedSettings.disabledXpChannels) ? updatedSettings.disabledXpChannels : [],
        levelRoles: updatedSettings.levelRoles || {},
        voiceXpEnabled: updatedSettings.voiceXpEnabled || false // Nuevo campo
      });
      showTemporaryNotification('Canal de alertas actualizado correctamente', 'success');
    } catch (err) {
      showTemporaryNotification(err instanceof Error ? err.message : 'Error al actualizar el canal de alertas', 'error');
    }
  };

  const handleLevelMessageChange = async () => {
    if (!serverId || !settings) return;

    try {
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/settings/level-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: localLevelMessage }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el mensaje de nivel');
      }

      const updatedSettings = await response.json();
      setSettings({
        guildId: updatedSettings.guildId,
        alertChannelId: updatedSettings.alertChannelId || null,
        customLevelUpMessage: updatedSettings.customLevelUpMessage || '¡{user} ha alcanzado el nivel {level}!',
        disabledXpChannels: Array.isArray(updatedSettings.disabledXpChannels) ? updatedSettings.disabledXpChannels : [],
        levelRoles: updatedSettings.levelRoles || {},
        voiceXpEnabled: updatedSettings.voiceXpEnabled || false // Nuevo campo
      });
      showTemporaryNotification('Mensaje de nivel actualizado correctamente', 'success');
    } catch (err) {
      showTemporaryNotification(err instanceof Error ? err.message : 'Error al actualizar el mensaje de nivel', 'error');
    }
  };

  const toggleXpChannel = async (channelId: string, enabled: boolean) => {
    if (!serverId || isUpdating || !settings) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/settings/xp-channel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ channelId, enabled }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el canal');
      }

      const updatedSettings = await response.json();
      setSettings({
        guildId: updatedSettings.guildId,
        alertChannelId: updatedSettings.alertChannelId || null,
        customLevelUpMessage: updatedSettings.customLevelUpMessage || '¡{user} ha alcanzado el nivel {level}!',
        disabledXpChannels: Array.isArray(updatedSettings.disabledXpChannels) ? updatedSettings.disabledXpChannels : [],
        levelRoles: updatedSettings.levelRoles || {},
        voiceXpEnabled: updatedSettings.voiceXpEnabled || false // Nuevo campo
      });
      showTemporaryNotification(
        enabled 
          ? 'Canal activado para XP correctamente' 
          : 'Canal desactivado para XP correctamente', 
        'success'
      );
    } catch (err) {
      console.error('Error al actualizar canal:', err);
      showTemporaryNotification(
        err instanceof Error ? err.message : 'Error al actualizar el canal', 
        'error'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddLevelRole = async () => {
    if (!serverId || !settings || !newLevelRole.level || !newLevelRole.roleId) return;

    try {
      // Validar que el nivel sea un número positivo
      const level = parseInt(newLevelRole.level);
      if (level <= 0) {
        throw new Error('El nivel debe ser un número positivo');
      }

      // Actualizar el estado local
      const updatedLevelRoles = {
        ...settings.levelRoles,
        [level]: newLevelRole.roleId
      };

      // Actualizar en el servidor
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          alertChannelId: settings.alertChannelId,
          customLevelUpMessage: settings.customLevelUpMessage,
          disabledXpChannels: settings.disabledXpChannels,
          levelRoles: updatedLevelRoles
        })
      });

      if (!response.ok) {
        throw new Error('Error al agregar el rol de nivel');
      }

      const updatedSettings = await response.json();
      
      // Actualizar el estado local con la respuesta del servidor
      setSettings(prevSettings => ({
        ...prevSettings!,
        levelRoles: updatedSettings.levelRoles
      }));

      // Limpiar el formulario
      setNewLevelRole({ level: '', roleId: '' });
      showTemporaryNotification('Rol de nivel agregado correctamente', 'success');
    } catch (err) {
      console.error('Error al agregar rol:', err);
      showTemporaryNotification(err instanceof Error ? err.message : 'Error al agregar el rol de nivel', 'error');
    }
  };

  const handleRemoveLevelRole = async (level: number) => {
    if (!serverId || !settings) return;

    try {
      // Crear una copia del objeto levelRoles sin el nivel especificado
      const updatedLevelRoles = { ...settings.levelRoles };
      delete updatedLevelRoles[level];

      // Actualizar en el servidor
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          alertChannelId: settings.alertChannelId,
          customLevelUpMessage: settings.customLevelUpMessage,
          disabledXpChannels: settings.disabledXpChannels,
          levelRoles: updatedLevelRoles
        })
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el rol de nivel');
      }

      const updatedSettings = await response.json();
      
      // Actualizar el estado local con la respuesta del servidor
      setSettings(prevSettings => ({
        ...prevSettings!,
        levelRoles: updatedSettings.levelRoles
      }));

      showTemporaryNotification('Rol de nivel eliminado correctamente', 'success');
    } catch (err) {
      console.error('Error al eliminar rol:', err);
      showTemporaryNotification(err instanceof Error ? err.message : 'Error al eliminar el rol de nivel', 'error');
    }
  };

  const toggleVoiceXP = async () => {
    if (!settings || !serverId) return;
  
    const newValue = !settings.voiceXpEnabled;
    setIsUpdatingVoiceXP(true);
  
    try {
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/settings/voice-xp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ enabled: newValue })
      });
  
      const data = await response.json();
  
      if (!data.success || typeof data.voiceXpEnabled !== 'boolean') {
        throw new Error(data.error || 'Respuesta inválida del servidor');
      }
  
      // Actualizar solo el campo necesario
      setSettings(prev => ({
        ...prev!,
        voiceXpEnabled: data.voiceXpEnabled
      }));
  
      showTemporaryNotification(
        `XP en voz ${data.voiceXpEnabled ? 'activado' : 'desactivado'} correctamente`,
        'success'
      );
  
    } catch (error) {
      console.error('Error en toggleVoiceXP:', error);
      showTemporaryNotification(
        error instanceof Error ? error.message : 'Error al actualizar',
        'error'
      );
    } finally {
      setIsUpdatingVoiceXP(false);
    }
  };

  const navigate = useNavigate();

  // Función para navegar al leaderboard
  const navigateToLeaderboard = () => {
    if (serverId) {
      navigate(`/dashboard/server/${serverId}/leaderboard`);
    }
  };

  return (
    <div className="server-config">
      <MainHeader />

      <main>
        <div className="container2" style={{ 
          marginTop: '2rem', 
          marginBottom: '2rem',
          /* background: `radial-gradient(circle at 50% 50%, rgba(67, 164, 229, 0.15), transparent 60%)`, */
          }}>
          <button onClick={() => navigate('/dashboard')} className="botonvolver">
          <i className="fa-solid fa-arrow-left"></i> Volver al Dashboard
          </button>
          <button onClick={navigateToLeaderboard} className="botonvolver">
          <i className="fa-solid fa-award"></i> Top Niveles
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
                Cargando configuración...
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
              animation: 'slideIn 0.3s ease-out, fadeOut 0.3s ease-out 2.7s forwards'
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
                  animation: 'slideIn 0.3s ease-out, fadeOut 0.3s ease-out 2.7s forwards'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <p style={{marginTop: '12px'}}>{success}</p>
                </div>
              )}

                <div className="server-info2" style={
                  isPremiumActive ? {
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    isolation: 'isolate' // Para contener el efecto
                  } : {}
                }>
                  {isPremiumActive && (
                    <>
                      {/* Fondo del efecto */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(232, 183, 79, 0.1) 0%, rgba(232, 183, 79, 0) 50%, rgba(232, 183, 79, 0.1) 100%)',
                        zIndex: 1
                      }} />
                      
                      {/* Efecto de borde animado */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '12px',
                        padding: '2px',
                        background: 'linear-gradient(90deg, rgba(232, 183, 79, 0), var(--premium-text), rgba(232, 183, 79, 0))',
                        backgroundSize: '200% 200%',
                        animation: 'borderFlow 3s linear infinite',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        pointerEvents: 'none',
                        zIndex: 2
                      }} />
                    </>
                  )}


                {serverIcon ? (
                  <img
                    src={serverIcon}
                    alt={`${serverName} icon`}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(67, 164, 229, 0.2)'
                  }}>
                    {serverName && serverName.charAt(0)}
                  </div>
                )}
                <div>
                  <h2>{serverName}</h2>
                  <div className="subtitle">Menú de Configuración</div>
                  <div className="subtitle">
                    {isPremiumActive ? (
                      <PremiumButton/>
                    ) : (
                      <p style={
                        {
                          transition: 'all 0.3s ease',
                          color: 'red',
                        }
                      }>
                        No Premium
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="config-grid">


              <div className="config-card">
                <div className="card-header">
                  <div className="card-title">🎭 Roles por Nivel</div>
                </div>
                <div className="card-content">
                  <p>
                    Asigna roles automáticamente cuando los usuarios alcancen ciertos niveles.
                  </p>
                  <div className="level-role-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem',
                          color: 'var(--foreground)',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          Nivel
                        </label>
                        <input
                          type="number"
                          value={newLevelRole.level}
                          onChange={(e) => setNewLevelRole({ ...newLevelRole, level: e.target.value })}
                          min="1"
                          placeholder="Ej: 12"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(67, 164, 229, 0.2)',
                            background: 'rgba(67, 164, 229, 0.05)',
                            color: 'var(--foreground)',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem',
                          color: 'var(--foreground)',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          ID del Rol
                        </label>
                        <input
                          type="text"
                          value={newLevelRole.roleId}
                          onChange={(e) => setNewLevelRole({ ...newLevelRole, roleId: e.target.value })}
                          placeholder="Ej: 1350460123377569842"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(67, 164, 229, 0.2)',
                            background: 'rgba(67, 164, 229, 0.05)',
                            color: 'var(--foreground)',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddLevelRole}
                      className="save-button"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        background: 'var(--secondary)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      Agregar Rol
                    </button>

                    <div className="channel-list" style={{ 
                      maxHeight: '300px', 
                      overflowY: 'auto',
                      marginTop: '1rem'
                    }}>
                      {Object.entries(settings?.levelRoles || {}).map(([level, roleId]) => (
                        <div key={level} className="channel-item" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: 'rgba(67, 164, 229, 0.05)',
                          borderRadius: '12px',
                          marginBottom: '0.5rem'
                        }}>
                          <div className="channel-name">
                            <span style={{ fontWeight: '600' }}>Nivel {level}</span>
                            <span style={{ margin: '0 0.5rem' }}>→</span>
                            <span>ID del Rol: {roleId}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveLevelRole(parseInt(level))}
                            className="delete"
                            style={{
                              padding: '0.5rem 1rem',
                              fontSize: '0.9rem',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              cursor: 'pointer'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>




              <div className={`config-card ${!isPremiumActive ? 'premium-locked' : ''}`} style={{
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                transition: 'all 0.3s ease'
              }}>
                {/* Efecto de borde sutil */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '16px',
                  padding: '1px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none',
                  zIndex: 0
                }}></div>

                <div className="card-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      fontSize: '1.25rem'
                    }}>
                      🎨
                    </div>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      letterSpacing: '-0.01em'
                    }}>Personalizar tu Carta</h3>
                  </div>
                  {isPremiumActive && <span className="new-badge">Nuevo</span>}
                  {!isPremiumActive && (
                    <PremiumButton />
                  )}
                </div>

                <div className="card-content" style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem'
                  }}>
                    Personaliza el diseño de tu carta de perfil en este servidor con colores únicos.
                    {!isPremiumActive && (
                      <span style={{
                        display: 'block',
                        marginTop: '0.5rem',
                        color: 'var(--premium-text)',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                      }}>
                        Esta función solo está disponible para usuarios Premium.
                      </span>
                    )}
                  </p>
                  
                  {isPremiumActive ? (
                    userCardSettings ? (
                      <div>
                      <div style={{ 
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(67, 164, 229, 0.03)',
                        border: '1px solid rgba(67, 164, 229, 0.1)',
                        borderLeft: `4px solid ${userCardSettings.cardColor}`, // Color dinámico
                        marginBottom: '1rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                                {/* Encabezado con avatar y título */}
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem',
                                marginBottom: '1.25rem'
                              }}>
                                <div style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '12px',
                                  backgroundColor: userCardSettings.cardColor,
                                  boxShadow: `0 4px 15px ${userCardSettings.cardColor}40`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.5rem',
                                  color: 'white',
                                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                  backgroundImage: userCardSettings.avatarUrl ? `url(${userCardSettings.avatarUrl})` : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}>
                                  {!userCardSettings.avatarUrl && userCardSettings.username.charAt(0).toUpperCase()}
                                </div>
                                <h3 style={{ 
                                  margin: 0,
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  color: 'rgba(255, 255, 255, 0.9)'
                                }}>
                                  {userCardSettings.username}
                                </h3>
                              </div>
                            
                              {/* Barra de progreso grande y métricas */}
                              <div>
                                <div style={{ 
                                  height: '21px',
                                  borderRadius: '7px',
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  overflow: 'hidden',
                                  marginBottom: '0.5rem'
                                }}>
                                  <div style={{
                                    width: '21.96%',
                                    height: '100%',
                                    background: userCardSettings.cardColor,
                                    borderRadius: '7px',
                                    boxShadow: `0 0 10px ${userCardSettings.cardColor}80`,
                                    transition: 'all 0.3s ease'
                                  }} />
                                </div>
                                <div style={{ 
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <span style={{ 
                                    fontSize: '0.9rem',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                  }}>
                                    <strong style={{ color: userCardSettings.cardColor }}>21.96%</strong>
                                  </span>
                                  <span style={{ 
                                    fontSize: '0.9rem',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                  }}>
                                    Nivel <strong style={{ color: 'white' }}>10</strong> • XP restante: <strong style={{ color: 'white' }}>120</strong>
                                  </span>
                                </div>
                              </div>            
                        </div>
                                
                        <div style={{ 
                          padding: '1.25rem',
                          borderRadius: '12px',
                          background: 'rgba(67, 164, 229, 0.03)',
                          border: '1px solid rgba(67, 164, 229, 0.1)'
                        }}>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '1rem',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Seleccionar Nuevo Color
                          </label>
                          <div style={{ 
                            display: 'flex', 
                            gap: '1.5rem', 
                            alignItems: 'center',
                            width: '100%' // Asegura que el contenedor ocupe todo el ancho disponible
                          }}>
                            <div style={{
                              position: 'relative',
                              width: '60px', // Ancho fijo
                              height: '60px', // Alto fijo
                              minWidth: '60px', // Evita que se reduzca
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                              flexShrink: 0 // Previene que se encoja
                            }}>
                              <input
                                type="color"
                                value={newCardColor}
                                onChange={(e) => setNewCardColor(e.target.value)}
                                style={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  opacity: 0,
                                  cursor: 'pointer',
                                  padding: 0 // Elimina cualquier padding por defecto
                                }}
                              />
                              <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: newCardColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem'
                              }}>
                                <i className="fas fa-palette"></i>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={newCardColor}
                              onChange={(e) => setNewCardColor(e.target.value)}
                              placeholder="#RRGGBB"
                              style={{
                                width: '100%', // Ocupa el resto del espacio
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(67, 164, 229, 0.2)',
                                background: 'rgba(67, 164, 229, 0.05)',
                                color: 'var(--foreground)',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                                minWidth: '120px' // Ancho mínimo para el input de texto
                              }}
                            />
                          </div>
                        </div>
                        
                        <button
                          onClick={handleCardColorUpdate}
                          className="save-button"
                        >
                          {isUpdatingColor ? (
                            <>
                              <span style={{ position: 'relative', zIndex: 1 }}>Actualizando...</span>
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                                animation: 'pulse 1.5s infinite'
                              }}></div>
                            </>
                          ) : (
                            <span style={{ position: 'relative', zIndex: 1 }}>Guardar Cambios</span>
                          )}
                        </button>
                        
                        <div style={{ 
                          marginTop: '1.5rem',
                          fontSize: '0.85rem',
                          color: 'rgba(255,255,255,0.6)',
                          lineHeight: 1.5
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1rem' }}>💡</div>
                            <div>Este cambio solo afectará a tu carta en este servidor.</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1rem' }}>🎨</div>
                            <div>Usa códigos HEX (#0099ff) o nombres de colores válidos.</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        backgroundColor: 'rgba(67, 164, 229, 0.05)',
                        borderRadius: '12px',
                        marginTop: '1rem',
                        border: '1px dashed rgba(67, 164, 229, 0.2)'
                      }}>
                        <div style={{
                          display: 'inline-block',
                          width: '50px',
                          height: '50px',
                          border: '3px solid rgba(67, 164, 229, 0.2)',
                          borderTopColor: 'var(--primary)',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginBottom: '1rem'
                        }}></div>
                        <p style={{ 
                          color: 'rgba(255,255,255,0.8)',
                          marginBottom: '0.5rem',
                          fontWeight: 500
                        }}>
                          Cargando tu configuración...
                        </p>
                        <p style={{ 
                          fontSize: '0.85rem',
                          color: 'rgba(255,255,255,0.6)'
                        }}>
                          Obteniendo los datos de tu carta
                        </p>
                      </div>
                    )
                  ) : (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      background: 'linear-gradient(145deg, rgba(232,183,79,0.05) 0%, rgba(232,183,79,0.02) 100%)',
                      borderRadius: '12px',
                      marginTop: '1rem',
                      border: '1px dashed rgba(232,183,79,0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle at center, rgba(232,183,79,0.05) 0%, transparent 70%)',
                        animation: 'rotate 15s linear infinite',
                        zIndex: 0
                      }}></div>
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: 'rgba(232,183,79,0.1)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem',
                          color: 'var(--premium-text)',
                          fontSize: '1.5rem',
                          border: '1px solid rgba(232,183,79,0.2)'
                        }}>
                          <i className="fas fa-crown"></i>
                        </div>
                        <h4 style={{
                          color: 'var(--premium-text)',
                          marginBottom: '0.5rem',
                          fontSize: '1.1rem'
                        }}>
                          Función Premium
                        </h4>
                        <p style={{ 
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.9rem',
                          marginBottom: '1.5rem',
                          lineHeight: 1.5
                        }}>
                          Desbloquea esta función y muchas más con Premium
                        </p>
                        <a href="https://discord.com/discovery/applications/1330564254822043761/store/1347581050041401518" 
                          className="btn btn-premium" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(232,183,79,0.2) 0%, rgba(232,183,79,0.1) 100%)',
                            color: 'var(--premium-text)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            border: '1px solid rgba(232,183,79,0.3)',
                            boxShadow: '0 4px 15px rgba(232,183,79,0.1)'
                          }}>
                          <i className="fas fa-gem" style={{ fontSize: '0.9em' }}></i>
                          Obtener Premium
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>






                <div className="config-card">
                  <div className="card-header">
                    <div className="card-title">📢 Canal de Alertas</div>
                  </div>
                  <div className="card-content">
                    <p>
                      Selecciona el canal donde se enviarán las alertas del bot.
                    </p>
                    <select
                      value={settings?.alertChannelId || ''}
                      onChange={(e) => handleAlertChannelChange(e.target.value)}
                    >
                      <option value="">Seleccionar canal</option>
                      {channels
                        .filter(channel => channel.type === 0)
                        .map(channel => (
                          <option key={channel.id} value={channel.id}>
                            #{channel.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="card-header" style={{marginTop: '70px'}}>
                    <div className="card-title">📋 Mensaje de Nivel</div>
                  </div>
                  <div className="card-content">
                    <p>
                      Personaliza el mensaje cuando un usuario sube de nivel.
                      Usa {'{user}'} para el nombre del usuario y {'{level}'} para el nivel.
                    </p>
                    <textarea
                      value={localLevelMessage}
                      onChange={(e) => setLocalLevelMessage(e.target.value)}
                      placeholder="¡{user} ha alcanzado el nivel {level}!"
                      style={{ minHeight: '100px', resize: 'vertical' }}
                    />
                    <button
                      onClick={handleLevelMessageChange}
                      className="save-button"
                    >
                      Guardar Mensaje
                    </button>
                  </div>
                </div>


                <div className="config-card">
                <div className="card-header">
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-phone-alt" style={{ color: '#43a4e5' }}></i>
                      <span>XP en Llamadas de Voz</span>
                    </div>

                    {/* NUEVO */}
                    <span className="new-badge">Nuevo</span>
                    
                  </div>
                  <div className="card-content">
                    <p style={{ marginBottom: '1rem', color: '#a0a0a0' }}>
                      Activa esta opción para que los miembros ganen 15 XP por cada 30 minutos en canales de voz.
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(67, 164, 229, 0.1)',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(67, 164, 229, 0.2)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, color: settings?.voiceXpEnabled ? '#43a4e5' : '#6c757d' }}>
                          {settings?.voiceXpEnabled ? 'Activado' : 'Desactivado'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                          {settings?.voiceXpEnabled ? 'Los miembros ganan XP en voz' : 'XP en voz desactivado'}
                        </div>
                      </div>
                      
                      <label className="voice-xp-switch">
                        <input 
                          type="checkbox"
                          checked={settings?.voiceXpEnabled ?? false}
                          onChange={toggleVoiceXP}
                          disabled={isUpdatingVoiceXP}
                        />
                        <span className="voice-xp-slider"></span>
                        {isUpdatingVoiceXP && <span className="voice-xp-spinner"></span>}
                      </label>
                    </div>
                  </div>
                </div>



                <div className="config-card">
                  <div className="card-header">
                    <div className="card-title">🔓 Canales Activados</div>
                  </div>
                  <div className="card-content">
                    <p>
                      Actualmente estos canales están activados para recibir XP.
                    </p>
                    <div className="channel-list">
                      {channels
                        .filter(channel => {
                          const isDisabled = settings?.disabledXpChannels.includes(channel.id) || false;
                          return channel.type === 0 && !isDisabled;
                        })
                        .map(channel => (
                          <div key={channel.id} className="channel-item">
                            <div className="channel-name">{channel.name}</div>
                            <button
                              onClick={() => toggleXpChannel(channel.id, false)}
                              className="delete"
                            >
                              Desactivar XP
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="config-card">
                  <div className="card-header">
                    <div className="card-title">🔒 Canales Bloqueados</div>
                  </div>
                  <div className="card-content">
                    <p>
                      Actualmente estos canales no están activados para recibir XP.
                    </p>
                    <div className="channel-list">
                      {channels
                        .filter(channel => {
                          const isDisabled = settings?.disabledXpChannels.includes(channel.id) || false;
                          return channel.type === 0 && isDisabled;
                        })
                        .map(channel => (
                          <div key={channel.id} className="channel-item">
                            <div className="channel-name">{channel.name}</div>
                            <button
                              onClick={() => toggleXpChannel(channel.id, true)}
                            >
                              Activar XP
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>


                <div className="config-card coming-soon" style={{
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(67, 164, 229, 0.2)',
                  background: 'linear-gradient(145deg, rgba(67, 164, 229, 0.05) 0%, rgba(67, 164, 229, 0.02) 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
                }}>
                  {/* Efecto de borde sutil */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none'
                  }}></div>

                  {/* Efecto de partículas futurista */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(67, 164, 229, 0.1) 0%, transparent 30%)',
                    zIndex: 0
                  }}></div>

                  <div className="card-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(67, 164, 229, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontSize: '1.25rem',
                        border: '1px solid rgba(67, 164, 229, 0.2)'
                      }}>
                        <i className="fas fa-rocket"></i>
                      </div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                        letterSpacing: '-0.01em'
                      }}>Próximamente</h3>
                    </div>
                    <span className="new-badge">Nuevo</span>
                  </div>

                  <div className="card-content" style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '1.5rem',
                    paddingTop: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(67, 164, 229, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        color: 'var(--primary)',
                        fontSize: '2rem',
                        border: '1px solid rgba(67, 164, 229, 0.2)',
                        boxShadow: '0 0 20px rgba(67, 164, 229, 0.1)'
                      }}>
                        <i className="fas fa-clock"></i>
                      </div>
                      
                      <h4 style={{
                        color: 'var(--primary)',
                        marginBottom: '0.75rem',
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }}>¡Funciones en desarrollo!</h4>
                      
                      <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem',
                        maxWidth: '320px'
                      }}>
                        Estamos trabajando en nuevas características emocionantes para mejorar tu experiencia.
                      </p>
                    </div>
                    
                    <div style={{
                      marginTop: '2rem',
                      padding: '1rem',
                      background: 'rgba(67, 164, 229, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(67, 164, 229, 0.1)',
                      textAlign: 'center'
                    }}>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '0.5rem'
                      }}>
                        ¿Tienes ideas para nuevas funciones?
                      </p>
                      <a 
                        href="https://discord.com/invite/mu7qfudTuj" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          background: 'rgba(67, 164, 229, 0.1)',
                          color: 'var(--primary)',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          border: '1px solid rgba(67, 164, 229, 0.2)'
                        }}
                      >
                        <i className="fas fa-comment-dots" style={{ marginRight: '0.5rem' }}></i>
                        Sugiérenos en Discord
                      </a>
                    </div>
                  </div>
                </div>



                <div className="config-card">
                  <div className="card-header">
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-tasks" style={{ color: '#43a4e5' }}></i>
                      <span>Misiones Diarias</span>
                    </div>
                    <span className="new-badge">Nuevo</span>
                  </div>
                  
                  <div className="card-content">
                    <p style={{ marginBottom: '1rem', color: '#a0a0a0' }}>
                      Preguntas cada 2 horas. El primero en responder gana 10 XP (20 XP para Premium).
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(67, 164, 229, 0.1)',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(67, 164, 229, 0.2)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, color: missionSettings.misionesDiarias ? '#43a4e5' : '#6c757d' }}>
                          {missionSettings.misionesDiarias ? 'Activado' : 'Desactivado'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                          {missionSettings.misionesDiarias ? 'Preguntas activas cada 2 horas' : 'Misiones desactivadas'}
                        </div>
                      </div>
                      
                      <label className="voice-xp-switch">
                        <input 
                          type="checkbox"
                          checked={missionSettings.misionesDiarias}
                          onChange={toggleMisionesDiarias}
                          disabled={isUpdatingMissions}
                        />
                        <span className="voice-xp-slider"></span>
                        {isUpdatingMissions && <span className="voice-xp-spinner"></span>}
                      </label>
                    </div>

                    {missionSettings.misionesDiarias && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem',
                          color: 'var(--foreground)',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          Canal para enviar preguntas
                        </label>
                        <select
                          value={missionSettings.misionesDiariasMensaje}
                          onChange={(e) => handleMissionChannelChange(e.target.value)}
                          disabled={isUpdatingMissions}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(67, 164, 229, 0.2)',
                            background: 'rgba(67, 164, 229, 0.05)',
                            color: 'var(--foreground)',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <option value="">Seleccionar canal</option>
                          {channels
                            .filter(channel => channel.type === 0)
                            .map(channel => (
                              <option key={channel.id} value={channel.id}>
                                #{channel.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                    )}
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

export default ServerConfig; 