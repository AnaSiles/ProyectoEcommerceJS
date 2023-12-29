window.addEventListener("load", carrito);

function actualizarGlobo() {
  const pedido = JSON.parse(localStorage.getItem("pedido"));
  let totalProductos = 0;
  for (let i = 0; i < pedido.length; i++) {
    totalProductos += pedido[i].cantidad;
  }

  const spanCarrito = document.getElementById("globoCarrito");
  if (spanCarrito) {
    if (totalProductos) {
      spanCarrito.textContent = totalProductos;
      spanCarrito.style.display = "inline";
    } else {
      spanCarrito.style.display = "none";
    }
  }
}

window.mostrarCarritoVacio = function () {
  const containerCarrito = document.getElementById("globoCarrito");

  if (containerCarrito) {
    globoCarrito.style.display = "none";
  }
  actualizarGlobo();
};

window.mostrarCarritoConCompra = function (cantidad) {
  const globoCarrito = document.getElementById("globoCarrito");

  if (globoCarrito) {
    globoCarrito.textContent = cantidad;
    globoCarrito.style.display = "inline";
  }
};

// localStorage.setItem("compraid", compraid);
// console.log("compraid guardado:", localStorage.getItem("compraid"));

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
      const globoCarrito = document.getElementById("globoCarrito");
      if (globoCarrito) {
        globoCarrito.textContent = json.length;
      }
      actualizarGlobo();

      const containerCarrito = document.getElementById("carrito");
      const containerPrecioFinal = document.getElementById("total");

      if (containerCarrito && containerPrecioFinal) {
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
              <a href="../html/formaPago.html" class="btn"
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
      }
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
