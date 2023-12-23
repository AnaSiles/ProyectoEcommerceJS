const host = require("./config");


window.addEventListener("load", productos);
// window.addEventListener("load", mostrarNombreUsuario);

// function mostrarNombreUsuario() {
//   console.log("ejecutando mostrarNombreUsuario");
//   const usuario = document.getElementById("usuario");
//   const logout = document.getElementById("logout");
//   const nombre = localStorage.getItem("nombre");
//   console.log("Nombrel del usuario:", nombre);
//   if (usuario && logout) {
//     if (nombre) {
//       usuario.innerHTML = `<a class="nav-link" href="#">Usuario:${nombre}</a>`;
//       logout.style.display = "block";
//       logout.textContent = "Logout";
//       logout.onclick = logoutUser;
//     } else {
//       usuario.innerHTML = `<a class="nav-link active" aria-current="page" href="html/carrito.html">Mis pedidos</a>
//       <a class="nav-link" href="html/login.html">Login</a>`;
//       logout.style.display = "none";
//     }
//   }
// }

let compra_finalizada = 1;

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
  let compraid = parseInt(localStorage.getItem("compraid"));
  let cantidad = 1;

  if (compraid == null) {
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
        localStorage.setItem("compraid", json.insertId);
        compraid = json.insertId;
        actualizarCarrito(compraid, productoId, cantidad);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    actualizarCarrito(compraid, productoId, cantidad);
  }
}

function actualizarCarrito(compraid, productoId, cantidad) {
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
      return response.json();
    })
    .then(function (json) {
      alert("Producto añadido con éxito");
      console.log("recargando la pagina");
      carrito();
    })
    .catch(function (error) {
      console.log(error);
    });
}
