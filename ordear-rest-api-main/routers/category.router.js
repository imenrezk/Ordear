const express = require('express');
const router = express.Router();
const multer = require('multer');


const _ = require('../controllers/category.controller');
const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png',
    'image/svg':'svg'
};

const storage = multer.diskStorage({
    destination: (callback) =>{
        callback(null, '../uploads/category/');
    },
    filename :(file,callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null,name + Date.now()+ '.'+extension);
    }
});

const upload = multer({ storage: storage }).single("image");

router.post ('/add/:menu', upload, _.addNew);
router.get ('/fetch/enable/:menu', _.retrieveWhereVisibilityIsEqualToENABLE);
router.get ('/fetch/disable/:menu', _.retrieveWhereVisibilityIsEqualToDISABLE);
router.get ('/find/item/:id', _.retrieveById);
router.get('/retrieveall',_.retrieveAll);
router.delete ('/delete/:id', _.deleteById);
router.put ('/update/:id', _.updateById);
router.put ('/update/enable/visibility/:id', _.enableCategoryById);
router.put ('/update/disable/visibility/:id', _.disableCategoryById);
router.put('/update/photo/:id',upload,_.updatePhotoById);
router.get('/find/item/by/menu/:menu', _.retrieveByMenuId);

module.exports = router;

