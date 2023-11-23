const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/hello", (request, response) => {
  response.send({ message: "hello world!!" });
});

app.listen(8000, () => {
  console.log("API up and running!");
});
