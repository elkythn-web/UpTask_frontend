import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alert from '../components/Alert'

const FormularioColaborador = () => {
  const [email, setEmail] = useState("");

  const { mostrarAlerta, alerta, submitColaborador } = useProyectos();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      mostrarAlerta({
        error: true,
        msg: "El correo electronico es obligatorio",
      });
      return;
    }

    submitColaborador(email);

    setEmail("");
  };

  const { msg } = alerta;

  return (
    <form
      onSubmit={handleSubmit}
      className=" bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow "
    >
        {msg && <Alert alerta={alerta} />}
      <div className=" mb-5 ">
        <label
          className=" text-gray-700 uppercase text-sm font-bold"
          htmlFor="email"
        >
          Correo Electronico del Colaborador
        </label>
        <input
          type="email"
          id="email"
          placeholder="Correo Electronico del Colaborador"
          className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <input
        type="submit"
        value="Agregar Colaborador"
        className=" text-sm bg-sky-600 w-full mt-5 p-3 text-white uppercase font-bold hover:bg-sky-700 rounded-md cursor-pointer transition-colors  "
      />
    </form>
  );
};

export default FormularioColaborador;
