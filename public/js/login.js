window.addEventListener("load", () => {
  const logout = document.getElementById("usuario");
  if (localStorage.getItem("nombre")) {
    logout.innerHTML = `  <a class="nav-link" href="#">Usuario: ${localStorage.getItem(
      "nombre"
    )}</a>
    <a id="logout" class="nav-link" onClick="logoutUser()">Logout</a>`;
    // actualizarGlobo();
    verificarCompra();
  } else {
    logout.innerHTML = `<a id="logout" class="nav-link" href="/html/login.html">Accede o regístrate</a>`;
  }
});

function login() {
  // console.log("Ejecutando login");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch(`${host}/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      if (json.length > 0) {
        // console.log("Inicio de sesión ok");
        localStorage.setItem("usuariosid", json[0].id);
        console.log(
          "usuariosid guardado: ",
          localStorage.getItem("usuariosid")
        );
        localStorage.setItem("nombre", json[0].nombre);

        verificarCompra();
        // carrito();
        // actualizarGlobo();
        window.location.href = "../index.html";
      } else {
        console.log("Error en el acceso:datos erroneos");
        alert("Error al inicio de sesión: email o password erróneos");
      }
    })
    .catch(function (error) {
      console.log("Error en la petición:", error.message);
    });
}

function verificarCompra() {
  // Recupera el 'usuarioid' del almacenamiento locla. Este es el ID del usuario que ha iniciado sesión.
  const usuarioid = localStorage.getItem("usuariosid");
  console.log("usuarioid recuperado: ", localStorage.getItem("usuarioid"));
  // Si no hay un 'usuarioid'(es decir, si hay un usuario que haya iniciado sesión), muestra el carrito vacío y terminal función
  if (!usuarioid) {
    mostrarCarritoVacio();
    return;
  }
  // Si hay un 'usuarioid', hace una solicitud al servidor para obtener los detalles de la compra del usuario
  fetch(`${host}/compras/${usuarioid}`)
    .then(function (response) {
      // Convierte la respuesta del servidor en un objeto JSON
      return response.json();
    })
    .then(function (compra) {
      // Si la respuesta incluye una compra y u ID de compra, guarda el ID de la compra en el almacenamiento local, actualiza el carrito y el globo del carrito
      if (compra && compra.id) {
        localStorage.setItem("compraid", compra.id);
        console.log("compraid guardado:", localStorage.getItem("compraid"));
        carrito();
        actualizarGlobo();
      }
    })
    .catch(function (error) {
      console.log("Error en la petición:", error.message);
    });
}

function logoutUser() {
  console.log("Ejecutando logoutUser");
  localStorage.removeItem("usuariosid");
  localStorage.removeItem("nombre");

  window.location.href = "../index.html";

  actualizarGlobo();
}

function registroCliente() {
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const email = document.getElementById("emailRegistro").value;
  const contrasena = document.getElementById("contrasenaRegistro").value;

  const camposRegistro = [nombre, apellidos, email, contrasena];

  for (let i = 0; i < camposRegistro.length; i++) {
    if (camposRegistro[i] == "") {
      alert("Por favor, rellena todos los campos del formulario");
    }
  }
  fetch(`${host}/registro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      apellidos: apellidos,
      email: email,
      contrasena: contrasena,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      alert("Usuario registrado correctamente");
      console.log(json);
      window.location.href = "../index.html";
    })
    .catch(function (error) {
      console.log(error.message);
    });
}
