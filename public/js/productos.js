const host = "http://localhost:8000";

window.addEventListener("load", productos);

function productos() {
  fetch(`${host}/productos`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerproductos = document.getElementById("productos");

      for (let i = 0; i < json.length; i++) {
        containerproductos.innerHTML += `
            <div class="contenedor d-flex flex-column flex-md-row gap-3 mt-3">
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
              <button class="btn  w-100">Añadir al carrito</button>
              <a href="#" class="btn btn-secondary">Ver</a>
            </div>
          </div>
        </div>`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
