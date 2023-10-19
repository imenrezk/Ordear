const express = require('express');
const router = express.Router();
const restaurantController = require ("../controllers/restaurant.controller")

router.get ('/retrieve/:restoId' , restaurantController.getRestoData);
router.get ('/retrieveAll' , restaurantController.retrieveAll);

module.exports = router;
