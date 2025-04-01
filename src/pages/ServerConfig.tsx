import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
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

interface VoiceXPResponse extends ServerSettings {
  levelRoles: { [key: number]: string }; // Asegurar que levelRoles es un objeto
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


  
useEffect(() => {
  console.log(roles); // Uso temporal para evitar el warning
}, [roles]);

  const [newLevelRole, setNewLevelRole] = useState({ level: '', roleId: '' });

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
          })
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
    if (!settings || !serverId) {
      console.error('Settings o serverId no están definidos');
      return;
    }
    
    const newValue = !settings.voiceXpEnabled;
    console.log(`Intentando cambiar voiceXP a: ${newValue}`);
    setIsUpdatingVoiceXP(true);
    
    try {
      // Configuración del controlador de timeout
      const controller = new AbortController();
      const timeoutDuration = 10000; // 10 segundos
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
  
      // Realizar la petición
      const response = await fetch(`${config.apiUrl}/api/server/${serverId}/settings/voice-xp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ enabled: newValue }),
        signal: controller.signal
      });
  
      // Limpiar el timeout si la petición se completa
      clearTimeout(timeoutId);
  
      // Manejar errores HTTP (4xx, 5xx)
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Error al parsear respuesta de error:', parseError);
          errorData = { message: `Error HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.message || `Error en la petición: ${response.status}`);
      }
  
      // Procesar respuesta exitosa
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error al parsear respuesta exitosa:', parseError);
        throw new Error('La respuesta del servidor no es válida');
      }
  
      // Validar estructura de la respuesta
      if (typeof data.voiceXpEnabled === 'undefined') {
        console.warn('Respuesta inesperada del servidor:', data);
        throw new Error('La respuesta del servidor no incluye el estado de voiceXP');
      }
  
      // Actualizar el estado de la aplicación
      setSettings(prev => ({
        ...prev!,
        voiceXpEnabled: Boolean(data.voiceXpEnabled)
      }));
      
      // Mostrar notificación de éxito
      showTemporaryNotification(
        `XP en llamadas ${data.voiceXpEnabled ? 'activado' : 'desactivado'} correctamente`,
        'success'
      );
  
    } catch (error) {
      // Manejo detallado de errores
      const err = error as Error;
      console.error('Error completo en toggleVoiceXP:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
      
      // Determinar el mensaje de error apropiado
      let errorMessage = 'Error al conectar con el servidor';
      
      if (err.name === 'AbortError') {
        errorMessage = 'La solicitud tardó demasiado. Por favor, inténtalo de nuevo.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'No se pudo establecer conexión con el servidor. Verifica tu conexión a internet.';
      } else if (err.message.includes('NetworkError')) {
        errorMessage = 'Problema de red. Por favor, verifica tu conexión.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      // Mostrar notificación de error
      showTemporaryNotification(errorMessage, 'error');
      
      // Revertir el cambio visual manteniendo el estado anterior
      setSettings(prev => {
        if (prev) {
          return { ...prev };
        }
        return prev;
      });
    } finally {
      // Asegurarse de desactivar el estado de carga
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
                      <p className="btn btn-premium" style={
                        {
                          transition: 'all 0.3s ease',
                          padding: '0.3rem 1rem'
                        }
                      }>
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
                        &#160;Premium Activado
                      </p>
                    ) : (
                      <p style={
                        {
                          transition: 'all 0.3s ease',
                          color: 'red',
                        }
                      }>
                        Premium No Adquirido
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="config-grid">

                <div className={`config-card ${!isPremiumActive ? 'premium-locked' : ''}`}>
                  <div className="card-header">
                    <div className="card-title">🎭 Roles por Nivel</div>
                    {!isPremiumActive && (
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
                      &#160;Premium
                    </a>
                    )}
                  </div>
                  <div className="card-content">
                    <p>
                      Asigna roles automáticamente cuando los usuarios alcancen ciertos niveles.
                      {!isPremiumActive && (
                        <span className="premium-text">
                          Esta función solo está disponible para servidores Premium.
                        </span>
                      )}
                    </p>
                    <div className="level-role-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem',
                            color: isPremiumActive ? 'var(--foreground)' : 'rgba(255, 255, 255, 0.5)',
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
                            disabled={!isPremiumActive}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              borderRadius: '12px',
                              border: '1px solid rgba(67, 164, 229, 0.2)',
                              background: 'rgba(67, 164, 229, 0.05)',
                              color: isPremiumActive ? 'var(--foreground)' : 'rgba(255, 255, 255, 0.5)',
                              fontSize: '0.95rem',
                              transition: 'all 0.3s ease',
                              opacity: isPremiumActive ? 1 : 0.5,
                              cursor: isPremiumActive ? 'text' : 'not-allowed'
                            }}
                          />
                        </div>
                        <div style={{ flex: 2 }}>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem',
                            color: isPremiumActive ? 'var(--foreground)' : 'rgba(255, 255, 255, 0.5)',
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
                            disabled={!isPremiumActive}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              borderRadius: '12px',
                              border: '1px solid rgba(67, 164, 229, 0.2)',
                              background: 'rgba(67, 164, 229, 0.05)',
                              color: isPremiumActive ? 'var(--foreground)' : 'rgba(255, 255, 255, 0.5)',
                              fontSize: '0.95rem',
                              transition: 'all 0.3s ease',
                              opacity: isPremiumActive ? 1 : 0.5,
                              cursor: isPremiumActive ? 'text' : 'not-allowed'
                            }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleAddLevelRole}
                        disabled={!isPremiumActive || !newLevelRole.level || !newLevelRole.roleId}
                        className="save-button"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '12px',
                          background: isPremiumActive ? 'var(--secondary))' : '#574b3a',
                          border: 'none',
                          color: isPremiumActive ? 'white' : 'rgba(232, 183, 79, 0.5)',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          cursor: isPremiumActive ? 'pointer' : 'not-allowed',
                          opacity: isPremiumActive ? 1 : 0.5
                        }}
                      >
                        Agregar Rol
                      </button>

                      <div className="channel-list" style={{ 
                        maxHeight: '300px', 
                        overflowY: 'auto',
                        marginTop: '1rem',
                        opacity: isPremiumActive ? 1 : 0.5,
                        pointerEvents: isPremiumActive ? 'auto' : 'none'
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
                              disabled={!isPremiumActive}
                              className="delete"
                              style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                background: isPremiumActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                                color: isPremiumActive ? '#ef4444' : 'rgba(239, 68, 68, 0.5)',
                                border: isPremiumActive ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.1)',
                                cursor: isPremiumActive ? 'pointer' : 'not-allowed',
                                opacity: isPremiumActive ? 1 : 0.5
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
                  </div>
                  <div className="card-content">
                    <p style={{ marginBottom: '1rem', color: '#a0a0a0' }}>
                      Activa esta opción para que los miembros ganen 10 XP por cada minuto en canales de voz.
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


              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServerConfig; 