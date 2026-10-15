import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';

import Inicio from './components/inicio'
import Coleccion from './components/coleccion'
import Favoritos from './components/favoritos'
import Info from './components/info'
import Usuario from './components/usuario'
import Starwars from './components/starwars'
import './App.css'

function App() {

  return (
    <>
    <Router>

        <nav className="c-menu" aria-label="Navegación principal">
          <NavLink to="/" end>Hangar</NavLink>
          <NavLink to="/coleccion">Mi flota</NavLink>
          <NavLink to="/favoritos">Guardadas</NavLink>
          <NavLink to="/info">Archivo</NavLink>
          <NavLink to="/usuario">Perfil</NavLink>

        </nav>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/coleccion' element={<Coleccion />} />
        <Route path='/favoritos' element={<Favoritos />} />
        <Route path='/info' element={<Info />} />
        <Route path='/usuario' element={<Usuario />} />
        <Route path='/naves/:id' element={<Starwars />} />
        <Route path='/archivo/:tipo/:id' element={<Starwars />} />
      </Routes>
    </Router>
 
    </>
  )
}

export default App
