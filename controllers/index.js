const db = require("../db/queries");
const {
  query,
  body,
  validationResult,
  matchedData,
} = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be between 2 and 200 characters."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater or equal to 0."),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a number greater or equal to 0."),
  body("brand")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Brand must be a max of 200 characters."),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be a max of 500 characters."),
  body("category_id").trim().notEmpty().withMessage("Category is required"),
  body("image_url")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL."),
];

const validateCategory = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be between 2 and 200 characters."),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be a max of 500 characters."),
];

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
  validateProduct,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(404)
        .render("newProduct", { errors: errors.array(), product: req.body });
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
        .status(404)
        .render("newCategory", { errors: errors.array(), category: req.body });
    }
    await db.addCategory(req.body);
    res.redirect("/categories");
  },
];

exports.editProductGet = async (req, res) => {
  const { id } = req.params;
  const product = await db.findProduct(Number(id));
  const categories = await db.getCategories();
  res.render("productEdit", { categories, product, values: product });
};

exports.editProductPost = [
  validateProduct,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { id } = req.params;
      const categories = await db.getCategories();
      const product = await db.findProduct(Number(id));

      return res.status(404).render("productEdit", {
        errors: errors.array(),
        product,
        values: req.body,
        categories,
      });
    }
    const { id } = req.params;
    await db.editProduct(req.body, id);
    res.redirect("/products");
  },
];

exports.viewProductGet = async (req, res) => {
  const { id } = req.params;
  const product = await db.findProduct(Number(id));
  res.render("productDetail", { product });
};

exports.deleteProductPost = async (req, res) => {
  const { id } = req.params;
  await db.deleteProduct(Number(id));
  res.redirect("/products");
};

exports.deleteCategoryPost = async (req, res) => {
  const { id } = req.params;
  await db.deleteCategory(Number(id));
  res.redirect("/categories");
};
