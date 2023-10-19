const express = require('express');
const router = express.Router();
const _ = require('../controllers/menu.controller');
router.post ('/add/:restaurantFK', _.addNew);
router.get ('/retrieve' , _.retrieveAll);
router.get ('/fetch/enable/:restaurantFK', _.retrieveWhereVisibilityIsEqualToENABLE);
router.get ('/fetch/disable/:restaurantFK', _.retrieveWhereVisibilityIsEqualToDISABLE);
router.get ('/find/item/:id', _.retrieveById);
router.delete ('/delete/:id', _.deleteById);
router.put ('/update/:id', _.updateById);
router.put ('/update/enable/visibility/:id', _.enableMenuById);
router.put ('/update/disable/visibility/:id', _.disableMenuById);
router.get('/retrieve/by/resto/:restaurantFK', _.retrieveByRestoId);


module.exports = router;

