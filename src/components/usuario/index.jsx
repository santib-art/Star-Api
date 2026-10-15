import { Link } from 'react-router-dom';
import './style.css';

function leerLista(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave) || '[]');
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function Usuario() {
    const navesExploradas = leerLista('navesExploradas');
    const navesFavoritas = leerLista('navesFavoritas');

    return (
        <main className="perfil-explorador">
            <p className="hangar-etiqueta">REGISTRO LOCAL</p>
            <h1>Perfil de explorador</h1>
            <p className="perfil-intro">Tu actividad de exploración se guarda únicamente en este dispositivo.</p>
            <section className="perfil-estadisticas">
                <Link to="/coleccion"><strong>{navesExploradas.length}</strong><span>Naves exploradas</span><small>Abrir mi flota ↗</small></Link>
                <Link to="/favoritos"><strong>{navesFavoritas.length}</strong><span>Naves guardadas</span><small>Ver favoritas ↗</small></Link>
            </section>
        </main>
    );
}

export default Usuario