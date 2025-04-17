import '../assets/css/App.css';
import { Link } from 'react-router-dom';
import MainHeader from '../components/MainHeader';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <MainHeader/> 
      <main>
        <div className="container">
        <div className="section-header2">
          <br />
          <h2>Política de privacidad</h2>
          <p>Elige el plan que mejor se adapte a las necesidades de tu servidor</p>
          <h4>1. Introducción</h4>
          <p>Esta Política de Privacidad describe cómo el bot de Discord "Niveles" (en adelante, "el Bot") recopila, utiliza y protege la información que usted proporciona al utilizar nuestros servicios. Al utilizar el Bot, usted acepta las prácticas descritas en esta política.</p>

          <h4>2. Información que Recopilamos</h4>
          <p>El Bot puede recopilar la siguiente información:</p>
          <p><strong>Información de Usuario:</strong></p>
          <p>- ID de usuario de Discord.</p>
          <p>- Nombre de usuario de Discord.</p>
          <p>- Avatar de usuario de Discord.</p>
          <p>- Nivel y experiencia (XP) dentro del servidor.</p>
          <p>- Color personalizado de la tarjeta de perfil (solo para usuarios Premium).</p>
          <p>- Fecha y hora de la última recompensa diaria reclamada.</p>
          <p>- Logros obtenidos (niveles especiales alcanzados).</p>
          
          <p><strong>Información del Servidor:</strong></p>
          <p>- ID del servidor de Discord.</p>
          <p>- Configuraciones del servidor, como canales de alertas, roles automáticos y canales desactivados para XP.</p>
          <p>- Estado de las misiones diarias y canal configurado.</p>
          <p>- Mensajes personalizados para subidas de nivel.</p>
          <p>- Estado del boost de XP (activo/inactivo).</p>
          
          <p><strong>Interacciones:</strong></p>
          <p>- Comandos utilizados.</p>
          <p>- Mensajes enviados en canales donde el Bot está activo (solo para calcular XP).</p>
          <p>- Participación en misiones diarias.</p>
          <p>- Tiempo en canales de voz (para XP por voz).</p>

          <h4>3. Uso de la Información</h4>
          <p>La información recopilada se utiliza para los siguientes propósitos:</p>
          <p><strong>Funcionalidad del Bot:</strong></p>
          <p>- Calcular y almacenar niveles y experiencia (XP) de los usuarios.</p>
          <p>- Otorgar roles automáticos basados en niveles.</p>
          <p>- Enviar alertas cuando un usuario suba de nivel.</p>
          <p>- Gestionar canales desactivados para XP.</p>
          <p>- Proporcionar recompensas diarias de XP.</p>
          <p>- Gestionar misiones diarias con recompensas.</p>
          <p>- Otorgar XP por tiempo en canales de voz.</p>
          <p>- Aplicar boosts temporales de XP.</p>
          <p>- Personalizar la apariencia de las tarjetas de perfil (solo Premium).</p>
          
          <p><strong>Mejora del Servicio:</strong></p>
          <p>- Analizar el uso del Bot para mejorar su funcionalidad y rendimiento.</p>
          
          <p><strong>Cumplimiento Legal:</strong></p>
          <p>- Cumplir con las leyes y regulaciones aplicables.</p>

          <h4>4. Almacenamiento de la Información</h4>
          <p>La información recopilada se almacena en una base de datos MongoDB segura. Solo el equipo de desarrollo tiene acceso a esta base de datos. La información se conserva mientras sea necesaria para proporcionar los servicios del Bot o hasta que el servidor de Discord elimine el Bot.</p>

          <h4>5. Compartir Información</h4>
          <p>No compartimos, vendemos ni alquilamos su información personal a terceros, excepto en los siguientes casos:</p>
          <p><strong>Cumplimiento Legal:</strong></p>
          <p>- Si estamos obligados por ley a divulgar su información.</p>
          <p><strong>Protección de Derechos:</strong></p>
          <p>- Para proteger nuestros derechos, propiedad o seguridad, o los derechos, propiedad o seguridad de otros.</p>

          <h4>6. Seguridad de la Información</h4>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger la información recopilada contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.</p>

          <h4>7. Sus Derechos</h4>
          <p>Usted tiene los siguientes derechos respecto a su información:</p>
          <p>- <strong>Acceso:</strong> Puede solicitar una copia de la información que tenemos sobre usted.</p>
          <p>- <strong>Rectificación:</strong> Puede solicitar que corrijamos cualquier información inexacta.</p>
          <p>- <strong>Eliminación:</strong> Puede solicitar que eliminemos su información, sujeto a ciertas excepciones legales.</p>
          <p>Para ejercer estos derechos, póngase en contacto con nosotros a través de Discord.</p>

          <h4>8. Cambios en esta Política de Privacidad</h4>
          <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio será notificado a través de una actualización en nuestro servidor de Discord o mediante un mensaje directo a los administradores del servidor.</p>

          <h4>9. Contacto</h4>
          <p>Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos a través de Discord.</p>
        </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-about">
              <a href="/" className="footer-logo">Niveles</a>
              <p>Los miembros ganan XP al participar en el chat, suben de nivel y desbloquean recompensas. Personaliza mensajes, asigna roles automáticos y compite en la clasificación.</p>
            </div>

            <div className="footer-links">
              <div className="footer-nav">
                <h4>Navigation</h4>
                <ul>
                  <li><a href="/">Inicio</a></li>
                  <li><a href="/#commands">Comandos</a></li>
                  <li><a href="/#pricing">Precios</a></li>
                </ul>
              </div>

              <div className="footer-nav">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/privacy">Política de privacidad</Link></li>
                  <li><Link to="/terms">Condiciones de uso</Link></li>
                  <li><Link to="/404">404</Link></li>
                </ul>
              </div>

              <div className="footer-nav">
                <h4>Support</h4>
                <ul>
                  <li>
                    <a href="https://discord.gg/mu7qfudTuj" target="_blank" rel="noopener noreferrer">
                      Discord Server
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-separator"></div>

          <div className="footer-bottom">
            <p>&copy; <span id="current-year">{new Date().getFullYear()}</span> Niveles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;