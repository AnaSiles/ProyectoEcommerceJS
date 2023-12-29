// const host = "http://localhost:8000";

window.addEventListener("load", productos);
window.addEventListener("load", manejarIncioSesion);

function manejarIncioSesion() {
  // Obtiene los elementos del DOM que vamos a necesitar
  const logout = document.getElementById("usuario");
  const carrito = document.getElementById("carrito");
  // Comprueba si el usuario está identificado
  if (localStorage.getItem("nombre")) {
    // Si el usuario está identificado, muestra su nombre y el botón de logout
    logout.innerHTML = `
    <a class="nav-link" href="#">Usuario:
    ${localStorage.getItem("nombre")}</a>
    <a id="logout" class="nav-link" onClick="logoutUser()">Logout</a>`;
    // // Mostramos el botón de carrito
    carrito.style.display = "block";
    // actualizarGlobo();
    // verificarCompra();
  } else {
    // Si el usuario no está identificado, muestra el enlace para iniciar sesión o registrarse
    logout.innerHTML = `<a id="logout" class="nav-link" href="/html/login.html">Accede o regístrate</a>`;
    // Ocultamos el botón del carrito
    carrito.style.display = "none";
  }
}

// let compra_finalizada = 1;

function productos() {
  fetch(`${host}/productos`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerproductos = document.getElementById("productos");

      for (let i = 0; i < json.length; i++) {
        containerproductos.innerHTML += `
            
            <div class="card">
            <img
            src="${json[i].foto}"
            class="card-img-top"
            alt="${json[i].nombre}"
            />
            <div class="card-contenido">
            <div class="d-flex justify-content-between">
            <h5 class="card-titulo">${json[i].nombre}</h5>
            <div>${json[i].precio}<i class="bi bi-currency-euro text-success"></i></div>
            </div>
            <div class="text-secondary">
            <i class="bi bi-star-fill text-success"></i>
            <i class="bi bi-star-fill text-success"></i>
            <i class="bi bi-star-fill text-success"></i>
            <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              </div>
              
              <p class="card-text">
              ${json[i].descripcion_corta}
              </p>
              <div class="d-flex justify-content-between gap-3">
              <button class="btn  w-100" onClick="anadirCarrito(${json[i].id})">Añadir al carrito</button>
              <a href="#" class="btn btn-secondary">Ver</a>
              </div>
              
              </div>`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function anadirCarrito(productoId) {
  let compraid = localStorage.getItem("compraid");
  let usuarioid = localStorage.getItem("usuarioid");
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

function actualizarCarrito(compraid, productoId, cantidad) {
  let usuarioid = localStorage.getItem("usuarioid");

  console.log("usuarioid:", usuarioid); // Añade esto
  console.log("compraid:", compraid); // Añade esto
  console.log("productoId:", productoId); // Añade esto
  console.log("cantidad:", cantidad); // Añade esto

  fetch(`${host}/anadirCarrito/${usuarioid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      compraid: compraid,
      productoid: productoId,
      cantidad: cantidad,
    }),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // Primero obtenemos el texto de la respuesta
    })
    .then(function (text) {
      console.log("Response body:", text); // Imprimimos el texto de la respuesta
      return JSON.parse(text); // Intentamos convertir el texto a JSON
    })
    .then(function (json) {
      alert("Producto añadido con éxito");
      console.log("recargando la pagina");
      carrito();
      actualizarGlobo();
    })
    .catch(function (error) {
      console.log("Error: ", error);
    });
}
