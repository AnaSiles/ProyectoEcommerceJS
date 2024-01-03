// const host = require("./config");

window.addEventListener("load", () => {
  pintarRegistroDireccion();
  resumenPedido();
  let tarjeta = document.getElementById("numeroTarjeta");
  tarjeta.innerHTML = `${localStorage.getItem("numero_tarjeta")} seleccionada`;
  document
    .getElementById("completarCompra")
    .addEventListener("click", completarCompra);
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
  const usuarioid = localStorage.getItem("usuariosid");

  const direccionEnvio = {
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
  };
  localStorage.setItem("direccionEnvio", JSON.stringify(direccionEnvio));

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
    usuarioid,
  ];
  console.log(camposRegistro);

  for (let i = 0; i < camposRegistro; i++) {
    if (camposRegistro[i] == "") {
      alert("Por favor, rellena todos los campos del formulario");
      return;
    }
  }

  fetch(`${host}/direccion/${usuarioid}`, {
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
      usuarioid,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      alert("Dirección registrada correctamente");
      console.log(json);

      localStorage.setItem("direccion_id", json.direccionId);
      console.log(localStorage.getItem("direccion_id"));
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
  // console.log(precioFinal);
  // console.log(compraid);
  // console.log("Datos del pedido almacenados: ", pedido);
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
        <div class="botonPagoDiv">
       <button class="botonPago" id="completarCompra">Pagar con tarjeta online</button>
    </div>`;
  containerPedido.innerHTML = resumen;
}

function completarCompra() {
  // Recuperamos los datos necesarios de los campos de entrada en la web
  const direccionId = localStorage.getItem("direccion_id");
  const precioFinal = localStorage.getItem("precioFinal");
  const tarjetaid = localStorage.getItem("tarjeta_id");
  const compra_finalizada = 1;
  const compraid = localStorage.getItem("compraid");

  //Creamos el objeto que vamos a enviar al servidor
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
