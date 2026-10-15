import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStarships, getStarshipId } from '../../api/starships';
import './style.css';

function Coleccion() {
  const [navesExploradas, setNavesExploradas] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem('navesExploradas') || '[]');
      return Array.isArray(guardados) ? [...new Set(guardados.map(String))] : [];
    } catch {
      return [];
    }
  });
  const [naves, setNaves] = useState([]);
  const [nuevas, setNuevas] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllStarships()
      .then(setNaves)
      .catch((errorCarga) => setError(errorCarga.message));
  }, []);

  const explorarNaves = () => {
    const disponibles = naves.filter((nave) => !navesExploradas.includes(getStarshipId(nave)));
    const seleccionadas = [...disponibles].sort(() => Math.random() - 0.5).slice(0, 4);
    const idsNuevos = seleccionadas.map(getStarshipId);
    const actualizadas = [...navesExploradas, ...idsNuevos];

    setNavesExploradas(actualizadas);
    setNuevas(idsNuevos);
    localStorage.setItem('navesExploradas', JSON.stringify(actualizadas));
  };

  return (
    <main className="coleccion">
      <header className="coleccion-encabezado">
        <div>
          <p className="hangar-etiqueta">BITÁCORA DE EXPLORACIÓN</p>
          <h1 className="coleccion-titulo">Mi flota</h1>
          <p className="coleccion-descripcion">Registra naves para añadirlas a tu archivo personal.</p>
        </div>
        <div className="coleccion-progreso">
          <strong>{navesExploradas.length}<span> / {naves.length || '—'}</span></strong>
          <button className="coleccion-boton" type="button" onClick={explorarNaves} disabled={!naves.length || navesExploradas.length >= naves.length}>
            Explorar 4 naves
          </button>
        </div>
      </header>

      {error && <p className="hangar-mensaje hangar-error">{error}</p>}
      {nuevas.length > 0 && <p className="coleccion-aviso">Nuevas unidades registradas: {nuevas.length}</p>}

      <section className="coleccion-album" aria-label="Archivo de naves">
        {naves.map((nave) => {
          const id = getStarshipId(nave);
          const explorada = navesExploradas.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={explorada ? 'coleccion-nave explorada' : 'coleccion-nave'}
              disabled={!explorada}
              onClick={() => navigate(`/naves/${id}`)}
            >
              <span className="coleccion-nave-id">{id.padStart(2, '0')}</span>
              <span className="coleccion-nave-nombre">{explorada ? nave.name : 'Sin explorar'}</span>
              <span className="coleccion-nave-clase">{explorada ? nave.starship_class : '—'}</span>
            </button>
          );
        })}
      </section>
    </main>
  );
}

export default Coleccion;