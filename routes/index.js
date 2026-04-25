const { Router } = require("express");
const router = Router();
const controller = require("../controllers/index.js");

router.get("/", controller.homeGet);

router.get("/products", controller.productsGet);
router.get("/products/new", controller.createProductsGet);
router.post("/products/new", controller.createProductPost);

router.get("/products/:id", controller.viewProductGet);
router.get("/products/:id/edit", controller.editProductGet);
router.post("/products/:id/edit", controller.editProductPost);
router.get("/products/:id/delete", controller.deleteProductGet);
router.post("/products/:id/delete", controller.deleteProductPost);

router.get("/categories", controller.categoriesGet);
router.get("/categories/new", controller.createCategoryGet);
router.post("/categories/new", controller.createCategoryPost);
router.get("/categories/:id/delete", controller.deleteCategoryGet);
router.post("/categories/:id/delete", controller.deleteCategoryPost);

module.exports = router;
