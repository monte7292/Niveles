import React from 'react';

interface CardCustomizationProps {
  isPremiumActive: boolean;
  userCardSettings?: {
    cardColor: string;
    username: string;
  };
  newCardColor: string;
  setNewCardColor: (color: string) => void;
  handleCardColorUpdate: () => void;
  isUpdatingColor: boolean;
}

const CardCustomization: React.FC<CardCustomizationProps> = ({
  isPremiumActive,
  userCardSettings,
  newCardColor,
  setNewCardColor,
  handleCardColorUpdate,
  isUpdatingColor
}) => {
  return (
    <div className="config-card" style={{
      position: 'relative',
      overflow: 'hidden',
      margin: '10px 0',
      padding: '15px',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontSize: '1rem',
            marginRight: '10px'
          }}>
            🎨
          </div>
          <h3 style={{
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--foreground)'
          }}>Personalizar Carta</h3>
        </div>
      </div>

      {isPremiumActive ? (
        userCardSettings ? (
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: userCardSettings.cardColor,
                border: '1px solid var(--background)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: 'white'
              }}>
                {userCardSettings.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  padding: '0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(67, 164, 229, 0.05)',
                  fontSize: '0.8rem',
                  color: 'var(--foreground)'
                }}>
                  {userCardSettings.cardColor}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  overflow: 'hidden'
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
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: newCardColor
                  }}></div>
                </div>
                <input
                  type="text"
                  value={newCardColor}
                  onChange={(e) => setNewCardColor(e.target.value)}
                  placeholder="#RRGGBB"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(67, 164, 229, 0.2)',
                    background: 'rgba(67, 164, 229, 0.05)',
                    color: 'var(--foreground)',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={handleCardColorUpdate}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isUpdatingColor ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '0.8rem' }}>
            Cargando configuración...
          </div>
        )
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '0.5rem'
          }}>
            Esta función requiere Premium
          </p>
          <a 
            href="https://discord.com/discovery/applications/1330564254822043761/store/1347581050041401518"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              color: 'var(--premium-text)',
              textDecoration: 'none'
            }}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.174 17.44h-1.349v.003h1.349v-.003z" fill="#FFCB39"></path>
              <path d="M11.826 18.91v-1.186H4.154a1.62 1.62 0 00-1.135.462c-.301.296-.47.697-.47 1.116v.131c0 .418.169.82.47 1.116.301.295.71.462 1.135.462h6.858l.803-1.986.01-.115z" fill="#FFE570"></path>
              <path d="M21.977 19.088a.42.42 0 000-.052c-.009-.06-.022-.12-.04-.179v-.018a1.463 1.463 0 00-.072-.19l-.016-.034a1.655 1.655 0 00-.094-.165 1.616 1.616 0 00-.283-.321 1.673 1.673 0 00-.375-.24l-.155-.06-.153-.042h-.016l-.13-.021-1.339 3.26h1.121a1.58 1.58 0 001.012-.357c.079-.065.152-.137.22-.213a1.601 1.601 0 00.352-.818V19.302a1.346 1.346 0 00-.032-.213zM16.548 17.724L15.205 21h1.857l1.343-3.276h-1.857z" fill="#FFCB39"></path>
            </svg>
            Obtener Premium
          </a>
        </div>
      )}
    </div>
  );
};

export default CardCustomization;