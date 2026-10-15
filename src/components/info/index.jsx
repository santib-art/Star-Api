import './style.css';

function Info() {
  const fondoUrl = 'https://w0.peakpx.com/wallpaper/267/958/HD-wallpaper-death-stars-etoile-starwars.jpg';

  return (
    <main className="info-container">
      <section className="info-card" style={{ '--info-background': `url("${fondoUrl}")` }}>
        <div className="info-copy">
          <p className="info-kicker">ARCHIVO GALÁCTICO · PROYECTO 01</p>
          <h1 className="info-title">SWAPI</h1>
          <p className="info-description">Una ventana a las naves, pilotos y datos de una galaxia muy, muy lejana.</p>
          <p className="info-author"><span>Creado por</span><strong>Santiago Rojas Ballesteros</strong></p>
        </div>
        <div className="info-insignia" aria-hidden="true"><span>STAR</span><strong>API</strong><i /></div>
      </section>

      <section className="info-detalles" aria-label="Información del proyecto">
        <div className="info-detalle">
          <span className="info-etiqueta">FUENTE DE DATOS</span>
          <a href="https://swapi.py4e.com/" target="_blank" rel="noreferrer">Star Wars API <span>↗</span></a>
          <p>Datos abiertos sobre naves, personajes y películas.</p>
        </div>
        <div className="info-detalle">
          <span className="info-etiqueta">CÓDIGO</span>
          <a href="https://github.com/santib-art/Star-Api" target="_blank" rel="noreferrer">Repositorio en GitHub <span>↗</span></a>
          <p>Explora el proyecto y su implementación.</p>
        </div>
        <div className="info-detalle info-version">
          <span className="info-etiqueta">VERSIÓN</span>
          <strong>1.0.0</strong>
          <p>Archivo de la flota</p>
        </div>
      </section>
    </main>
  );
}

export default Info;