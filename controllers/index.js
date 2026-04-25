const db = require("../db/queries");
const {
  validateCategory,
  validateCreateProduct,
  validateEditProduct,
} = require("./validators");
const { validationResult } = require("express-validator");

exports.homeGet = async (req, res) => {
  res.render("home");
};

exports.productsGet = async (req, res) => {
  const products = await db.getProducts(req.query);
  const categories = await db.getCategories();
  res.render("products", { categories, products });
};

exports.createProductsGet = async (req, res) => {
  const categories = await db.getCategories();
  res.render("newProduct", { categories, product: {} });
};

exports.createProductPost = [
  validateCreateProduct,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await db.getCategories();
      return res.status(400).render("newProduct", {
        errors: errors.array(),
        product: req.body,
        categories,
      });
    }
    await db.addProduct(req.body);
    res.redirect("/products");
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
    await db.addCategory(req.body);
    res.redirect("/categories");
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
      const categories = await db.getCategories();
      return res.status(400).render("productEdit", {
        errors: errors.array(),
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

exports.deleteProductPost = async (req, res) => {
  const { id } = req.params;
  const product = await db.deleteProduct(Number(id));
  if (!product) {
    const categories = await db.getCategories();
    const products = await db.getProducts(req.query);
    return res.status(404).render("products", {
      categories,
      products,
      errors: [{ msg: "Product not found" }],
    });
  }
  res.redirect("/products");
};

exports.deleteCategoryPost = async (req, res) => {
  const { id } = req.params;
  try {
    await db.deleteCategory(Number(id));
    res.redirect("/categories");
  } catch (err) {
    const categories = await db.getCategories();
    res.render("categories", {
      categories,
      errors: [
        {
          msg: "Cannot delete this category yet. Remove or reassign its products first.",
        },
      ],
    });
  }
};
