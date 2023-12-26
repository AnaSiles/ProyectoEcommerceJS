window.addEventListener("load", () => {
  const logout = document.getElementById("usuario");
  if (localStorage.getItem("nombre")) {
    logout.innerHTML = `  <a class="nav-link" href="#">Usuario: ${localStorage.getItem(
      "nombre"
    )}</a>
    <a id="logout" class="nav-link" onClick="logoutUser()">Logout</a>`;
    actualizarGlobo();
  } else {
    logout.innerHTML = `<a id="logout" class="nav-link" href="/html/login.html">Accede o regístrate</a>`;
  }
});

// document.querySelector(".btn").addEventListener("click", login);
// document.getElementById("logout").addEventListener("click", logoutUser);

function login() {
  console.log("Ejecutando login");
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
        console.log("Inicio de sesión ok");
        localStorage.setItem("usuarioid", json[0].id);
        localStorage.setItem("nombre", json[0].nombre);

        carrito();
        actualizarGlobo();
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

function logoutUser() {
  console.log("Ejecutando logoutUser");
  localStorage.removeItem("usuarioid");
  localStorage.removeItem("nombre");

  window.location.href = "../index.html";
  mostrarNombreUsuario();
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
