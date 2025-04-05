import React, { useState } from 'react';
import axios from 'axios';

// Define la interfaz para las propiedades del componente
interface User {
  id: string;
  username: string;
  avatarUrl: string;
  tag: string;
  level: number;
  rank: string;
  xp: number;
}

interface EditCardModalProps {
  user: User;
  onClose: () => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ user, onClose }) => {
  const [progressColor, setProgressColor] = useState<string>('#0099ff');
  const [opacity, setOpacity] = useState<number>(1);

  const handleSave = async () => {
    try {
      await axios.post(`/api/user/${user.id}/customization`, {
        color: progressColor,
        opacity: opacity,
      });
      alert('Configuración guardada con éxito');
      onClose();
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✖</button>
        <div className="modal-header">
          <h2>Editar Tarjeta de Rango</h2>
        </div>
        <div className="user-card">
          <img src={user.avatarUrl} alt="Avatar" className="avatar" />
          <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="tag">#{user.tag}</span>
          </div>
        </div>
        <div className="progress-bar" style={{ backgroundColor: progressColor }}>
          <div className="progress" style={{ width: '50%' }}></div>
        </div>
        <div className="level-info">
          <span>Nivel: {user.level}</span>
          <span>Rango: {user.rank}</span>
          <span>XP: {user.xp} / 1337</span>
        </div>
        <div className="customization-options">
          <h3>Personaliza tu barra de progreso</h3>
          <div className="color-options">
            {['#0099ff', '#ff5733', '#33ff57', '#ff33a1'].map(color => (
              <div
                key={color}
                className="color-circle"
                style={{ backgroundColor: color }}
                onClick={() => setProgressColor(color)}
              />
            ))}
          </div>
        </div>
        <button className="save-button" onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
};

export default EditCardModal;