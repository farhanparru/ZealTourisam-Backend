const router = require("express").Router();
const controller = require('./enquire')
const AdminAuth = require("../../../middlewares/AdminAuth");

router.post('/',AdminAuth, controller.addEnquiryUmraha)
router.get('/umrahEnquire',AdminAuth, controller.getEnquiryUmraha)


module.exports = router;