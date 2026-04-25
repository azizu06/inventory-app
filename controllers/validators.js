const { body } = require("express-validator");

exports.validateCreateProduct = [
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
exports.validateEditProduct = [
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
];

exports.validateCategory = [
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

exports.validatePassword = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Password must be between 1 and 100 characters."),
];
