import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecords, getRecordId } from '../../api/starships';
import './style.css';

const CATEGORIAS = {
  starships: {
    etiqueta: 'Naves',
    contador: 'naves registradas',
    titulo: 'Hangar imperial',
    descripcion: 'Desde cazas estelares hasta cruceros de combate.',
    buscador: 'Nombre, modelo o fabricante',
    filtro: 'Clase',
    campoFiltro: 'starship_class',
    detalle: (registro) => registro.model,
    extra: (registro) => registro.starship_class,
  },
  people: {
    etiqueta: 'Personajes',
    contador: 'personajes registrados',
    titulo: 'Censo galáctico',
    descripcion: 'Pilotos, líderes y habitantes de toda la galaxia.',
    buscador: 'Nombre, género o nacimiento',
    filtro: 'Género',
    campoFiltro: 'gender',
    detalle: (registro) => `${registro.gender} · ${registro.birth_year}`,
    extra: (registro) => registro.gender,
  },
  planets: {
    etiqueta: 'Planetas',
    contador: 'planetas registrados',
    titulo: 'Atlas galáctico',
    descripcion: 'Mundos, climas y terrenos registrados por la República.',
    buscador: 'Nombre, clima o terreno',
    filtro: 'Clima',
    campoFiltro: 'climate',
    detalle: (registro) => `${registro.climate} · ${registro.terrain}`,
    extra: (registro) => registro.terrain,
  },
};

function Inicio() {
  const [categoria, setCategoria] = useState('starships');
  const [registros, setRegistros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const config = CATEGORIAS[categoria];

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setRegistros([]);
    setBusqueda('');
    setFiltro('Todos');
    setError('');

    getAllRecords(categoria)
      .then((datos) => { if (vigente) setRegistros(datos); })
      .catch((errorCarga) => { if (vigente) setError(errorCarga.message); })
      .finally(() => { if (vigente) setCargando(false); });

    return () => { vigente = false; };
  }, [categoria]);

  const opcionesFiltro = useMemo(
    () => ['Todos', ...new Set(registros.map((registro) => registro[config.campoFiltro]).filter(Boolean))],
    [config.campoFiltro, registros]
  );
  const resultados = registros.filter((registro) => {
    const texto = Object.values(registro).filter((valor) => typeof valor === 'string').join(' ').toLowerCase();
    return texto.includes(busqueda.trim().toLowerCase()) && (filtro === 'Todos' || registro[config.campoFiltro] === filtro);
  });

  return (
    <main className="hangar">
      <header className="hangar-encabezado">
        <div>
          <p className="hangar-etiqueta">ARCHIVO DE LA GALAXIA · 001</p>
          <h1>{config.titulo}</h1>
          <p className="hangar-intro">{config.descripcion}</p>
        </div>
        <p className="hangar-total"><strong>{registros.length || '—'}</strong><span>{config.contador}</span></p>
      </header>

      <div className="hangar-categorias" role="group" aria-label="Tipo de archivo">
        {Object.entries(CATEGORIAS).map(([clave, datos]) => (
          <button key={clave} type="button" className={categoria === clave ? 'activa' : ''} aria-pressed={categoria === clave} onClick={() => setCategoria(clave)}>
            {datos.etiqueta}
          </button>
        ))}
      </div>

      <div className="hangar-controles">
        <label className="hangar-busqueda">
          <span>Buscar</span>
          <input
            type="search"
            placeholder={config.buscador}
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </label>
        <label className="hangar-filtro">
          <span>{config.filtro}</span>
          <select value={filtro} onChange={(event) => setFiltro(event.target.value)}>
            {opcionesFiltro.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
          </select>
        </label>
      </div>

      {cargando && <p className="hangar-mensaje">Recibiendo datos desde una galaxia muy, muy lejana...</p>}
      {error && <p className="hangar-mensaje hangar-error">{error}</p>}
      {!cargando && !error && resultados.length === 0 && <p className="hangar-mensaje">No hay registros que coincidan con la búsqueda.</p>}

      <section className="hangar-grid" aria-label={config.etiqueta}>
        {resultados.map((registro) => {
          const id = getRecordId(registro);
          const ruta = categoria === 'starships' ? `/naves/${id}` : `/archivo/${categoria}/${id}`;
          return (
            <button className={`hangar-nave hangar-registro-${categoria}`} key={id} type="button" onClick={() => navigate(ruta)}>
              <span className="hangar-nave-numero">{categoria === 'starships' ? 'UNIDAD' : 'REGISTRO'} {id.padStart(2, '0')}</span>
              {categoria === 'starships' && <span className="hangar-mini-nave" aria-hidden="true"><i /></span>}
              {categoria === 'people' && <span className="hangar-mini-personaje" aria-hidden="true">{registro.name.slice(0, 1)}</span>}
              {categoria === 'planets' && <span className="hangar-mini-planeta" aria-hidden="true" />}
              <span className="hangar-nave-nombre">{registro.name}</span>
              <span className="hangar-nave-modelo">{config.detalle(registro)}</span>
              <span className="hangar-nave-pie">{config.extra(registro)}<span>↗</span></span>
            </button>
          );
        })}
      </section>
    </main>
  );
}

export default Inicio;