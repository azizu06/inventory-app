const db = require("../db/queries");
require("dotenv").config();
const { validateCategory, validatePassword } = require("./validators");
const { validationResult } = require("express-validator");

const adminPass = process.env.ADMIN_PASS;

exports.homeGet = async (req, res) => {
  res.render("home");
};

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
    const category = await db.findCategory(Number(id));
    if (!category) {
      return res.status(404).render("categories", {
        categories,
        errors: [{ msg: "Category not found" }],
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("confirmDelete", {
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
