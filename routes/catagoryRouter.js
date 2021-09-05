const router = require("express").Router();
const catagoryCtrl = require("../controllers/catagoryCtrl");
// const auth = require("../middleware/auth");
// const authAdmin = require("../middleware/authAdmin");

router.route("/catagory").get(catagoryCtrl.getAllCatagory);

module.exports = router;
