const router = require("express").Router();
const AdminAuth = require("../../middlewares/AdminAuth");
const upload = require("../../middlewares/multerConfig");
const controller = require('./holidays')

router.get('/', controller.get);
router.get('/slug/:slug', controller.getBySlug);
router.get('/:id', controller.getSingle);

router.post(
    '/',
    AdminAuth,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'itineraryImages', maxCount: 10 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'pdf', maxCount: 5 }
    ]),
    controller.add
);

router.put(
    '/:id',
    AdminAuth,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'itineraryImages', maxCount: 10 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'pdf', maxCount: 5 }
    ]),
    controller.update
);

router.delete('/:id', AdminAuth, controller.delete);


module.exports = router;