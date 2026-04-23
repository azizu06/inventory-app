const db = require("../db/queries");
const {
  query,
  body,
  validationResult,
  matchedData,
} = require("express-validator");

const validateMsgAdd = [
  body("author")
    .trim()
    .escape()
    .isLength({ min: 1, max: 10 })
    .withMessage("Username must be between 1 and 10 characters."),
  body("message")
    .trim()
    .escape()
    .isLength({ min: 1, max: 200 })
    .withMessage("Message must be between 1 and 200 characters."),
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
