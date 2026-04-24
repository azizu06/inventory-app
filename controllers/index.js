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
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("image")
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

exports.getMsgs = async (req, res) => {
  const messages = await db.getAll();
  res.render("index", { messages });
};

exports.createMsgGet = (req, res) => {
  res.render("form", { errors: [], values: {} });
};

exports.createMsgPost = [
  validateMsgAdd,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(404)
        .render("form", { errors: errors.array(), values: req.body });
    }
    const { author, message } = matchedData(req);
    await db.insertMsg(message, author);
    res.redirect("/");
  },
];

exports.getMsgDetail = async (req, res) => {
  const id = Number(req.params.id);
  const msg = await db.findMsg(id);
  if (!msg) return res.status(404).send("Message not found");
  res.render("msgDetail", { msg });
};
