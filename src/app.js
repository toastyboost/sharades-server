const express = require("express");
const http = require("https");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

require("./socket")(server);

server.listen(PORT, () => {
  console.log(`APP started at ${PORT}`);
});
