function resumenPedido() {
    const precioFinal = localStorage.getItem("precioFinal");
    const compraid = localStorage.getItem("compraid");
    const pedido = JSON.parse(localStorage.getItem("pedido"));
  
    if (!pedido) {
      console.log("No hay datos del pedido en localStorage");
      return;
    }
  
    const containerPedido = document.querySelector(".resumenPedido");
  
    if (containerPedido) {
      let resumen = "";
  
      for (let i = 0; i < pedido.length; i++) {
        resumen += `
          <div class="resumen-pedido">
            <div class="descripcion">
              <div class="nombre">
                <h4>${pedido[i].nombre}</h4>
              </div>
              <div class="precio">
                <h4>${pedido[i].precio}<i class="bi bi-currency-euro"></i></h4>
              </div>
              <div class="cantidad">
                <button class="btn" onClick="disminuirCantidad(${i}, ${compraid}, ${pedido[i].productoid})">-</button>
                <h4 class="cantidadProducto">${pedido[i].cantidad}</h4>
                <button class="btn" onClick="aumentarCantidad(${i},${compraid}, ${pedido[i].productoid})">+</button>
              </div>
              <button class="btn btn-eliminar" onClick="eliminarProducto(${i},${compraid}, ${pedido[i].productoid})">Eliminar</button>
            </div>
          </div>`;
      }
  
      resumen += `
        <div class="resumenTotal">
          <h2>TOTAL</h2>
          <h2>${precioFinal}<i class="bi bi-currency-euro"></i></h2>
        </div>
        <div class="botonPagoDiv">
          <button class="botonPago" id="completarCompra" onClick="completarCompra()">Pagar con tarjeta online</button>
        </div>`;
  
      containerPedido.innerHTML = resumen;
    } else {
      console.log('No se encontró ningún elemento con la clase "resumenPedido"');
    }
  }
  
  function completarCompra() {
    // Recuperamos los datos necesarios de los campos de entrada en la web
    const direccionId = localStorage.getItem("direccion_id");
    const precioFinal = localStorage.getItem("precioFinal");
    const tarjetaid = localStorage.getItem("tarjeta_id");
    const compra_finalizada = 1;
    const compraid = localStorage.getItem("compraid");
  
    // Creamos el objeto que vamos a enviar al servidor
    const datos = {
      direccion_id: direccionId,
      precio_final: precioFinal,
      tarjeta_id: tarjetaid,
      compra_finalizada: compra_finalizada,
    };
  
    console.log(datos);
    // Hacemos la solicitud fetch al servidor
    fetch(`${host}/pagoFinal/${compraid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(function (json) {
        alert("Compra finalizada correctamente");
        console.log(json);
        window.location.href = "finalProcesoCompra.html";
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
  
  
