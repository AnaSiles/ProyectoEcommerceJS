let imagenes = [
  {
    url: "./images/carrusel1.jpg",
    nombre: "Sabor y tradición en cada tarta. ¡Pruébalas!",
    descripcion:
      "Nuestras tartas son un viaje delicioso a las recetas más tradicionales. Cada bocado está lleno de sabores auténticos que te transportarán a la infancia y despertarán tus mejores recuerdos. Descubre el placer de nuestras creaciones y disfruta de la magia que solo una buena tarta puede ofrecer",
  },
  {
    url: "./images/carrusel2.jpg",
    nombre: "Una tarta especial para cada ocasión especial",
    descripcion:
      "Descubre la magia de nuestras exquisitas tartas, diseñadas con amor y cuidado para hacer de cada momento un recuerdo inolvidable. Desde celebraciones a momentos cotidianos, nuestras tartas están hechas para deleitar tus sentidos y endulzar tu vida",
  },
  {
    url: "./images/carrusel3.jpg",
    nombre: "Disfruta de las mejores tartas de cumpleaños",
    descripcion:
      "Celebra momentos especiales con nuestras deliciosas tartas. Cada creación es única y está llena de sabor, perfecta para hacer de tu cumpleaños una experiencia inolvidable. Disfruta de la tradición y la calidad en cada bocado. ¡Prueba nuestras tartas y haz que tu celebración sea aún más especial!",
  },
];

let atrasCarrusel = document.getElementById("atrasCarrusel");
let adelanteCarrusel = document.getElementById("adelanteCarrusel");
let imgCarrusel = document.getElementById("imgCarrusel");
let textoCarrusel = document.getElementById("textoCarrusel");
let puntosCarrusel = document.getElementById("puntosCarrusel");
let actualCarrusel = 0;
posicionCarrusel();

// Añadido para cargar la primera imagen y texto al iniciar la página
imgCarrusel.innerHTML = `<img class="imgCarrusel" src="${imagenes[actualCarrusel].url}" alt="logo pagina" loading="lazy"></img>`;
textoCarrusel.innerHTML = `<h3>${imagenes[actualCarrusel].nombre}</h3>
    <p>${imagenes[actualCarrusel].descripcion}</p>`;

atrasCarrusel.addEventListener("click", () => {
  actualCarrusel -= 1;

  if (actualCarrusel === -1) {
    actualCarrusel = imagenes.length - 1;
  }
  imgCarrusel.innerHTML = `<img class="imgCarrusel" src="${imagenes[actualCarrusel].url}" alt="logo pagina" loading="lazy"></img>`;
  textoCarrusel.innerHTML = `<h3>${imagenes[actualCarrusel].nombre}</h3>
  <p>${imagenes[actualCarrusel].descripcion}</p>`;

  posicionCarrusel();
});

adelanteCarrusel.addEventListener("click", () => {
  actualCarrusel += 1;

  if (actualCarrusel === imagenes.length) {
    actualCarrusel = 0;
  }
  imgCarrusel.innerHTML = `<img class="imgCarrusel" src="${imagenes[actualCarrusel].url}" alt="logo pagina" loading="lazy"></img>`;
  textoCarrusel.innerHTML = `<h3>${imagenes[actualCarrusel].nombre}</h3>
    <p>${imagenes[actualCarrusel].descripcion}</p>`;
  posicionCarrusel();
});

function posicionCarrusel() {
  puntosCarrusel.innerHTML = "";
  for (let i = 0; i < imagenes.length; i++) {
    if (i === actualCarrusel) {
      puntosCarrusel.innerHTML += `<p class="bold">.</p>`;
    } else {
      puntosCarrusel.innerHTML += `<p>.</p>`;
    }
  }
}
