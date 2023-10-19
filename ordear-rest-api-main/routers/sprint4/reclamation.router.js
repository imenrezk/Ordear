const express = require('express');
const router = express.Router();
const reclamationController = require ("../../controllers/sprint4/reclamation.controller")
const multer = require('multer');

const MIME_TYPES = { //définir les types des images a accepter
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png'
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/reclamation/'); //on va stocker les files dans uploads/user
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]; 
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({storage:storage}).single("image");  

router.post ('/add/reclamation', reclamationController.addReclamation);
router.put('/addImageReclamation', upload, reclamationController.addImageReclamation);
router.get('/getList', reclamationController.getAllReclamations);
router.get('/getListByUser', reclamationController.getAllReclamationsByUser);
router.get('/getNotTretead', reclamationController.getReclamationNotTretead);
router.get('/getById/:id', reclamationController.getReclamationById);
router.get('/getByUser', reclamationController.getReclamationByUser);
router.put('/executeReclamation/:id', reclamationController.executeReclamation)

module.exports = router;