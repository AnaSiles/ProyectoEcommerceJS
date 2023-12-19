var host = "http://localhost:8000";

function login() {
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
        window.location.href = "../index.html";
        usuario.innerHTML = `<a class="nav-link" href="#">Usuario: ${localStorage.getItem(
          "nombre"
        )}${localStorage.getItem("nombre")}</a>`;
      } else {
        console.log("Error en el acceso:datos erroneos");
        alert("Error al inicio de sesión: email o password erróneos");
      }
    })
    .catch(function (error) {
      console.log(error.message);
    });
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
