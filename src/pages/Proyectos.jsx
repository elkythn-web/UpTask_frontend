import useProyectos from "../hooks/useProyectos"
import ViewProyecto from "../components/ViewProyecto"
import Alert from "../components/Alert"


const Proyectos = () => {
  const { proyectos, alerta } = useProyectos()

  const { msg } = alerta

  return (
    <>
      <h1 className=" text-4xl font-black text-center ">Proyectos</h1>

      {msg && <Alert alerta={alerta} />}

      <div className=" bg-white shadow mt-10 rounded-lg ">
          {proyectos.length ? 
            proyectos.map(proyecto => (
              <ViewProyecto
                key={proyecto._id}
                proyecto={proyecto}
              />
            ))
          : <p className=" text-center text-gray-600 uppercase p-5 ">No hay proyectos</p> }
      </div>
    </>
  )
}

export default Proyectos