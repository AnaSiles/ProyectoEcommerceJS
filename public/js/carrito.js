const host = "http://localhost:8000";

window.addEventListener("load", carrito);

function carrito() {
  const compraid = 2;
  fetch(`${host}/carrito/${compraid}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerCarrito = document.getElementById("carrito");
      const containerPrecioFinal = document.getElementById("total");
      let precioFinal = 0;

      for (let i = 0; i < json.length; i++) {
        containerCarrito.innerHTML += `
        <div class="producto">
        <img
          src="${json[i].foto}"
          alt="${json[i].nombre}"
          width="90 %"
        />
        <div class="descripcion">
         <div class="nombre">
          <h4>${json[i].nombre}</h4>
           <div class="precio">
           <p>${json[i].precio}</p>
           <i class="bi bi-currency-euro text-success"></i>
         
           </div>
          </div>
          <div class="cantidad">
          <button class="btn" id="btn-mas" onClick="disminuirCantidad(${json[i].productoid},${compraid})">-</button>
          <p id="cantidad${json[i].productoid}">${json[i].cantidad}</p>
          <button class="btn" id="btn-mas" onClick="incrementarCantidad(${json[i].productoid},${compraid})">+</button>
          <button class="btn" onClick="eliminarProducto(${json[i].productoid},${compraid})">Eliminar</button>
        </div>
      
      </div>
      </div>`;
        if (!isNaN(json[i].precio) && !isNaN(json[i].cantidad)) {
          precioFinal += json[i].precio * json[i].cantidad;
        } else {
          console.log("Error:precio o cantidad no son números", json[i]);
        }
        containerPrecioFinal.innerHTML = `
        <div class="resumen-pedido">
          <h3>Resumen del pedido</h3>
          <p>
            Continua con el proceso de compra para conectar pagar con tu tarjeta
          </p>
          <div>
            <div class="precio">
              <h2>${precioFinal} <i class="bi bi-currency-euro" m-color></i></h2>
            </div>
          </div>
          <div class="botones">
              <a href="../html/finalizarCompra.html" class="btn"
              >Proceder al pago</a
            >
          </div>
        </div>
      
      `;
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

function incrementarCantidad(compraid, productoid) {
  fetch(`${host}/incremento_cantidad/${compraid}/${productoid}`, {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const cantidadProducto = document.getElementById(`cantidad${productoid}`);
      cantidadProducto.innerHTML = json.cantidad;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function disminuirCantidad(compraid, productoid) {
  fetch(`${host}/disminuir_cantidad/${compraid}/${productoid}`, {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const cantidadProducto = document.getElementById(`cantidad${productoid}`);
      cantidadProducto.innerHTML = json.cantidad;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function eliminarProducto(productoid, compraid) {
  fetch(`${host}/eliminarProducto/${productoid}/${compraid}`, {
    method: "DELETE",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      alert("Producto eliminado correctamente");
    });
}
