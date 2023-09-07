const express = require("express");
var cors = require("cors");

const app = express();
const port = 8080;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`MyFikaList is running on port: ${port}`);
});
