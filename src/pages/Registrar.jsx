import { useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alert from "../components/Alert"

const Registrar = () => {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repetirPassword, setRepetirPassword] = useState("")
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombre.trim() === "" || email.trim() === "" || password.trim() === "" || repetirPassword.trim() === "") {
      setAlerta({
        error: true,
        msg: "Todos los campos son obligatorios"
      })
      return
    }
    if(password !== repetirPassword) {
      setAlerta({
        error: true,
        msg: "Las contraseñas no coinciden"
      })
      return
    }
    if(password.length < 6) {
      setAlerta({
        error: true,
        msg: "La contraseña debe tener al menos 6 caracteres"
      })
      return
    }
    setAlerta({})

    try {
      const { data } = await clienteAxios.post(`/usuarios`, { nombre, email, password })
      setAlerta({
        error: false,
        msg: data.msg
      })

      setNombre("")
      setEmail("")
      setPassword("")
      setRepetirPassword("")
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg
      })
    }

  }

  const { msg } = alerta

  return (
    <>
    <h1 className=" text-sky-600 font-black text-6xl capitalize text-center ">
      Crear Cuenta
    </h1>

    <form 
    className=" my-10 bg-white shadow rounded-lg p-10 "
    onSubmit={handleSubmit}
    >
      {msg && <Alert alerta={alerta} />}
    <div className=" my-5 ">
        <label
          htmlFor="nombre"
          className=" uppercase text-gray-600 block text-xl font-bold "
        >
          Nombre
        </label>
        <input
          id="nombre"
          type="nombre"
          placeholder="Nombre Completo"
          className=" w-full mt-3 p-3 border rounded-xl bg-gray-50 "
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
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
          placeholder="Contraseña"
          className=" w-full mt-3 p-3 border rounded-xl bg-gray-50 "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className=" my-5 ">
        <label
          htmlFor="password2"
          className=" uppercase text-gray-600 block text-xl font-bold "
        >
          Repetir Contraseña
        </label>
        <input
          id="password2"
          type="password"
          placeholder="Repetir contraseña"
          className=" w-full mt-3 p-3 border rounded-xl bg-gray-50 "
          value={repetirPassword}
          onChange={(e) => setRepetirPassword(e.target.value)}
        />
      </div>
      <input
        type="submit"
        value="Crear Cuenta"
        className=" my-5 w-full bg-sky-700 py-3 text-white uppercase font-bold rounded-md hover:bg-sky-800 hover:cursor-pointer transition-colors "
      />
    </form>

    <nav className=" lg:flex lg:justify-between ">
      <Link
        to="/"
        className=" block text-center my-5 text-slate-500 uppercase text-sm"
      >
        Ya tengo una cuenta
      </Link>
      <Link
        to="/olvide-password"
        className=" block text-center my-5 text-slate-500 uppercase text-sm "
      >
        Olvide mi contraseña
      </Link>
    </nav>
  </>
  )
}

export default Registrar