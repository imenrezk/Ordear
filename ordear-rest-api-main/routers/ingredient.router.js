const express = require('express');
const router = express.Router();
const _ = require('../controllers/ingredient.controller');

router.post ('/add/:productFK', _.addNew);
router.get ('/retrieve/:productFK' , _.retrieveAll);
router.get ('/retrieveAll' , _.retrieve);
router.get ('/retrieve/group_by/type' , _.retrieveGroupByType);
router.get ('/find/item/:id', _.retrieveById);
router.delete ('/delete/:id', _.deleteById);
router.put ('/update/:id', _.updateById);
router.get ('/retrieve/disponible/ingredient/by/Product/:productFK' , _.diponibleIngredientByProduct);

module.exports = router;

