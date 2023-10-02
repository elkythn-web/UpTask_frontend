import PropTypes from "prop-types";
import { useState, createContext, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [proyecto, setProyecto] = useState({});
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
  const [buscador, setBuscador] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const obtenerProyectos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await clienteAxios("/proyectos", config);
        setProyectos(data);
      } catch (error) {
        setAlerta({
          error: true,
          msg: error.response.data.msg,
        });
      }
    };
    obtenerProyectos();
  }, [auth]);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({});
    }, 3000);
  };

  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await crearProyecto(proyecto);
    }
  };

  const crearProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post("/proyectos", proyecto, config);
      setProyectos([...proyectos, data]);
      setAlerta({
        error: false,
        msg: "Proyecto creado correctamente",
      });
      setTimeout(() => {
        navigate("/proyectos");
      }, 3000);
      setAlerta({});
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    }
  };

  const editarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // TODO: Revisar para sincronizar los proyectos ya que no se actualiza el proyecto en el state
      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      );
      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === proyecto._id ? data : proyectoState
      );
      setProyectos(proyectosActualizados);
      setAlerta({
        error: false,
        msg: "Proyecto editado correctamente",
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios(`/proyectos/${id}`, config);
      setProyecto(data);
    } catch (error) {
      navigate("/proyectos")
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      })
      setTimeout(() => {
        setAlerta({});
      }, 1000);
    }
    setCargando(false);
  };

  const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await clienteAxios.delete(`/proyectos/${id}`, config);
      const proyectosActualizados = proyectos.filter(
        (proyecto) => proyecto._id !== id
      );
      setProyectos(proyectosActualizados);
      setAlerta({
        error: false,
        msg: "Proyecto eliminado correctamente",
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    }
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  const submitTarea = async (tarea) => {
    if (tarea?.id) {
      await editarTarea(tarea);
    } else {
      await crearTarea(tarea);
    }
  };

  const crearTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post("/tareas", tarea, config);

      setAlerta({});
      setModalFormularioTarea(false);

      // Socket.io
      socket.emit('nueva tarea', data)

    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    }
  };

  const editarTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      );
      
      setAlerta({});
      setModalFormularioTarea(false);
      // SOCKET
      socket.emit('actualizar tarea', data)
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    }
  };

  const handleModalEditarTarea = (tarea) => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea(tarea);
  };

  const handleModalEliminarTarea = (tarea) => {
    setModalEliminarTarea(!modalEliminarTarea);
    setTarea(tarea);
  };

  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.delete(
        `/tareas/${tarea._id}`,
        config
      );
      setAlerta({
        error: false,
        msg: data.msg,
      });
      setModalEliminarTarea(false);

      // SOCKET
      socket.emit('eliminar tarea', tarea)

      setTarea({});
      setTimeout(() => {
        setAlerta({});
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const submitColaborador = async (email) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores`,
        { email },
        config
      );
      setColaborador(data);
      setAlerta({});
    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    } finally {
      setCargando(false);
    }
  };

  const agregarColaborador = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email , config );
      setAlerta({
        error: false,
        msg: data.msg,
      });
      setColaborador({});
      setTimeout(() => {
        setAlerta({});
      }
      , 1000);

    } catch (error) {
      setAlerta({
        error: true,
        msg: error.response.data.msg,
      });
    }
  };

  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  }

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,{ id: colaborador._id }, config );
      const proyectoActualizado = { ...proyecto };
      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(
        colaboradorState => colaboradorState._id !== colaborador._id
      )
      setProyecto(proyectoActualizado);
      setAlerta({
        error: false,
        msg: data.msg,
      });
      setColaborador({});
      setModalEliminarColaborador(false);
      setTimeout(() => {
        setAlerta({});
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  const completarTarea = async id => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config );
      setAlerta({});
      setTarea({});
      // socket
      socket.emit('cambiar estado', data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador);
  }

  // Socket.io
  const submitTareasProyecto = (tarea) => {
      const proyectoActualizado = {...proyecto}
      proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
      setProyecto(proyectoActualizado)
  }

  const eliminarTareaProyecto = tarea => {
    console.log(tarea)
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id )
    console.log(proyectoActualizado)
    setProyecto(proyectoActualizado)
  }

  const actualizarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState )
    setProyecto(proyectoActualizado)
  }

  const cambiarEstadoTarea = tarea => {
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
    setProyecto(proyectoActualizado)
  }

  const cerrarSesionProyectos = () => {
    setProyectos([])
    setProyecto({})
    setAlerta({})

  }

  return (
    <ProyectosContext.Provider
      value={{
        alerta,
        mostrarAlerta,
        proyectos,
        obtenerProyecto,
        submitProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        handleModalTarea,
        modalFormularioTarea,
        submitTarea,
        tarea,
        handleModalEditarTarea,
        handleModalEliminarTarea,
        modalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea,
        cerrarSesionProyectos,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

ProyectosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProyectosContext;
