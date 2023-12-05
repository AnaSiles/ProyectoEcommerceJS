const express = require("express");
const app = express();
const mysql = require("mysql2");

app.use(express.static("public"));

//Avisa de que cuandovenga información del body, venga en formato JSON
app.use(express.json());

// Crear conexion con mysql

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Asr020379",
  database: "mi_base_de_datos_ecommerce",
});

// Conectar con mysql

connection.connect(function (error) {
  if (error) {
    return console.error(`error:${error.message}`);
  }
  console.log("Conectado a MySQL");
});
// Enpoint de carritos

app.get("/carrito/:id", function (request, response) {
  connection.query(
    `SELECT compras.id, productos.nombre, productos.precio, productos.foto, compraproducto.cantidad, productos.id AS productoid FROM compras JOIN compraproducto ON compras.id=compraproducto.compraid JOIN productos ON productos.id=compraproducto.productoid WHERE compras.id=${request.params.id}`,
    (error, result, fields) => {
      if (error) {
        response.status(400).send(`${error.message}`);
        return;
      }
      response.send(result);
      console.log("Obtiene los datos de la compra con el :id");
    }
  );
});
// SELECT compras.id, productos.nombre, productos.precio, productos.foto, compraproducto.cantidad FROM compras JOIN compraproducto ON compras.id=compraproducto.compraid JOIN productos ON productos.id=compraproducto.productoid WHERE compras.id=1;

// Endpoints para aumentar y disminuir cantidad

app.post(
  "/incremento_cantidad/:compraid/:productoid",
  function (request, response) {
    console.log("ID del producto recibido: ", request.params.productoid);
    console.log("ID de la compra recibida: ", request.params.compraid);
    connection.query(
      `SELECT cantidad FROM compraproducto WHERE compraid=${request.params.compraid} AND productoid=${request.params.productoid}`,
      (error, result, fields) => {
        if (error) {
          response.status(400).send(`${error.message}`);
          return;
        }

        let cantidad = result[0].cantidad;
        ++cantidad;

        console.log(cantidad);
        connection.query(
          `UPDATE compraproducto SET cantidad=${cantidad} WHERE compraid=${request.params.compraid} AND productoid=${request.params.productoid}`,
          (error, result, fields) => {
            if (error) {
              response.status(400).send(`${error.message}`);
              return;
            }
            response.send({ cantidad: cantidad });
            console.log("Cantidad incrementada correctamente");
          }
        );
      }
    );
  }
);

app.post(
  "/disminuir_cantidad/:compraid/:productoid",
  function (request, response) {
    console.log("ID del producto recibido: ", request.params.productoid);
    console.log("ID de la compra recibida: ", request.params.compraid);
    connection.query(
      `SELECT cantidad FROM compraproducto WHERE compraid=${request.params.compraid} AND productoid=${request.params.productoid}`,
      (error, result, fields) => {
        if (error) {
          response.status(400).send(`${error.message}`);
          return;
        }

        let cantidad = result[0].cantidad;
        --cantidad;

        console.log(cantidad);
        connection.query(
          `UPDATE compraproducto SET cantidad=${cantidad} WHERE compraid=${request.params.compraid} AND productoid=${request.params.productoid}`,
          (error, result, fields) => {
            if (error) {
              response.status(400).send(`${error.message}`);
              return;
            }
            response.send({ cantidad: cantidad });
            console.log("Cantidad disminuida correctamente");
          }
        );
      }
    );
  }
);

// Endpoint de eliminar producto

app.delete(
  "/eliminarProducto/:productoid/:compraid",
  function (request, response) {
    connection.query(
      `DELETE FROM compraproducto WHERE productoid=${request.params.productoid} AND compraid=${request.params.compraid}`,
      (error, result, fields) => {
        if (error) {
          response.status(400).send(`${error.message}`);
          return;
        }
        response.send(result);
        console.log("Artículo eliminado");
      }
    );
  }
);

