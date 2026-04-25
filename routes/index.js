const { Router } = require("express");
const router = Router();
const productController = require("../controllers/product.js");
const categoryController = require("../controllers/category.js");

router.get("/", categoryController.homeGet);

router.get("/products", productController.productsGet);
router.get("/products/new", productController.createProductsGet);
router.post("/products/new", productController.createProductPost);

router.get("/products/:id", productController.viewProductGet);
router.get("/products/:id/edit", productController.editProductGet);
router.post("/products/:id/edit", productController.editProductPost);
router.get("/products/:id/delete", productController.deleteProductGet);
router.post("/products/:id/delete", productController.deleteProductPost);

router.get("/categories", categoryController.categoriesGet);
router.get("/categories/new", categoryController.createCategoryGet);
router.post("/categories/new", categoryController.createCategoryPost);
router.get("/categories/:id/delete", categoryController.deleteCategoryGet);
router.post("/categories/:id/delete", categoryController.deleteCategoryPost);

module.exports = router;
