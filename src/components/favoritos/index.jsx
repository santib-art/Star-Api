import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

function Favoritos() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem('navesFavoritas') || '[]');
      return Array.isArray(guardados) ? guardados : [];
    } catch {
      return [];
    }
  });

  const quitarFavorito = (id) => {
    const actualizados = favoritos.filter((favorito) => String(favorito.id) !== String(id));
    setFavoritos(actualizados);
    localStorage.setItem('navesFavoritas', JSON.stringify(actualizados));
  };

  return (
    <main className="favoritos">
      <p className="hangar-etiqueta">ARCHIVO PERSONAL</p>
      <h1>Naves guardadas</h1>
      {favoritos.length === 0 ? (
        <p className="favoritos-vacio">Aún no has guardado naves. <Link to="/">Explorar el hangar</Link></p>
      ) : (
        <section className="favoritos-lista" aria-label="Naves favoritas">
          {favoritos.map((nave) => (
            <article className="favoritos-nave" key={nave.id}>
              <button className="favoritos-detalle" type="button" onClick={() => navigate(`/naves/${nave.id}`)}>
                <span className="favoritos-indice">UNIDAD {String(nave.id).padStart(2, '0')}</span>
                <strong>{nave.nombre}</strong>
                <span>Ver especificaciones ↗</span>
              </button>
              <button className="favoritos-quitar" type="button" aria-label={`Quitar ${nave.nombre} de favoritos`} onClick={() => quitarFavorito(nave.id)}>×</button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Favoritos