import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import ModalFormulario from "../components/ModalFormulario";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import TareaProyecto from "../components/TareaProyecto";
import Colaborador from "../components/Colaborador";
import io from "socket.io-client";

let socket;

const Proyecto = () => {
  const params = useParams();
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    handleModalTarea,
    submitTareasProyecto,
    eliminarTareaProyecto,
    actualizarTareaProyecto,
    cambiarEstadoTarea
  } = useProyectos();

  const admin = useAdmin();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("abrir proyecto", params.id);
  }, []);

  useEffect(() => {
    socket.on("tarea agregada", (tareaNueva) => {
      if (tareaNueva.proyecto === proyecto._id) {
        submitTareasProyecto(tareaNueva);
      }
    });

    socket.on("tarea eliminada", (tareaEliminada) => {
      if (tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada);
      }
    });

    socket.on("tarea actualizada", (tareaActualizada) => {
      if (tareaActualizada.proyecto._id === proyecto._id) {
        actualizarTareaProyecto(tareaActualizada);
      }
    });

    socket.on('nuevo estado', (nuevoEstadoTarea) => {
      if(nuevoEstadoTarea.proyecto._id === proyecto._id) {
        cambiarEstadoTarea(nuevoEstadoTarea)
      }
    })
  });

  const { nombre } = proyecto;

  if (cargando) return "Cargando...";

  return (
    <>
      <div className=" flex justify-between">
        <h1 className=" text-4xl font-black text-center ">{nombre}</h1>

        {admin && (
          <div className=" flex items-center gap-2 bg-sky-600 px-5 py-3 text-white rounded-lg hover:bg-sky-700 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
            <Link
              to={`/proyectos/editar/${params.id}`}
              className=" font-bold uppercase"
            >
              Editar
            </Link>
          </div>
        )}
      </div>

      {admin && (
        <button
          onClick={handleModalTarea}
          type="button"
          className=" justify-center items-center flex gap-2 mt-5 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-600 text-white text-center "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
          Nueva Tarea
        </button>
      )}

      <p className=" font-bold text-xl mt-10 uppercase text-gray-700 text-center ">
        Tareas del Proyecto
      </p>

      <div className=" bg-white shadow mt-10 rounded-lg ">
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map((tarea) => (
            <TareaProyecto key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <p className=" font-bold text-xl mt-10 p-10 uppercase text-gray-700 text-center ">
            No hay tareas en este proyecto
          </p>
        )}
      </div>

      {admin && (
        <>
          <div className=" flex items-center justify-between mt-10 ">
            <p className=" font-bold text-xl uppercase text-gray-700 ">
              Colaboradores
            </p>
            <Link
              className=" uppercase font-bold bg-sky-600 px-5 py-3 text-white rounded-lg hover:bg-sky-700 "
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
            >
              Agregar
            </Link>
          </div>

          <div className=" bg-white shadow mt-10 rounded-lg ">
            {proyecto.colaboradores?.length ? (
              proyecto.colaboradores?.map((colaborador) => (
                <Colaborador key={colaborador._id} colaborador={colaborador} />
              ))
            ) : (
              <p className=" font-bold text-xl mt-10 p-10 uppercase text-gray-700 text-center ">
                No hay colaborares en este proyecto
              </p>
            )}
          </div>
        </>
      )}

      <ModalFormulario />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  );
};

export default Proyecto;
