import { useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alert from "../components/Alert"

const OlvidePassword = () => {

  const [email, setEmail] = useState("")
  const [alert, setAlert] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (email.trim() === "") {
      setAlert({
        error: true,
        msg: "El campo email es obligatorio"
      })
      return
    }
    setAlert({})

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })
      setAlert({
        error: false,
        msg: data.msg
      })
      setEmail("")
    } catch (error) {
      setAlert({
        error: true,
        msg: error.response.data.msg
      })
    }
  }

  const { msg } = alert

  return (
    <>
    <h1 className=" text-sky-600 font-black text-6xl capitalize text-center ">
      Recuperar Contraseña
    </h1>

    <form 
      className=" my-10 bg-white shadow rounded-lg p-10 "
      onSubmit={handleSubmit}
    >
      {msg && <Alert alerta={alert} />}
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
          placeholder="Inserte su correo de registro"
          className=" w-full mt-3 p-3 border rounded-xl bg-gray-50 "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <input
        type="submit"
        value="Enviar Email"
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
          to="/registrar"
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Si no tienes una cuenta? Registrate
        </Link>
    </nav>
  </>
  )
}

export default OlvidePassword