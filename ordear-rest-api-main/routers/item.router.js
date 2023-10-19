const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

router.post ('/addItem/:ingredientFK', itemController.addNewItem);
router.get ('/retrieve/visible/item/by/ingredient/:ingredient' , itemController.getVisibleItemByIngredientId);
router.get ('/retrieveAll' , itemController.getAllItems);
router.get('/find/:id',itemController.getItemById);
router.put ('/updateItem/:itemId', itemController.updateItem);
router.delete ('/deleteItem/:itemId', itemController.deleteItem);
router.put ('/hideItem/:id' , itemController.hideItem);
router.put ('/enableItem/:id', itemController.enableItem);

module.exports = router;

