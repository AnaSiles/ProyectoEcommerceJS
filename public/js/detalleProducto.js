// window.addEventListener("load", detalleProducto);
document.addEventListener("DOMContentLoaded", function () {
  detalleProducto();
});

function detalleProducto() {
  const productoid = localStorage.getItem("productoid");
  const compraid = localStorage.getItem("compraid");
  console.log("ID del producto recuperado:", productoid);

  fetch(`${host}/detalleProducto/${productoid}`)
    .then(function (response) {
      console.log("Respuesta del servidor:", response);
      return response.json();
    })
    .then(function (json) {
      console.log("Datos del producto:", json);

      const containersProducto =
        document.getElementsByClassName("detalleProducto");

      if (containersProducto.length > 0) {
        for (let i = 0; i < containersProducto.length; i++) {
          const containerProducto = containersProducto[i];

          const usuarioIdentificado = localStorage.getItem("nombre");

          containerProducto.innerHTML = `
            <div class="detalle-producto">
              <div class="imagen-producto">
                <img src="${json[0].foto}" alt="${json[0].nombre}"/>
              </div>
              <div class="descripcion-producto">
                <h2 id="nombre">${json[0].nombre}</h2>
                <p id="descripcion">${json[0].descripcion_corta}</p>
                <div class="detalle-precio">
                  <p id="precio">${json[0].precio}</p>
                  <i class="bi bi-currency-euro text-success"></i>
                </div>
                <button id="añadirCarrito" class="btn">Añadir al carrito</button>
              </div>
            </div>
            <div class="detalle-caracteristicas">
              <div class="caracteristicas">
                <h3>Características</h3>
                <p id="caracteristicasTexto">${json[0].caracteristicas}</p>
              </div>
              <div class="especificaciones" id="especificaciones">
                <h3>Especificaciones</h3>
                <!-- Aquí se insertarán las especificaciones -->
              </div>
            </div>
            <div class="opiniones">
              <div class="detalle-opiniones">
                <h3>Opiniones destacadas</h3>
                <button id="verTodas" class="btn">Ver todas las opiniones</button>
              </div>
              <div id="opinion" class="opinion">
                <!-- Aquí se insertarán las opiniones -->
              </div>
            </div>
            <div id="opinionesContainer"></div>
          `;

          const añadirCarritoBtn =
            containerProducto.querySelector("#añadirCarrito");
          if (añadirCarritoBtn) {
            añadirCarritoBtn.addEventListener("click", function () {
              const usuarioIdentificado = localStorage.getItem("nombre");
              if (usuarioIdentificado) {
                anadirCarrito(json[0].id);
              } else {
                alert("Para añadir al carrito, tienes que identificarte.");
              }
            });
          }
        }
      } else {
        console.log(
          'No se encontró ningún elemento con la clase "detalleProducto"'
        );
      }

      cargarEspecificaciones(productoid);

      return fetch(`${host}/valoraciones/${productoid}`);
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (valoraciones) {
      const containerOpinion = document.getElementById("opinionesContainer");
      if (containerOpinion) {
        valoraciones.forEach(function (valoracion) {
          let estrellas = "";
          for (let i = 0; i < valoracion.valoraciones; i++) {
            estrellas += '<span class="estrella">★</span>';
          }
          containerOpinion.innerHTML += `
            <p id="textoOpinion">${valoracion.descripcion}</p>
            <div id="valoracion">
              ${estrellas}
            </div>`;
        });

        cargarOpiniones();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function cargarOpiniones() {
  const opinionesContainer = document.getElementById("opinionesContainer");

  const opiniones = [
    "Excelente servicio, las tartas son deliciosas.",
    "Siempre compro aquí para mis celebraciones, nunca me decepciona.",
    "Buena atención al cliente y entregas rápidas.",
  ];

  opinionesContainer.innerHTML = "";
  for (let i = 0; i < opiniones.length; i++) {
    const opinionDiv = document.createElement("div");
    opinionDiv.classList.add("opinion");
    opinionDiv.textContent = opiniones[i];
    opinionesContainer.appendChild(opinionDiv);

    setInterval(() => cambiarOpiniones(opiniones), 5000);
  }
}

function cambiarOpiniones(opiniones) {
  const opinionesContainer = document.getElementById("opinionesContainer");
  const opinionActual = opinionesContainer.querySelector(".opinion");

  const indexOpinionActual = opiniones.indexOf(opinionActual.textContent);
  const siguienteIndex = (indexOpinionActual + 1) % opiniones.length;

  opinionActual.textContent = opiniones[siguienteIndex];
}

function cargarEspecificaciones(productoid) {
  fetch(`${host}/especificacionesProducto/${productoid}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log("Especificaciones del producto", json);

      const containersEspecificaciones =
        document.getElementsByClassName("especificaciones");

      if (containersEspecificaciones.length > 0) {
        for (let j = 0; j < containersEspecificaciones.length; j++) {
          const containerEspecificaciones = containersEspecificaciones[j];

          let especificacionesHTML = `
          <h3>Especifiaciones</h3>
          <ul>`;
          for (let i = 0; i < json.length; i++) {
            especificacionesHTML += `<li>${json[i].titulo}</li>`;
          }
          especificacionesHTML += `</ul>`;
          containerEspecificaciones.innerHTML = especificacionesHTML;
        }
      } else {
        console.log(
          "No se encontró ningún elemento con la clase 'especificaciones'"
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function anadirCarrito(productoId) {
  let compraid = localStorage.getItem("compraid");
  let usuarioid = localStorage.getItem("usuariosid");
  if (compraid !== null && compraid !== "" && !isNaN(compraid)) {
    compraid = parseInt(compraid);
  } else {
    compraid = null;
  }
  console.log("compraid: ", compraid);
  let cantidad = 1;

  if (compraid == null) {
    console.log("Creando nueva compra...");
    fetch(`${host}/crearCompra/${usuarioid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuarioid: usuarioid }),
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (json) {
        console.log("json: ", json);
        if (json.insertId && !isNaN(json.insertId)) {
          localStorage.setItem("compraid", json.insertId);
          compraid = json.insertId;
        } else {
          console.log("error: insertId is not a number");
        }
        actualizarCarrito(compraid, productoId, cantidad);
        actualizarGlobo();
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  } else {
    actualizarCarrito(compraid, productoId, cantidad);
    actualizarGlobo();
  }
}
