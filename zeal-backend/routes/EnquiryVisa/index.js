const router = require("express").Router();
const controller = require('../EnquiryVisa/Enquiry')


router.post('/enquiry', controller.addEnquiryVisa)
router.get('/VisagetEnquirys', controller.getEnquiryVisa)

module.exports = router;