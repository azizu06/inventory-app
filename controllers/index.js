const db = require("../db/queries");
require("dotenv").config();
const {
  validateCategory,
  validateCreateProduct,
  validateEditProduct,
  validatePassword,
} = require("./validators");
const { validationResult } = require("express-validator");

const adminPass = process.env.ADMIN_PASS;

exports.homeGet = async (req, res) => {
  res.render("home");
};

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

exports.categoriesGet = async (req, res) => {
  const categories = await db.getCategories();
  res.render("categories", { categories });
};

exports.createCategoryGet = async (req, res) => {
  res.render("newCategory", { category: {} });
};

exports.createCategoryPost = [
  validateCategory,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("newCategory", { errors: errors.array(), category: req.body });
    }
    try {
      await db.addCategory(req.body);
      res.redirect("/categories");
    } catch (err) {
      let msg;
      if (err.code === "23505") {
        msg = "A category with this name already exists.";
      } else {
        msg = "Something went wrong while saving. Please try again.";
      }
      res.render("newCategory", {
        errors: [{ msg }],
        category: req.body,
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
    const errors = validationResult(req);
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
    if (!errors.isEmpty()) {
      return res.status(400).render("productEdit", {
        errors: errors.array(),
        product,
        values: req.body,
        categories,
      });
    }
    const { password } = req.body;
    if (password !== adminPass) {
      return res.status(403).render("productDetail", {
        product,
        errors: [{ msg: "Incorrect password." }],
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
    const errors = validationResult(req);
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
    if (!errors.isEmpty()) {
      return res.status(404).render("confirmDelete", {
        errors: errors.array(),
        item: product,
        type: "products",
      });
    }
    const { password } = req.body || {};
    if (password !== adminPass) {
      return res.status(403).render("productDetail", {
        product,
        errors: [{ msg: "Incorrect password." }],
      });
    }
    await db.deleteProduct(Number(id));
    res.redirect("/products");
  },
];

exports.deleteCategoryGet = async (req, res) => {
  const { id } = req.params;
  const category = await db.findCategory(Number(id));
  if (!category) {
    const categories = await db.getCategories();
    return res.status(404).render("categories", {
      categories,
      errors: [{ msg: "Category not found" }],
    });
  }
  res.render("confirmDelete", { item: category, type: "categories" });
};

exports.deleteCategoryPost = [
  validatePassword,
  async (req, res) => {
    const { id } = req.params;
    const categories = await db.getCategories();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const category = await db.findCategory(Number(id));
      return res.status(404).render("confirmDelete", {
        errors: errors.array(),
        item: category,
        type: "categories",
      });
    }
    const { password } = req.body || {};
    if (password !== adminPass) {
      return res.status(403).render("categories", {
        categories,
        errors: [{ msg: "Incorrect password." }],
      });
    }
    try {
      await db.deleteCategory(Number(id));
      res.redirect("/categories");
    } catch (err) {
      res.render("categories", {
        categories,
        errors: [
          {
            msg: "Cannot delete this category yet. Remove or reassign its products first.",
          },
        ],
      });
    }
  },
];
