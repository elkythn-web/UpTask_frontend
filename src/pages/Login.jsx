import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [alerta, setAlerta] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setAlerta({
        error: true,
        msg: "Todos los campos son obligatorios",
      });
      return;
    }

    try {
      const { data } = await clienteAxios.post("/usuarios/login", {
        email,
        password,
      });
      setAlerta({});
      localStorage.setItem("token", data.token);
      setAuth(data)
      navigate("/proyectos");
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    }
  };

  const msg = alerta;

  return (
    <>
      <h1 className=" text-sky-600 font-black text-6xl capitalize text-center ">
        Iniciar Sesion
      </h1>

      <form
        className=" my-10 bg-white shadow rounded-lg p-10 "
        onSubmit={handleSubmit}
      >
        {msg && <Alert alerta={alerta} />}
        <div className=" my-5 ">
          <label
            htmlFor="email"
            className=" uppercase text-gray-600 block text-xl font-bold "
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className=" w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className=" my-5 ">
          <label
            htmlFor="password"
            className=" uppercase text-gray-600 block text-xl font-bold "
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña de Registro"
            className=" w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Iniciar Sesion"
          className=" my-5 w-full bg-sky-700 py-3 text-white uppercase font-bold rounded-md hover:bg-sky-800 hover:cursor-pointer transition-colors "
        />
      </form>

      <nav className=" lg:flex lg:justify-between ">
        <Link
          to="/registrar"
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Si no tienes una cuenta? Registrate
        </Link>
        <Link
          to="/olvide-password"
          className=" block text-center my-5 text-slate-500 uppercase text-sm "
        >
          Olvide mi contraseña
        </Link>
      </nav>
    </>
  );
};

export default Login;