// Endpoint formas_pago
app.get("/finalizarCompra/:id", function (request, response) {
  connection.query(
    `SELECT formas_pago.id,formas_pago.tipo_tarjeta, formas_pago.numero_tarjeta, formas_pago.usuarioid FROM formas_pago where formas_pago.usuarioid=${request.params.id}`,

    (error, result, fields) => {
      if (error) {
        response.status(400).send(`error:${error.message}`);
        return;
      }
      for (let i = 0; i < result.length; i++) {
        let nuevaTarjeta = "";
        for (let j = 0; j < result[i].numero_tarjeta.length; j++) {
          if (j < 12) {
            nuevaTarjeta += "*";
          } else {
            nuevaTarjeta += result[i].numero_tarjeta[j];
          }
        }
        result[i].nuevaTarjeta = nuevaTarjeta;
      }
      response.send(result);
      console.log(result);
    }
  );
});

// Endpoint para seleccionar el id de la tarjeta

app.post("/pagar/:compraid", function (request, response) {
  console.log("ID de la tarjeta recibido:", request.body.tarjetaid);
  console.log("ID de la compra recibido:", request.params.compraid);
  console.log("Precio final:", request.body.precio_final);
  connection.query(
    `UPDATE compras SET tarjetaid=${request.body.tarjetaid}, precio_final=${request.body.precio_final} where id=${request.params.compraid}`,
    (error, result, fields) => {
      if (error) {
        response.status(400).send(`error:${error.message}`);
        return;
      }
      response.send(result);
      console.log("Tarjeta seleccionada correctamente");
    }
  );
});

app.post("/anadirTarjeta/:usuarioid", function (request, response) {
  let numero_tarjeta = request.body.numero_tarjeta;
  let titular_tarjeta = request.body.titular_tarjeta;
  let tipo_tarjeta = request.body.tipo_tarjeta;
  let caducidad = request.body.caducidad;
  let codigo_seguridad = request.body.codigo_seguridad;
  let usuarioid = request.body.usuarioid;

  console.log("numero_tarjeta:", numero_tarjeta);
  console.log("titular_tarjeta:", titular_tarjeta);
  console.log("tipo_tarjeta:", tipo_tarjeta);
  console.log("caducidad:", caducidad);
  console.log("codigo_seguridad:", codigo_seguridad);
  console.log("usuarioid:", usuarioid);

  connection.query(
    `INSERT INTO formas_pago (numero_tarjeta, titular_tarjeta, tipo_tarjeta, caducidad, codigo_seguridad, usuarioid) VALUES ('${numero_tarjeta}', '${titular_tarjeta}', '${tipo_tarjeta}', '${caducidad}', '${codigo_seguridad}',${usuarioid})`,
    (error, result, fields) => {
      if (error) {
        response.status(400).send(`error:${error.message}`);
        return;
      }
      response.send({ message: "Tarjeta añadida" });
    }
  );
  console.log("Insertar tarjeta en base de datos");
});

app.post("/direccion/:usuarioid", function (request, response) {
  console.log(request.body);
  let nombre = request.body.nombre;
  let apellidos = request.body.apellidos;
  let telefono = request.body.telefono;
  let email = request.body.email;
  let calle = request.body.calle;
  let numero = request.body.numero;
  let resto_direccion = request.body.resto_direccion;
  let poblacion = request.body.poblacion;
  let cp = request.body.cp;
  let provincia = request.body.provincia;
  let pais = request.body.pais;
  let usuarioid = request.params.usuarioid;
  console.log(request.body);

  connection.query(
    `INSERT INTO direccion_envio (nombre, apellidos, telefono, email, calle, numero, resto_direccion, poblacion, cp, provincia, pais, usuarioid)VALUES ('${nombre}','${apellidos}','${telefono}','${email}','${calle}','${numero}','${resto_direccion}','${poblacion}',${cp}, '${provincia}','${pais}',${usuarioid})`,
    (error, result, fields) => {
      if (error) {
        response.status(400).send(`error:${error.message}`);
        return;
      }
      response.send({ message: "direccion añadida" });
    }
  );
});

// Endpoint de productos

app.get("/productos", function (request, response) {
  connection.query(
    `SELECT nombre, descripcion_corta, precio, valoraciones, foto FROM productos`,
    (error, result, fields) => {
      if (error) {
        response.status(400).send(`${error.message}`);
        return;
      }
      response.send(result);
      console.log("Obtiene los datos de todos los productos");
    }
  );
});

// Generar la llamada al puerto
app.listen(8000, () => {
  console.log("API up and running!");
});
