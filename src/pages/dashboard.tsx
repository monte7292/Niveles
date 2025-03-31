import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import config from '../config/config';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  botPresent: boolean;
  settings: any | null;
}

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Función para truncar nombres largos
  const truncateName = (name: string, maxLength: number = 15) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  useEffect(() => {
    const fetchGuilds = async (retryCount = 0): Promise<void> => {
      try {
        const response = await fetch(`${config.apiUrl}/api/user/guilds`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 401 || errorData.code === 'TOKEN_EXPIRED') {
            await logout();
            navigate('/?error=session_expired');
            return;
          }

          if (errorData.retry_after && retryCount < 3) {
            const retryAfter = errorData.retry_after * 1000;
            await new Promise(resolve => setTimeout(resolve, retryAfter + 100));
            return fetchGuilds(retryCount + 1);
          }
          
          throw new Error(errorData.error || 'Error al obtener los servidores');
        }

        const data = await response.json();
        setGuilds(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar los servidores. Por favor, intenta de nuevo en unos momentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, [logout, navigate]);

  const handleServerClick = (guildId: string, botPresent: boolean) => {
    if (botPresent) {
      navigate(`/dashboard/server/${guildId}`);
    } else {
      window.open(`https://discord.com/oauth2/authorize?client_id=1330564254822043761&permissions=8&integration_type=0&scope=bot&guild_id=${guildId}`, '_blank');
    }
  };

  if (loading) {
    return <div className="loading">Cargando servidores...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard" style={{ 
      background: `radial-gradient(circle at 50% 50%, rgba(67, 164, 229, 0.15), transparent 60%)`,
      minHeight: '100vh' 
    }}>
      <MainHeader/>
      <main className="dashboard-content" style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="dashboard-grid">
            <div className="servers-grid">
              {guilds.map((guild) => (
                <div 
                  key={guild.id} 
                  className={`server-card ${guild.icon ? 'has-icon' : ''}`}
                  style={guild.icon ? {
                    '--server-icon': `url(${guild.icon})`
                  } as React.CSSProperties : {}}
                >
                  <div className="server-card-content">
                    {guild.icon ? (
                      <img
                        src={guild.icon}
                        alt={`${guild.name} icon`}
                        className="server-logo"
                      />
                    ) : (
                      <div className="server-logo" style={{
                        background: 'linear-gradient(135deg, #5865f2 0%, #4752c4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '2rem'
                      }}>
                        {guild.name.charAt(0)}
                      </div>
                    )}
                    <div className="server-info-wrapper">
                      <div className="server-info">
                        <h3>{truncateName(guild.name)}</h3>
                        <span className="server-role">Configurar</span>
                      </div>
                      <button onClick={() => handleServerClick(guild.id, guild.botPresent)} className={`btn btn-secondary ${guild.botPresent ? 'configure' : 'add-bot'}`}>
                        {guild.botPresent ? 'Configurar' : 'Añadir'}
                      </button>
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

export default Dashboard;