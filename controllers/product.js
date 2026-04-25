const db = require("../db/queries");
require("dotenv").config();
const {
  validateCreateProduct,
  validateEditProduct,
  validatePassword,
} = require("./validators");
const { validationResult } = require("express-validator");

const adminPass = process.env.ADMIN_PASS;

exports.productsGet = async (req, res) => {
  const products = await db.getProducts(req.query);
  const categories = await db.getCategories();
  res.render("products", { categories, products, filter: req.query });
};

exports.createProductsGet = async (req, res) => {
  const categories = await db.getCategories();
  res.render("newProduct", { categories, product: {} });
};

exports.createProductPost = [
  validateCreateProduct,
  async (req, res) => {
    const errors = validationResult(req);
    const categories = await db.getCategories();
    if (!errors.isEmpty()) {
      return res.status(400).render("newProduct", {
        errors: errors.array(),
        product: req.body,
        categories,
      });
    }
    try {
      await db.addProduct(req.body);
      res.redirect("/products");
    } catch (err) {
      let msg;
      if (err.code === "23505") {
        msg = "A product with this name already exists.";
      } else {
        msg = "Something went wrong while saving. Please try again.";
      }
      res.render("newProduct", {
        errors: [{ msg }],
        product: req.body,
        categories,
      });
    }
  },
];

exports.editProductGet = async (req, res) => {
  const { id } = req.params;
  const product = await db.findProduct(Number(id));
  if (!product) {
    const categories = await db.getCategories();
    const products = await db.getProducts(req.query);
    return res.status(404).render("products", {
      categories,
      products,
      errors: [{ msg: "Product not found" }],
    });
  }
  const categories = await db.getCategories();
  res.render("productEdit", { categories, product, values: product });
};

exports.editProductPost = [
  validateEditProduct,
  validatePassword,
  async (req, res) => {
    const { id } = req.params;
    const product = await db.findProduct(Number(id));
    const categories = await db.getCategories();
    if (!product) {
      const categories = await db.getCategories();
      const products = await db.getProducts(req.query);
      return res.status(404).render("products", {
        categories,
        products,
        errors: [{ msg: "Product not found" }],
      });
    }
    const errors = validationResult(req);
    const formErrors = errors.array();
    const { password } = req.body || {};
    if (password !== adminPass) formErrors.push({ msg: "Incorrect password." });
    if (formErrors.length > 0) {
      const code = !errors.isEmpty() ? 400 : 403;
      return res.status(code).render("productEdit", {
        errors: formErrors,
        product,
        values: req.body,
        categories,
      });
    }
    await db.editProduct(req.body, id);
    res.redirect("/products");
  },
];

exports.viewProductGet = async (req, res) => {
  const { id } = req.params;
  const product = await db.findProduct(Number(id));
  if (!product) {
    const categories = await db.getCategories();
    const products = await db.getProducts(req.query);
    return res.status(404).render("products", {
      categories,
      products,
      errors: [{ msg: "Product not found" }],
    });
  }
  res.render("productDetail", { product });
};

exports.deleteProductGet = async (req, res) => {
  const { id } = req.params;
  const product = await db.findProduct(Number(id));
  if (!product) {
    const categories = await db.getCategories();
    const products = await db.getProducts(req.query);
    return res.status(404).render("products", {
      categories,
      products,
      errors: [{ msg: "Product not found" }],
    });
  }
  res.render("confirmDelete", { item: product, type: "products" });
};

exports.deleteProductPost = [
  validatePassword,
  async (req, res) => {
    const { id } = req.params;
    const product = await db.findProduct(Number(id));
    if (!product) {
      const categories = await db.getCategories();
      const products = await db.getProducts(req.query);
      return res.status(404).render("products", {
        categories,
        products,
        errors: [{ msg: "Product not found" }],
      });
    }
    const errors = validationResult(req);
    const formErrors = errors.array();
    const { password } = req.body || {};
    if (password !== adminPass) formErrors.push({ msg: "Incorrect password." });
    if (formErrors.length > 0) {
      const code = !errors.isEmpty() ? 400 : 403;
      return res.status(code).render("confirmDelete", {
        errors: formErrors,
        item: product,
        type: "products",
      });
    }
    await db.deleteProduct(Number(id));
    res.redirect("/products");
  },
];
