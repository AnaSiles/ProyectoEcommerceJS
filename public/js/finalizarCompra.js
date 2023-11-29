const host = "http://localhost:8000";

window.addEventListener("load", finalizarCompra);
window.addEventListener("load", pintarRegistroTarjeta);

function finalizarCompra() {
  fetch(`${host}/finalizarCompra/2`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containnerTarjetas = document.getElementById("finalizarCompra");

      for (let i = 0; i < json.length; i++) {
        console.log(json[i].id);
        containnerTarjetas.innerHTML += `
        <div>
       <label for="tarjeta">
       <input type="text" value=${json[i].nuevaTarjeta}>
       
       <button onclick="pagarIdTarjeta(${json[i].id},2)">Pagar con esta tarjeta</button>
       </label>
      </div>`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function pagarIdTarjeta(idTarjeta, compraid) {
  // Aquí recuperamos precioFinal de almacenamiento local para usarlo en datosModificados
  const precioFinal = localStorage.getItem("precioFinal");
  console.log(precioFinal);
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
      
      <div>
      <input
          type="text"
          id="numero_tarjeta"
          placeholder="Número de la tarjeta"
      />
      </div>
      
      <div>
      <input
          type="text"
          id="titular_tarjeta"
          placeholder="Titular de la tarjeta"
      />
      </div>
  
      <div>
      <input
          type="text"
          id="tipo_tarjeta"
          placeholder="Tipo de tarjeta"
      />
      </div>
  
      <div>
      <input
          type="text"
          id="caducidad"
          placeholder="Caducidad de la tarjeta"
      />
      </div>
  
      <div>
      <input
          type="text"
          id="codigo_seguridad"
          placeholder="Código de seguridad"
      />
      </div>
      <div>
      <input 
          type="hidden" 
          id="usuarioid" 
          value="2"
      />
      </div>
    
      
      
      <button onClick="registroTarjeta()">Añadir tarjeta</button>
      
      `;
  containerDiv.innerHTML = registroHTML;
}
