import { useState, useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";

const FormularioProyecto = () => {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [cliente, setCliente] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const params = useParams();

  const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

  useEffect(() => {
    if (params.id) {
      setId(params.id);
      setNombre(proyecto.nombre);
      setCliente(proyecto.cliente);
      setFechaEntrega(proyecto.fechaEntrega?.split("T")[0]);
      setDescripcion(proyecto.descripcion);
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      nombre.trim() === "" ||
      cliente.trim() === "" ||
      fechaEntrega.trim() === "" ||
      descripcion.trim() === ""
    ) {
      mostrarAlerta({
        error: true,
        msg: "Todos los campos son obligatorios",
      });
      return;
    }

    await submitProyecto({ id, nombre, cliente, fechaEntrega, descripcion });

    setId(null);
    setNombre("");
    setCliente("");
    setFechaEntrega("");
    setDescripcion("");
  };

  const { msg } = alerta;

  return (
    <form
      className=" bg-white py-10 px-5 md:w-1/2 rounded-lg "
      onSubmit={handleSubmit}
    >
      {msg && <Alert alerta={alerta} />}
      <div className=" mb-5 ">
        <label
          htmlFor="nombre"
          className=" text-gray-700 uppercase font-bold text-sm "
        >
          Nombre del Proyecto
        </label>
        <input
          type="text"
          id="nombre"
          placeholder="Nombre del proyecto"
          className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md "
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className=" mb-5 ">
        <label
          htmlFor="descripcion"
          className=" text-gray-700 uppercase font-bold text-sm "
        >
          Descripcion del Proyecto
        </label>
        <textarea
          id="descripcion"
          placeholder="Descripcion del proyecto"
          className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md "
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className=" mb-5 ">
        <label
          htmlFor="fecha-entrega"
          className=" text-gray-700 uppercase font-bold text-sm "
        >
          Fecha de Entrega de Proyecto
        </label>
        <input
          type="date"
          id="fecha-entrega"
          className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md "
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
        />
      </div>
      <div className=" mb-5 ">
        <label
          htmlFor="cliente"
          className=" text-gray-700 uppercase font-bold text-sm "
        >
          Nombre del Cliente
        </label>
        <input
          type="text"
          id="cliente"
          placeholder="Nombre del cliente"
          className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md "
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>
      <input
        type="submit"
        value={id ? "Editar Proyecto" : "Crear Proyecto"}
        className=" bg-sky-600 w-full p-3 text-white uppercase font-bold rounded text-center cursor-pointer hover:bg-sky-700 transition-colors"
      />
    </form>
  );
};

export default FormularioProyecto;
