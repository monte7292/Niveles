import '../assets/css/App.css';
import { Link } from 'react-router-dom';
import MainHeader from '../components/MainHeader';


const TermsConditionsPage: React.FC = () => {

    return(
      <div>
      <MainHeader/>      
      <main>
        <div className="container">
          <div className="section-header2">
            <h2>Términos y Condiciones</h2>
            <p>Por favor, lea atentamente estos términos antes de usar el bot.</p>
            <h4>1. Aceptación de los Términos</h4>
            <p>Al agregar el Bot a su servidor de Discord o al interactuar con él, usted acepta automáticamente estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, debe dejar de utilizar el Bot de inmediato.</p>
        
            <h4>2. Uso del Bot</h4>
            <p>El Bot está diseñado para proporcionar un sistema de niveles y experiencia (XP) dentro de servidores de Discord. Al utilizar el Bot, usted acepta:</p>
            <p><strong>Uso Responsable:</strong> No utilizar el Bot para actividades ilegales, fraudulentas, abusivas o que violen las políticas de Discord.</p>
            <p><strong>Respeto a la Comunidad:</strong> No utilizar el Bot para fomentar el acoso, el spam, el odio o cualquier comportamiento que pueda dañar a otros usuarios.</p>
            <p><strong>Cumplimiento de las Normas de Discord:</strong> Asegurarse de que el uso del Bot cumpla con las Normas de la Comunidad de Discord y los Términos de Servicio de Discord.</p>
        
            <h4>3. Funcionalidades del Bot</h4>
            <p>El Bot ofrece las siguientes funcionalidades:</p>
            <p><strong>Sistema de Niveles y XP:</strong> Los usuarios ganan experiencia (XP) al enviar mensajes en canales habilitados. El Bot calcula y almacena los niveles y XP de los usuarios.</p>
            <p><strong>Roles Automáticos:</strong> Los administradores pueden configurar roles que se otorgan automáticamente al alcanzar ciertos niveles.</p>
            <p><strong>Alertas de Nivel:</strong> El Bot puede enviar mensajes de alerta cuando un usuario sube de nivel.</p>
            <p><strong>Personalización:</strong> Los administradores pueden personalizar ciertos aspectos del Bot, como mensajes de nivel y colores de tarjetas de perfil (en la versión Premium).</p>
        
            <h4>4. Responsabilidades del Usuario</h4>
            <p><strong>Administradores del Servidor:</strong> Son responsables de configurar y gestionar el uso del Bot en su servidor. Esto incluye la configuración de roles automáticos, canales de alertas y canales desactivados para XP.</p>
            <p><strong>Usuarios Finales:</strong> Deben respetar las reglas del servidor y no intentar manipular o explotar el sistema de niveles y XP.</p>
        
            <h4>5. Versión Premium</h4>
            <p>El Bot ofrece una versión Premium con funcionalidades adicionales, como la personalización de colores de tarjetas de perfil y boosts de XP.</p>
            <p><strong>Pago y Suscripción:</strong> El pago se realiza a través de la plataforma de Discord. El servidor debe mantener la suscripción activa para seguir disfrutando de las funcionalidades Premium.</p>
            <p><strong>Cancelación:</strong> Si la suscripción Premium se cancela, las funcionalidades Premium dejarán de estar disponibles y los colores personalizados de las tarjetas de perfil se restablecerán a los valores predeterminados.</p>
        
            <h4>6. Limitaciones del Bot</h4>
            <p><strong>Disponibilidad:</strong> El Bot se proporciona "tal cual" y no garantizamos su disponibilidad continua. Podemos realizar mantenimiento, actualizaciones o desactivar el Bot en cualquier momento sin previo aviso.</p>
            <p><strong>Errores y Bugs:</strong> No garantizamos que el Bot esté completamente libre de errores. Si encuentra algún problema, puede reportarlo a través de nuestro Discord.</p>
            <p><strong>Modificaciones:</strong> Nos reservamos el derecho de modificar, suspender o descontinuar cualquier funcionalidad del Bot en cualquier momento.</p>
        
            <h4>7. Privacidad</h4>
            <p>El uso del Bot está sujeto a nuestra Política de Privacidad, que describe cómo recopilamos, utilizamos y protegemos su información. Al utilizar el Bot, usted acepta nuestras prácticas de privacidad.</p>
        
            <h4>8. Prohibiciones</h4>
            <p>Está estrictamente prohibido:</p>
            <p><strong>Manipulación del Sistema:</strong> Intentar manipular el sistema de niveles y XP mediante bots, scripts o cualquier otro método no autorizado.</p>
            <p><strong>Uso Malicioso:</strong> Utilizar el Bot para dañar, interferir o perjudicar a otros usuarios o servidores.</p>
            <p><strong>Distribución No Autorizada:</strong> Copiar, modificar, distribuir o revender el Bot o cualquier parte de su código sin autorización expresa.</p>
        
            <h4>9. Responsabilidad</h4>
            <p><strong>Limitación de Responsabilidad:</strong> No seremos responsables por ningún daño directo, indirecto, incidental, especial o consecuente que surja del uso o la imposibilidad de usar el Bot.</p>
            <p><strong>Indemnización:</strong> Usted acepta indemnizarnos y eximirnos de cualquier responsabilidad por cualquier reclamo, demanda o daño relacionado con su uso del Bot.</p>
        
            <h4>10. Cambios en los Términos y Condiciones</h4>
            <p>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Cualquier cambio será notificado a través de nuestro servidor de Discord o mediante un mensaje directo a los administradores del servidor. Su uso continuado del Bot después de los cambios constituye su aceptación de los nuevos términos.</p>
        
            <h4>11. Terminación</h4>
            <p>Podemos suspender o terminar su acceso al Bot en cualquier momento, sin previo aviso, si consideramos que ha violado estos Términos y Condiciones o las políticas de Discord.</p>
        
            <h4>12. Contacto</h4>
            <p>Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de Discord.</p>
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
    )
}

export default TermsConditionsPage;