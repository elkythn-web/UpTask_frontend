import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alert from "../components/Alert"


const NuevoPassword = () => {

  const [password, setPassword] = useState("")
  const [tokenValido, setTokenValido] = useState(false)
  const [contraseñaCambiada, setContraseñaCambiada] = useState(false)
  const [alert, setAlert] = useState({})
  const params = useParams()
  const { token } = params

  useEffect(() => {
    const recuperarPassword = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlert({
          error: true,
          msg: error.response.data.msg
        })
      }
    }
    recuperarPassword()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.trim() === "") {
      setAlert({
        error: true,
        msg: "El campo contraseña es obligatorio"
      })
      return
    }
    if(password.length < 6) {
      setAlert({
        error: true,
        msg: "La contraseña debe tener al menos 6 caracteres"
      })
      return
    }
    setAlert({})

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password})
      setAlert({
        error: false,
        msg: data.msg
      })
      setPassword("")
      setContraseñaCambiada(true)
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
      Restablecer Contraseña
    </h1>

    {msg && <Alert alerta={alert} />}

    {tokenValido && (
      <form 
      className=" my-10 bg-white shadow rounded-lg p-10 "
      onSubmit={handleSubmit}
      >
        
      <div className=" my-5 ">
          <label
            htmlFor="password"
            className=" uppercase text-gray-600 block text-xl font-bold "
          >
            Nueva Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Escribe tu nueva contraseña"
            className=" w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Guardar Contraseña"
          className=" my-5 w-full bg-sky-700 py-3 text-white uppercase font-bold rounded-md hover:bg-sky-800 hover:cursor-pointer transition-colors "
        />
      </form>
    )}
    
    {contraseñaCambiada && (
      <div className=" my-10 bg-white shadow rounded-lg p-10 ">
        <p className=" text-center text-2xl text-gray-600 ">
          Tu contraseña se ha cambiado correctamente
        </p>
        <Link
          to="/"
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
        >
          Iniciar Sesión
        </Link>
      </div>
    )}
  </>
  )
}

export default NuevoPassword