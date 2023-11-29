const host = "http://localhost:8000";

window.addEventListener("load", compras);

function compras() {
  fetch(`${host}/compras/2`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerCompras = document.getElementById("compras");
      const containerPrecioFinal = document.getElementById("total");
      let precioFinal = 0;

      for (let i = 0; i < json.length; i++) {
        containerCompras.innerHTML += `
            <div>
          <img
            src="../${json[i].foto}"
            alt="${json[i].nombre}"
            width="90 %"
          />
          <h3>${json[i].nombre}</h3>
          <h4>${json[i].precio}</h4>
          <p>${json[i].cantidad}</p>
          <button class=".btn">Eliminar</button>
        </div>`;
        if (!isNaN(json[i].precio) && !isNaN(json[i].cantidad)) {
          precioFinal += json[i].precio * json[i].cantidad;
        } else {
          console.log("Error:precio o cantidad no son números", json[i]);
        }
        containerPrecioFinal.innerHTML = `<div>
        <h3>Resumen del pedido</h3>
        <p>
        Continua con el proceso de compra para conectar pagar con tu tarjeta
        </p>
        <h2> ${precioFinal}<i class="bi bi-currency-euro" m-color></i></h2>
        <a href="../html/finalizarCompra.html" class=".btn">Proceder al pago</a>
        </div>`;
      }
      //   Es aquí donde guardamos precioFinal en el almacenamiento local
      localStorage.setItem("precioFinal", precioFinal);
      console.log(
        "precioFinal guardado: ",
        localStorage.getItem("precioFinal")
      );
    })
    .catch(function (error) {
      console.log(error);
    });
}
