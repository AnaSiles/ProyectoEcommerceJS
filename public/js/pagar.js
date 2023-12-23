const host = require("./config");

window.addEventListener("load", () => {
  pintarRegistroDireccion();
  resumenPedido();
  let tarjeta = document.getElementById("numeroTarjeta");
  tarjeta.innerHTML = `${localStorage.getItem("numero_tarjeta")} seleccionada`;
});

function registroDireccion() {
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;
  const calle = document.getElementById("calle").value;
  const numero = document.getElementById("numero").value;
  const resto_direccion = document.getElementById("resto_direccion").value;
  const poblacion = document.getElementById("poblacion").value;
  const cp = document.getElementById("cp").value;
  const provincia = document.getElementById("provincia").value;
  const pais = document.getElementById("pais").value;

  const camposRegistro = [
    nombre,
    apellidos,
    telefono,
    email,
    calle,
    numero,
    resto_direccion,
    poblacion,
    cp,
    provincia,
    pais,
  ];
  console.log(camposRegistro);

  for (let i = 0; i < camposRegistro; i++) {
    if (camposRegistro[i] == "") {
      alert("Por favor, rellena todos los campos del formulario");
      return;
    }
  }

  fetch(`${host}/direccion/2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      apellidos: apellidos,
      telefono: telefono,
      email: email,
      calle: calle,
      numero: numero,
      resto_direccion: resto_direccion,
      poblacion: poblacion,
      cp: cp,
      provincia: provincia,
      pais: pais,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      alert("Dirección registrada correctamente");
      console.log(json);
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function pintarRegistroDireccion() {
  const containnerDiv = document.getElementById("registroDireccion");
  const registroHTML = `
    <div class="nueva">
      <input
          type="text"
          id="nombre"
          placeholder="Nombre"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="apellidos"
          placeholder="Apellidos"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="telefono"
          placeholder="Teléfono"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="email"
          placeholder="Email"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="calle"
          placeholder="Calle"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="numero"
          placeholder="Número"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="resto_direccion"
          placeholder="Resto dirección"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="poblacion"
          placeholder="Población"
          />
          </div>
          <div class="nueva">
          <input
              type="text"
              id="cp"
              placeholder="Código Postal"
          />
          </div>
      <div class="nueva">
      <input
          type="text"
          id="provincia"
          placeholder="Provincia"
      />
      </div>
      <div class="nueva">
      <input
          type="text"
          id="pais"
          placeholder="País"
      />
      </div>
     <div class="pagarTarjetas">

      <button onClick="registroDireccion()">Añadir Dirección</button>
      </div>
    `;
  containnerDiv.innerHTML = registroHTML;
}

function resumenPedido() {
  const precioFinal = localStorage.getItem("precioFinal");
  const compraid = localStorage.getItem("compraid");
  const pedido = JSON.parse(localStorage.getItem("pedido"));
  console.log(precioFinal);
  console.log(compraid);
  console.log("Datos del pedido almacenados: ", pedido);
  if (!pedido) {
    console.log("No hay datos del pedido en localStorage");
    return;
  }
  console.log("Datos del pedido recuperados: ", pedido);
  const containerPedido = document.getElementById("resumenPedido");
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
          <button class="btn" id="btn-menos" onClick="disminuirCantidad(${i}, ${compraid}, ${pedido[i].productoid}">-</button>
          <h4 id="cantidad${pedido[i].productoid}">${pedido[i].cantidad}</h4>
          <button class="btn" id="btn-mas" onClick="aumentarCantidad"(${i},${compraid}, ${pedido[i].productoid}) >+</button>
          </div>
          <button class="btn btn-eliminar" onClick="eliminarProducto(${i},${compraid}, ${pedido[i].productoid}">Eliminar</button>
          </div>
          </div>`;
  }
  resumen += `
  <div class="resumenTotal">
        <h2>
        TOTAL
        </h2>
        <h2> ${precioFinal}<i class="bi bi-currency-euro"></i></h2>
        </div>
        <div class="botonPago">
        <a href="../html/finalizarCompra.html" class="btn"
        >Pagar con tarjeta online</a
      >
    </div>`;
  containerPedido.innerHTML = resumen;
}
