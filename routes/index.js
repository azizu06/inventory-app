const { Router } = require("express");
const router = Router();
const controller = require("../controllers/index.js");

router.get("/products", controller.productsGet);
router.get("/products/new", controller.createProductsGet);
router.post("/products/new", controller.createProductPost);

router.get("/products/:id", controller.viewProductGet);
router.get("/products/:id/edit", controller.editProductGet);
router.post("/product/:id/edit", controller.editProductPost);
router.post("/product/:id/delete", controller.deleteProductPost);

router.get("/categories", controller.categoriesGet);
router.get("/categories/new", controller.createCategoryGet);
router.post("/categories/new", controller.createCategoryPost);
router.post("/categories/:id/delete", controller.deleteCategoryPost);

module.exports = router;
