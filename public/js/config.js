const dotenv = require("dotenv");
dotenv.config();
const host = process.env.HOST;

module.exports = host;
