const { Router } = require("express");
const router = Router();
const controller = require("../controllers/index.js");

router.get("/", controller.getMsgs);
router.get("/new", controller.createMsgGet);
router.post("/new", controller.createMsgPost);
router.get("/msgs/:id", controller.getMsgDetail);

module.exports = router;
