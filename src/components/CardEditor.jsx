import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardEditor = ({ user, onClose }) => {
  const [cardColor, setCardColor] = useState(user.cardColor || '#0099ff');
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [customBackground, setCustomBackground] = useState(null);
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fondos predefinidos (puedes cambiarlos por los tuyos)
  const defaultBackgrounds = [
    { id: 1, url: 'https://example.com/bg1.jpg', locked: false },
    { id: 2, url: 'https://example.com/bg2.jpg', locked: true },
    { id: 3, url: 'https://example.com/bg3.jpg', locked: true },
  ];

  useEffect(() => {
    // Simular carga de fondos desbloqueados
    const unlocked = defaultBackgrounds.filter(bg => !bg.locked);
    setUnlockedBackgrounds(unlocked);
  }, []);

  const handleColorChange = (e) => {
    setCardColor(e.target.value);
  };

  const handleOpacityChange = (e) => {
    setOverlayOpacity(e.target.value);
  };

  const handleBackgroundSelect = (bg) => {
    setSelectedBackground(bg);
    setCustomBackground(null);
  };

  const handleCustomBackground = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBackground(event.target.result);
        setSelectedBackground(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/user/update-card', {
        cardColor,
        overlayOpacity,
        backgroundUrl: customBackground || (selectedBackground ? selectedBackground.url : null)
      });
      onClose(true); // Cerrar y notificar que se guardó
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card-editor-modal">
      <div className="card-editor-content">
        <div className="card-editor-header">
          <h2>Editar tarjeta de rango</h2>
          <button onClick={() => onClose(false)} className="close-button">
            &times;
          </button>
        </div>

        <div className="card-editor-body">
          <div className="card-preview">
            <div 
              className="preview-background"
              style={{ 
                backgroundImage: customBackground ? `url(${customBackground})` : 
                                selectedBackground ? `url(${selectedBackground.url})` : 'none'
              }}
            >
              <div 
                className="preview-overlay"
                style={{ 
                  backgroundColor: cardColor,
                  opacity: overlayOpacity
                }}
              />
              <div className="preview-content">
                <div className="preview-rank">RANGO #44 NIVEL 12</div>
                <div className="preview-username">{user.username}</div>
                <div className="preview-xp">429 / 1337 XP</div>
              </div>
            </div>
          </div>

          <div className="card-editor-options">
            <div className="editor-section">
              <h3>Personalizar</h3>
              <div className="form-group">
                <label>Visibilidad</label>
                <select>
                  <option>Público</option>
                  <option>Privado</option>
                </select>
              </div>
            </div>

            <div className="editor-section">
              <h3>Fondos</h3>
              <div className="background-options">
                {unlockedBackgrounds.map(bg => (
                  <div 
                    key={bg.id}
                    className={`background-thumbnail ${selectedBackground?.id === bg.id ? 'selected' : ''}`}
                    onClick={() => handleBackgroundSelect(bg)}
                    style={{ backgroundImage: `url(${bg.url})` }}
                  />
                ))}
              </div>
              <div className="background-actions">
                <label className="custom-background-btn">
                  <input type="file" accept="image/*" onChange={handleCustomBackground} />
                  Subir fondo personalizado
                </label>
              </div>
            </div>

            <div className="editor-section">
              <h3>Colores</h3>
              <div className="form-group">
                <label>Color de la tarjeta</label>
                <input 
                  type="color" 
                  value={cardColor}
                  onChange={handleColorChange}
                />
                <span>{cardColor}</span>
              </div>
              <div className="form-group">
                <label>Opacidad superpuesta</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={overlayOpacity}
                  onChange={handleOpacityChange}
                />
                <span>{Math.round(overlayOpacity * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-editor-footer">
          <button onClick={() => onClose(false)} className="cancel-btn">
            Cancelar
          </button>
          <button onClick={handleSave} className="save-btn" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;