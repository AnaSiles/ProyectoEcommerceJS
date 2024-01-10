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

      // Cambiar getElementByClassName por getElementsByClassName
      const containersProducto =
        document.getElementsByClassName("detalleProducto");

      // Verificar si hay elementos con la clase "detalleProducto"
      if (containersProducto.length > 0) {
        // Iterar sobre los elementos encontrados
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
                 <P id="precio">${json[0].precio}</P>
                 <i class="bi bi-currency-euro text-success"></i>
               </div>

              
                   <button id="añadirCarrito" class="btn">Añadir al carrito</button>
                
               
            </div>
     </div>
     <div class="detalle-caracteristicas">
          <div class="caracteristicas">
              <h3>Características</h3>
              <P id="caracteristicasTexto">${json[0].caracteristicas}</P>
          </div>
          <div class="especificaciones" id="especificaciones">
              <h3>Especificaciones</h3>
              <!-- Aquí se insertarán las especificaciones -->
          </div>
     </div>  
            
    <div class="opiniones">
            <div class="detalle-opiniones">
              <h3>Opiniones destacadas</h3>
              <button id="verTodas">Ver todas las opiniones</button>
            </div>
            <div id="opinion">
              <!-- Aquí se insertarán las opiniones -->
            </div>
    </div>
            `;

          const añadirCarritoBtn =
            containerProducto.querySelector("#añadirCarrito");
          if (añadirCarritoBtn) {
            añadirCarritoBtn.addEventListener("click", function () {
              const usuarioIdentificado = localStorage.getItem("nombre");
              if (usuarioIdentificado) {
                // Lógica para añadir al carrito
                anadirCarrito(json[0].id);
              } else {
                // Mostrar un alerta si el usuario no está identificado
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
      const containerOpinion = document.getElementById("opinion");
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
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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
