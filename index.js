const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./myDb");
const express = require("express");
var cors = require("cors");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY , name VARCHAR(100), description VARCHAR(255))"
  );
});

const app = express();
const port = 8080;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

function getAllProducts(cb) {
  db.serialize(() => {
    db.all("SELECT * FROM products", (err, row) => {
      if (err) console.error(err);
      cb(row);
    });
  });
}

function getProductByID(id, cb) {
  db.serialize(() => {
    db.get(`SELECT * FROM products WHERE id = ${id}`, (err, row) => {
      if (err) console.error(err);
      cb(row);
    });
  });
}

app.get("/product", (req, res) => {
  getAllProducts((data) => {
    res.json(data);
  });
});

app.get("/product/:id", (req, res) => {
  getProductByID(req.params.id, (data) => {
    if (data === undefined) {
      res
        .status(404)
        .json({ error: `Product with id ${req.params.id} could not be found` });
    }
    res.json(data);
  });
});

app.post("/product", (req, res) => {
  if (typeof req.body.name !== "string") {
    res.status(502).json({ error: "Name must be a string" });
    return;
  } else {
    if (req.body.name === "") {
      res.status(502).json({ error: "Name must not be empty string" });
      return;
    }
  }

  if (typeof req.body.description !== "string") {
    res.status(502).json({ error: "description must be a string" });
    return;
  } else {
    if (req.body.description === "") {
      res.status(502).json({ error: "description must not be empty string" });
      return;
    }
  }
  const stmt = db.prepare(
    "INSERT INTO products (name, description) VALUES (?,?)"
  );
  stmt.run(req.body.name, req.body.description);

  res.status(201).json(req.body);
});

app.get("/mock", (req, res) => {
  const stmt = db.prepare(
    "INSERT INTO products (name, description) VALUES (?,?)"
  );

  for (let i = 0; i < 10; i++) {
    stmt.run(`test ${i}`, "this is a description");
  }

  stmt.finalize();
  res.json(true);
});

app.listen(port, () => {
  console.log(`MyFikaList is running on port: ${port}`);
});
