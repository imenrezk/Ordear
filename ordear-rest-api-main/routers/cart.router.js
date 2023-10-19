const express = require('express');
const router = express.Router();
const _ = require ("../controllers/cart.controller")

router.post ('/addProdductToCart', _.addtocart);

router.put ('/increase/quantity/Cart/Trash/:idCartTrash/:productFK' , _.increasequantityProductInCartTrash);
router.put ('/increase/quantity/Cart/Order/:productFK' , _.increasequantityProductInCartOrder);
router.put ('/decrease/quantity/Cart/Trash/:idCartTrash/:productFK' , _.decreasequantityProductInCartTrash);
router.put ('/decrease/quantity/Cart/Order/:productFK' , _.decreasequantityProductInCartOrder);

router.delete ('/remove/:id' , _.removefromcart);
router.delete ('/clear' , _.clearcart);
router.get('/get/cartTrash/by/user', _.getCartTrashByUser)
router.get('/get/cartOrder/by/user', _.getCartOrderByUser)
router.delete('/delete/product/:productId', _.deleteProductById);

module.exports = router;