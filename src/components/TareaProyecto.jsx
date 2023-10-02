import PropTypes from "prop-types";
import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";

const TareaProyecto = ({ tarea }) => {
  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } =
    useProyectos();
  const { nombre, descripcion, prioridad, fechaEntrega, estado, _id } = tarea;

  const admin = useAdmin();

  return (
    <div className=" border-b p-5 flex justify-between items-center ">
      <div className=" flex flex-col items-start ">
        <p className=" mb-2 text-xl uppercase font-bold ">{nombre}</p>
        <p className=" mb-2 text-sm text-gray-600 ">{descripcion}</p>
        <p className=" mb-2 ">Prioridad: {prioridad}</p>
        <p className=" mb-2 text-sm ">{formatearFecha(fechaEntrega)}</p>
        {estado && (
          <p className=" text-xs bg-green-500 p-2 uppercase text-white rounded-lg ">
            Completada por: {tarea.completado.nombre}
          </p>
        )}
      </div>

      <div className=" flex flex-col lg:flex-row gap-2">
        {admin && (
          <button
            className=" bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg "
            onClick={() => handleModalEditarTarea(tarea)}
          >
            Editar
          </button>
        )}

        <button
          className={`${
            estado ? " bg-green-500 " : "bg-gray-500"
          } px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={() => completarTarea(_id)}
        >
          {estado ? "Completa" : "Incompleta"}
        </button>

        {admin && (
          <button
            className=" bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg "
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

TareaProyecto.propTypes = {
  tarea: PropTypes.object.isRequired,
};

export default TareaProyecto;
