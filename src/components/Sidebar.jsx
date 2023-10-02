import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
const Sidebar = () => {
  const { auth, cargando } = useAuth()

    if(cargando) {
        return <h1>Cargando...</h1>
    }
  return (
    <aside className=" md:w-1/3 lg:w-1/5 xl:w-1/6 bg-white px-5 py-10 ">
      <p className=" text-xl font-bold ">Bienvenido: {auth.nombre}</p>

      <Link
        to="crear-proyecto"
        className=" bg-sky-600 w-full p-3 text-white uppercase font-bold block mt-5 rounded-lg text-center"
      >
        Nuevo Proyecto
      </Link>

    </aside>
  )
}

export default Sidebar