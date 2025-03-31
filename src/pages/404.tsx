import MainHeader from '../components/MainHeader';

const NotFoundPage: React.FC = () => {
  return (
    <div>
      <MainHeader/>
      <main>
        <div className="container">
          <div className="section-header3">
            <br />
            <h2>En desarrollo…</h2>
            <p>Pero no te preocupes, te ayudaremos a retomar el rumbo. ¡Vuelve a la página principal o usa la barra de búsqueda para encontrar lo que necesitas!</p>
            <a href="/" className="btn btn-primary">Volver al menú</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;