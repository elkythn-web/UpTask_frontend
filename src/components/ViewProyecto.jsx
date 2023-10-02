import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ViewProyecto = ({ proyecto }) => {
  const { auth } = useAuth();
  const { nombre, _id, cliente, creador } = proyecto;

  return (
    <div className=" border-b p-5 flex flex-col md:flex-row justify-between ">
      <div className="flex items-center gap-2">
        <p className=" font-bold text-gray-700 ">
          {nombre}
          <span className=" font-black text-gray-500 "> {cliente}</span>
        </p>

        {auth._id !== creador && (
          <p className=" ml-auto font-bold text-white uppercase bg-green-500 px-5 py-2 rounded-lg ">
            Colaborador
          </p>
        )}
      </div>

      <Link
        to={`${_id}`}
        className=" ml-auto bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-md uppercase font-bold cursor-pointer transition-colors"
      >
        Ver Proyecto
      </Link>
    </div>
  );
};

ViewProyecto.propTypes = {
  proyecto: PropTypes.object.isRequired,
};

export default ViewProyecto;
