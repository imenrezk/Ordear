const express = require('express');
const router = express.Router();
const avisController = require ("../../controllers/sprint4/avis.controller")

router.post('/add/avis', avisController.addAvis);
router.get('/getAllAvis', avisController.getAllAvis);
router.get('/getById/:id', avisController.getAvisById);
router.get('/getByUser', avisController.getAvisByUser);
router.put('/responseAvis/:id', avisController.responseAvis);
router.post('/addComment/:idAvis', avisController.addCommentToAvis)
router.get('/getComments/:idAvis', avisController.getCommentsByAvis)

module.exports = router;