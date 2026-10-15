import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './style.css';

const API_URL = 'https://swapi.py4e.com/api';

function Starwars() {
    const { id, tipo: tipoRuta } = useParams();
    const tipo = tipoRuta || 'starships';
    const esNave = tipo === 'starships';
    const [registro, setRegistro] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [error, setError] = useState('');
    const [favoritos, setFavoritos] = useState(() => {
        try {
            const guardados = JSON.parse(localStorage.getItem('navesFavoritas') || '[]');
            return Array.isArray(guardados) ? guardados : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const cargarRegistro = async () => {
            setRegistro(null);
            setRelacionados([]);
            setError('');

            try {
                if (!['starships', 'people', 'planets'].includes(tipo)) throw new Error('Este tipo de archivo no existe.');
                const respuesta = await fetch(`${API_URL}/${tipo}/${id}/?format=json`);
                if (!respuesta.ok) throw new Error('No se encontró este registro.');
                const datos = await respuesta.json();
                setRegistro(datos);

                const urlsRelacionadas = esNave
                    ? datos.pilots || []
                    : tipo === 'people'
                        ? datos.homeworld ? [datos.homeworld] : []
                        : (datos.residents || []).slice(0, 6);
                const registrosRelacionados = await Promise.all(
                    urlsRelacionadas.map(async (url) => {
                        const respuestaPiloto = await fetch(url);
                        if (!respuestaPiloto.ok) return null;
                        return respuestaPiloto.json();
                    })
                );
                setRelacionados(registrosRelacionados.filter(Boolean));
            } catch (errorCarga) {
                setError(errorCarga.message || 'No se pudo conectar con la base de datos galáctica.');
            }
        };

        cargarRegistro();
    }, [esNave, id, tipo]);

    const esFavorita = favoritos.some((favorito) => String(favorito.id) === String(id));

    const alternarFavorito = () => {
        const actualizados = esFavorita
            ? favoritos.filter((favorito) => String(favorito.id) !== String(id))
            : [...favoritos, { id, nombre: registro.name }];
        setFavoritos(actualizados);
        localStorage.setItem('navesFavoritas', JSON.stringify(actualizados));
    };

    if (error) {
        return <main className="detalle-nave"><p className="detalle-estado">{error}</p><Link to="/">Volver al hangar</Link></main>;
    }

    if (!registro) return <main className="detalle-nave"><p className="detalle-estado">Conectando con la base de datos galáctica...</p></main>;

    const etiqueta = esNave ? 'NAVE' : tipo === 'people' ? 'PERSONAJE' : 'PLANETA';
    const subtitulo = esNave
        ? registro.model
        : tipo === 'people'
            ? `${registro.birth_year} · ${registro.gender}`
            : `${registro.climate} · ${registro.terrain}`;
    const detalles = esNave
        ? [
            ['Clase', registro.starship_class], ['Fabricante', registro.manufacturer],
            ['Velocidad máxima', `${registro.max_atmosphering_speed} km/h`], ['Tripulación', registro.crew],
            ['Pasajeros', registro.passengers], ['Hiperimpulsor', registro.hyperdrive_rating],
        ]
        : tipo === 'people'
            ? [
                ['Nacimiento', registro.birth_year], ['Género', registro.gender], ['Altura', `${registro.height} cm`],
                ['Peso', `${registro.mass} kg`], ['Cabello', registro.hair_color], ['Ojos', registro.eye_color],
            ]
            : [
                ['Clima', registro.climate], ['Terreno', registro.terrain], ['Población', registro.population],
                ['Diámetro', `${registro.diameter} km`], ['Duración del día', `${registro.rotation_period} h`],
                ['Duración del año', `${registro.orbital_period} días`],
            ];
    const nombreRelacion = esNave ? 'Pilotos' : tipo === 'people' ? 'Planeta natal' : 'Habitantes conocidos';

    return (
        <main className="detalle-nave">
            <Link className="detalle-volver" to="/">← Volver al archivo</Link>
            <div className="detalle-encabezado">
                <div>
                    <p className="detalle-etiqueta">ARCHIVO GALÁCTICO · {etiqueta} {id}</p>
                    <h1>{registro.name}</h1>
                    <p className="detalle-modelo">{subtitulo}</p>
                </div>
                {esNave && <button className="detalle-favorito" type="button" onClick={alternarFavorito} aria-pressed={esFavorita}>
                    {esFavorita ? '★ Guardada' : '☆ Guardar nave'}
                </button>}
            </div>

            <section className="detalle-panel">
                <div className={`nave-ilustracion registro-ilustracion-${tipo}`} role="img" aria-label={`${etiqueta.toLowerCase()}: ${registro.name}`}>
                    {esNave ? <>
                        <span className="nave-ala nave-ala-izquierda" />
                        <span className="nave-cuerpo" />
                        <span className="nave-cabina" />
                        <span className="nave-ala nave-ala-derecha" />
                        <span className="nave-motor nave-motor-izquierdo" />
                        <span className="nave-motor nave-motor-derecho" />
                    </> : tipo === 'people'
                        ? <span className="registro-iniciales">{registro.name.split(' ').map((parte) => parte[0]).slice(0, 2).join('')}</span>
                        : <span className="registro-planeta" />}
                </div>

                <div className="detalle-datos">
                    <p className="detalle-etiqueta">ESPECIFICACIONES</p>
                    <dl>
                        {detalles.map(([etiquetaDetalle, valor]) => <div key={etiquetaDetalle}><dt>{etiquetaDetalle}</dt><dd>{valor === 'unknown' || valor === 'n/a' ? 'Sin datos' : valor}</dd></div>)}
                    </dl>
                </div>
            </section>

            <section className="detalle-pilotos">
                <div>
                    <p className="detalle-etiqueta">REGISTRO DE A BORDO</p>
                    <h2>{nombreRelacion}</h2>
                </div>
                {relacionados.length > 0 ? (
                    <ul>{relacionados.map((relacionado) => <li key={relacionado.url}>{relacionado.name}</li>)}</ul>
                ) : (
                    <p className="detalle-sin-piloto">No hay registros relacionados disponibles.</p>
                )}
            </section>
        </main>
    );
}

export default Starwars;