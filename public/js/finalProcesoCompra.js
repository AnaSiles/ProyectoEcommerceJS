function finalizarCompra() {
  localStorage.removeItem("numero_tarjeta");
  localStorage.removeItem("compraid");
  localStorage.removeItem("tarjetaSeleccionada");
  // localStorage.removeItem("usuarioid");
  localStorage.removeItem("pedido");
  localStorage.removeItem("direccionEnvio");
  localStorage.removeItem("tarjeta_id");
  localStorage.removeItem("direccion_id");
  localStorage.removeItem("precioFinal");
}
