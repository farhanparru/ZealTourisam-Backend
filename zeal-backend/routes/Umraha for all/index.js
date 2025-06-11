const router = require("express").Router();
const AdminAuth = require("../../middlewares/AdminAuth");
const upload = require("../../middlewares/multerConfig");
const controller = require('./umraha');

router.get('/', controller.get);

router.get('/:id', controller.getSingle);

// Route to get data by slug
router.get('/slug/:slug', controller.getBySlug);

router.post(
    '/',
    AdminAuth,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'pdf', maxCount: 5 },
        { name: 'detailsImage', maxCount: 10 }
    ]),
    controller.add
);

router.put(
    '/:id',
    AdminAuth,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'pdf', maxCount: 5 }
    ]),
    controller.update
);

router.delete('/:id', AdminAuth, controller.delete);

module.exports = router;
