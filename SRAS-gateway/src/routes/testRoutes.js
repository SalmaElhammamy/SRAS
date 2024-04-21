const { Router } = require("express");

const router = Router();

let products = [
  {
    id: 1,
    name: "product 1",
    price: 100,
  },
  {
    id: 2,
    name: "product 2",
    price: 200,
  },
  {
    id: 3,
    name: "product 3",
    price: 300,
  },
];

router.get("/products", (req, res) => {
  try {
    res.send(products).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    const product = products.find((product) => product.id == id);
    if (!product) {
      res.send("Product not found").status(404);
    }
    res.send(product).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.delete("/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    products = products.filter((product) => product.id != id);
    res.send("Product deleted").status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

module.exports = router;
