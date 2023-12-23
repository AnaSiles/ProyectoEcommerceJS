const host = require("./config");


window.addEventListener("load", finalizarCompra);
window.addEventListener("load", pintarRegistroTarjeta);

const compraid = localStorage.getItem("compraid");

function finalizarCompra() {
  console.log("finalizarCompra se ha llamado");
  fetch(`${host}/finalizarCompra/${compraid}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerTarjetas = document.getElementById("finalizarCompra");
      let tarjetasHTML = "";
      for (let i = 0; i < json.length; i++) {
        console.log(json[i].id);
        tarjetasHTML += `
        <div class="numeroTarjetas">
        
        <button onclick="guardarTarjeta(${json[i].id},'${json[i].nuevaTarjeta}')">
  <input type="radio" id="tarjeta${json[i].id}" name="tarjeta" value="${json[i].id}" class="miRadio" onClick="seleccionarTarjeta('tarjeta${json[i].id}')">
  <label for="tarjeta${json[i].id}">
    ${json[i].tipo_tarjeta}  ${json[i].nuevaTarjeta}
  </label>
</button>
        
       </div>`;
      }
      tarjetasHTML += `<div class="pagarTarjetas">
      <button onclick="pagarConTarjetaSeleccionada(compraid)">Pagar con esta tarjeta</button>
      </div>`;
      containerTarjetas.innerHTML = tarjetasHTML;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function seleccionarTarjeta(id) {
  // Obtiene todos los botones de radio con el nombre de 'tarjeta'
  let radio = document.getElementsByName("tarjeta");

  // Recorre cada botón de radio
  for (let i = 0; i < radio.length; i++) {
    // Si el id del botón de radio actual es igual al id proporcionado
    if (radio[i].id == id) {
      // Obtiene el botón de radio con el id seleccionado
      let radios = document.getElementById(id);

      // si el botón de radio ya está seleccionao, lo deselecciona
      // So no, lo selecciona
      radios.cheked = !radios.cheked;

      // Si el botón de radio está seleccionado, guarda el id en el localStorage
      if (radio[i].cheked) {
        localStorage.setItem("tarjetaSeleccionada", id);
      } else {
        // Si no está seleccionado, elimina el id del localStorage
        localStorage.removeItem("tarjetaSeleccionada");
      }
    } else {
      // Si no, deselecciona el botón de radio
      radio[i].cheked = false;
    }
  }
}

function guardarTarjeta(idTarjeta, numero) {
  localStorage.setItem("tarjeta_id", idTarjeta);
  localStorage.setItem("numero_tarjeta", numero);
  console.log(idTarjeta, numero);
}

function pagarConTarjetaSeleccionada(compraid) {
  // Aquí recuperamos precioFinal de almacenamiento local para usarlo en datosModificados
  const precioFinal = localStorage.getItem("precioFinal");
  const idTarjeta = localStorage.getItem("tarjetaSeleccionada");

  const datosModificados = {
    tarjetaid: idTarjeta,
    precio_final: precioFinal,
  };

  fetch(`${host}/pagar/${compraid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosModificados),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      alert("Tarjeta seleccionada");
      console.log(json);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function registroTarjeta() {
  const numero_tarjeta = document.getElementById("numero_tarjeta").value;
  const titular_tarjeta = document.getElementById("titular_tarjeta").value;
  const tipo_tarjeta = document.getElementById("tipo_tarjeta").value;
  const caducidad = document.getElementById("caducidad").value;
  const codigo_seguridad = document.getElementById("codigo_seguridad").value;
  const usuarioid = document.getElementById("usuarioid").value;

  const camposRegistro = [
    numero_tarjeta,
    titular_tarjeta,
    tipo_tarjeta,
    caducidad,
    codigo_seguridad,
    usuarioid,
  ];

  for (let i = 0; i < camposRegistro.length; i++) {
    if (camposRegistro[i] == "") {
      alert("Por favor, rellena todos los campos del formulario");
      return;
    }
  }

  fetch(`${host}/anadirTarjeta/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      numero_tarjeta: numero_tarjeta,
      titular_tarjeta: titular_tarjeta,
      tipo_tarjeta: tipo_tarjeta,
      caducidad: caducidad,
      codigo_seguridad: codigo_seguridad,
      usuarioid: usuarioid,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      alert("Tarjeta registrada correctamente");
      console.log(json);
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function pintarRegistroTarjeta() {
  const containerDiv = document.getElementById("registroTarjeta");
  const registroHTML = `
      
      <div class="nueva">
      <input
      
          type="text"
          id="numero_tarjeta"
          placeholder="Número de la tarjeta"
          
      />
      </div>
      
      <div class="nueva">
      <input
          type="text"
          id="titular_tarjeta"
          placeholder="Titular de la tarjeta"
          
      />
      </div>
  
      <div class="nueva">
      <input
          type="text"
          id="tipo_tarjeta"
          placeholder="Tipo de tarjeta"
      />
      </div>
  
      <div class="nueva">
      <input
          type="text"
          id="caducidad"
          placeholder="Caducidad de la tarjeta"
      />
      </div>
  
      <div class="nueva">
      <input
          type="text"
          id="codigo_seguridad"
          placeholder="Código de seguridad"
      />
      </div>
      <div class="nueva">
      <input 
          type="hidden" 
          id="usuarioid" 
          value="2"
      />
      </div>
    
      <div class="pagarTarjetas">
      
      <button onClick="registroTarjeta()">Añadir tarjeta</button>
      </div>
      `;
  containerDiv.innerHTML = registroHTML;
}
