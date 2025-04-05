import React from 'react';
import './CardColorModal.css'; // Asegúrate de crear este archivo CSS

const CardColorModal = () => {
  return (
    <div className="card-color-modal">
      <div className="modal-header">
        <h3>Editar tarjeta de rango</h3>
      </div>
      
      <div className="modal-content">
        <div className="rank-info">
          <div className="rank-level">
            <span className="rank-number">RANGO #44</span>
            <span className="level-number">NIVEL 12</span>
          </div>
          <div className="user-info">
            <span className="username">monte7292</span>
            <span className="xp">429 / 1337 XP</span>
          </div>
        </div>
        
        <div className="color-options">
          <h4>Colores</h4>
          <div className="color-palette">
            {/* Ejemplo de colores - puedes añadir más */}
            <div className="color-option" style={{ backgroundColor: '#5865F2' }}></div>
            <div className="color-option" style={{ backgroundColor: '#57F287' }}></div>
            <div className="color-option" style={{ backgroundColor: '#FEE75C' }}></div>
            <div className="color-option" style={{ backgroundColor: '#EB459E' }}></div>
            <div className="color-option" style={{ backgroundColor: '#ED4245' }}></div>
            <div className="color-option" style={{ backgroundColor: '#FFFFFF' }}></div>
            <div className="color-option" style={{ backgroundColor: '#000000' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardColorModal;