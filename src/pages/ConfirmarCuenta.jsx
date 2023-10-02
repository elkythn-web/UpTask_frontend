import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alert from '../components/Alert'

const ConfirmarCuenta = () => {

  const [alerta, setAlerta] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
  const params = useParams()
  const { token } = params

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const { data } = await clienteAxios(`/usuarios/confirmar/${token}`)
        setAlerta({
          error: false,
          msg: data.msg
        })
        setCuentaConfirmada(true)
      } catch (error) {
        setAlerta({
          error: true,
          msg: error.response.data.msg
        })
      }
    }
    confirmarCuenta()
  }, [token])

  const { msg } = alerta

  return (
    <>
    <h1 className=" text-sky-600 font-black text-6xl capitalize text-center ">
      Confirmar Cuenta
    </h1>
    <div className=' mt-20 md:mt-5 shadow-lg px-5 py-10 rounde bg-white '>
      {msg && <Alert alerta={alerta} />}
      {cuentaConfirmada && (
        <div className=" text-center ">
          <p className=" text-gray-600 text-xl ">
            Tu cuenta ha sido confirmada, ya puedes iniciar sesión
          </p>
          <Link
            to="/"
            className=" inline-block bg-sky-700 text-white uppercase font-bold rounded-md px-5 py-3 mt-5 hover:bg-sky-800 hover:cursor-pointer transition-colors "
          >
            Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
    </>
  )
}

export default ConfirmarCuenta