//Imports de dependencias
import { BrowserRouter, Routes, Route } from "react-router-dom";
//Imports de Layouts
import AuthLayout from "./layouts/AuthLayout";
import RutaProtegida from "./layouts/RutaProtegida";
//Imports de Pages
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import OlvidePassword from "./pages/OlvidePassword";
import NuevoPassword from "./pages/NuevoPassword";
import ConfirmarCuenta from "./pages/ConfirmarCuenta";
import Proyectos from "./pages/Proyectos";
import NuevoProyecto from "./pages/NuevoProyecto";
import Proyecto from "./pages/Proyecto";
import EditarProyecto from "./pages/EditarProyecto";
import NuevoColaborador from "./pages/NuevoColaborador";
//Imports de Context
import { AuthProvider } from "./context/AuthProvider";
import { ProyectosProvider } from "./context/ProyectosProvider";

const App = () => {
  return (
    <BrowserRouter basename="/index.html">
      <AuthProvider>
        <ProyectosProvider>  
        <Routes>
          
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="registrar" element={<Registrar />} />
            <Route path="olvide-password" element={<OlvidePassword />} />
            <Route path="olvide-password/:token" element={<NuevoPassword />} />
            <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
          </Route>

          <Route path="/proyectos" element={<RutaProtegida />}>
            <Route index element={<Proyectos />} />
            <Route path="crear-proyecto" element={<NuevoProyecto />} />
            <Route path="nuevo-colaborador/:id" element={<NuevoColaborador />} />
            <Route path=":id" element={<Proyecto />} />
            <Route path="editar/:id" element={<EditarProyecto />} />

          </Route>
        </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
