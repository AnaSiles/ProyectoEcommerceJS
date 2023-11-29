const host = "http://localhost:8000";

window.addEventListener("load", pintarRegistroDireccion);
window.addEventListener("load", resumenPedido);

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
    <div>
      <input
          type="text"
          id="nombre"
          placeholder="Nombre"
      />
      </div>
      <div>
      <input
          type="text"
          id="apellidos"
          placeholder="Apellidos"
      />
      </div>
      <div>
      <input
          type="text"
          id="telefono"
          placeholder="Teléfono"
      />
      </div>
      <div>
      <input
          type="text"
          id="email"
          placeholder="Email"
      />
      </div>
      <div>
      <input
          type="text"
          id="calle"
          placeholder="Calle"
      />
      </div>
      <div>
      <input
          type="text"
          id="numero"
          placeholder="Número"
      />
      </div>
      <div>
      <input
          type="text"
          id="resto_direccion"
          placeholder="Resto dirección"
      />
      </div>
      <div>
      <input
          type="text"
          id="poblacion"
          placeholder="Población"
          />
          </div>
          <div>
          <input
              type="text"
              id="cp"
              placeholder="Código Postal"
          />
          </div>
      <div>
      <input
          type="text"
          id="provincia"
          placeholder="Provincia"
      />
      </div>
      <div>
      <input
          type="text"
          id="pais"
          placeholder="País"
      />
      </div>
     

      <button onClick="registroDireccion()">Añadir Dirección</button>
    `;
  containnerDiv.innerHTML = registroHTML;
}

function resumenPedido() {
  const precioFinal = localStorage.getItem("precioFinal");
  console.log(precioFinal);
  fetch(`${host}/compras/2`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerPedido = document.getElementById("resumenPedido");
      let resumen = "";

      for (let i = 0; i < json.length; i++) {
        resumen += `
          <div>
          <h3>${json[i].nombre}</h3>
          <h4>${json[i].precio}</h4>
          <p>${json[i].cantidad}</p>
          <button class=".btn">Eliminar</button>
          </div>`;
      }
      resumen += `<h3>Resumen del pedido</h3>
        <p>
        TOTAL
        </p>
        <h2> ${precioFinal}<i class="bi bi-currency-euro" m-color></i></h2>
        <a href="../html/finalizarCompra.html" class=".btn">Proceder al pago</a>`;
      containerPedido.innerHTML = resumen;
    })
    .catch(function (error) {
      console.log(error);
    });
}
