// const dotenv = require("dotenv");
// dotenv.config();
// const host = process.env.HOST;

// module.exports = host;

import { config } from "dotenv";
config();
export const host = process.env.HOST;
