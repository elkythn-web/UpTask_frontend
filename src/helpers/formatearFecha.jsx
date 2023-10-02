export const formatearFecha = (fecha) => {
    const nuevafecha = new Date(fecha.split("T")[0].split("-"));

    const opciones ={
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    return nuevafecha.toLocaleDateString("es-ES", opciones);
}