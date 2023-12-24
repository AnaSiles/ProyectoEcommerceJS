import { host } from "./config.js";

console.log(host);

window.addEventListener("load", carrito);
function verficarCompra() {
  const usuarioid = localStorage.getItem("usuarioid");

  if (!usuarioid) {
    mostrarCarritoVacio();
    return;
  }

  fetch(`${host}/compra/${usuarioid}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (compra) {
      if (compra && compra.id) {
        localStorage.setItem("comprid", compra.id);
        carrito();
      } else {
        mostrarCarritoVacio();
      }
    })
    .catch(function (error) {
      console.log("Error en la petición:", error.message);
    });
}

function mostrarCarritoVacio() {
  const containerCarrito = document.getElementById("carrito");

  containerCarrito.innerHTML = `
      <div class="carrito-vacio">
        <h2>Tu carrito está vacío</h2>
        <p>¡Parece que aún no has añadido ningún producto a tu carrito!</p>
      </div>
    `;
  actualizarGlobo();
}

localStorage.setItem("compraid", compraid);
console.log("compraid guardado:", localStorage.getItem("compraid"));

function carrito() {
  const compraid = localStorage.getItem("compraid");
  console.log("compraid guardado:", compraid);
  fetch(`${host}/carrito/${compraid}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      localStorage.setItem("pedido", JSON.stringify(json));
      console.log(
        "Datos del pedido guardados: ",
        localStorage.getItem("pedido")
      );
      actualizarGlobo();

      const containerCarrito = document.getElementById("carrito");
      const containerPrecioFinal = document.getElementById("total");
      let precioFinal = 0;
      containerCarrito.innerHTML = "";
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
     </div>
     <div class="precio">
       <p>${json[i].precio}</p>
       <i class="bi bi-currency-euro text-success"></i>
     </div>
    
      <div class="cantidad">
      <button class="btn" id="btn-mas" onClick="disminuirCantidad(${compraid},${json[i].productoid})">-</button>
      <p id="cantidad${json[i].productoid}">${json[i].cantidad}</p>
      <button class="btn" id="btn-mas" onClick="incrementarCantidad(${compraid},${json[i].productoid})">+</button>
      <button class="btn" onClick="eliminarProducto(${compraid},${json[i].productoid})">Eliminar</button>
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

function actualizarGlobo() {
  const pedido = JSON.parse(localStorage.getItem("pedido"));
  let totalProductos = 0;
  for (let i = 0; i < pedido.length; i++) {
    totalProductos += pedido[i].cantidad;
  }

  const spanCarrito = document.getElementById("globoCarrito");
  spanCarrito.textContent = totalProductos;
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

      carrito();
      actualizarGlobo();
      resumenPedido(); // Añadido para actualizar el resumen después de cambiar la cantidad
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
      carrito();
      actualizarGlobo();
      resumenPedido(); // Añadido para actualizar el resumen después de cambiar la cantidad
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
      carrito();
      actualizarGlobo();
      resumenPedido(); // Añadido para actualizar el resumen después de cambiar la cantidad
    })
    .catch(function (error) {
      console.log(error);
    });
}
