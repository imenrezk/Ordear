const express = require('express');
const router = express.Router();
const multer = require('multer');


const _ = require('../controllers/product.controller');
const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png',
    'image/svg':'svg'
};

const storage = multer.diskStorage({
    destination: (callback) =>{
        callback(null, '../uploads/product/');
    },
    filename :(file,callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null,name + Date.now()+ '.'+extension);
    }
});

const upload = multer({ storage: storage }).single("image");

router.post ('/add/:categoryFK', upload, _.addNew);
router.get ('/retrieve' , _.retrieveAll);
router.get ('/fetch/enable', _.retrieveWhereVisibilityIsEqualToENABLE);
router.get ('/fetch/disable', _.retrieveWhereVisibilityIsEqualToDISABLE);
router.get ('/find/item/:id', _.retrieveById);
router.delete ('/delete/:id', _.deleteById);
router.put ('/update/:id', _.updateById);
router.put ('/update/enable/visibility/:id', _.enableProductById);
router.put ('/update/disable/visibility/:id', _.disableProductById);
router.put('/update/photo/:id',upload,_.updatePhotoById);
router.get('/retrieve/enabled/products/category/:categoryFK',_.retrieveEnabledProductsByCategory);
module.exports = router;

