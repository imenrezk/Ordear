const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const multer = require('multer');
const userController = require('../controllers/user.controller')
const subdivisions = require('../utils/subdivisions.json');
const countries = require('../utils/countries.json');
const userModel = require('../models/user.model');
const cuisineData = require('../utils/cuisineData.json');

 
router.use(cookieParser());

const MIME_TYPES = { //définir les types des images a accepter
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
  };
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, './uploads/user/'); //on va stocker les files dans uploads/user
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype]; 
      callback(null, name + Date.now() + '.' + extension);
    }
  });
  
  const upload = multer({storage:storage}).single("image");  

  // ------------- Admin operations ------------------------------
router.post('/addUser', userController.addUser);
router.get('/getAllEmployee', userController.getAllEmployee);
router.get('/getAllResponsable', userController.getAllResponsable);
router.get('/getByIdRes/:id', userController.getResponsableById);
router.get('/getAllEmployeeArchived', userController.getEmployeeArhcieved);
router.get('/getAllEmployee_NotArchived', userController.getEmployee_NotArhcieved);
router.get('/getById/:id', userController.getEmployeeById);
router.put('/enableEmployeeAccount/:id', userController.enableEmployeeAccount);
router.put('/disableEmployeeAccount/:id', userController.disableEmployeeAccount);
router.get('/consulterfalse',userController.consulterReDesenable);
router.get('/consultertrue',userController.consulterResenable);
router.get('/getPrivilegeByEmployee/:idEmployee', userController.getPrivilegeByEmployee);
router.put('/updateEmployee/:id', userController.updateEmployeeById);
router.put('/updatePrivilege/employee/:id', userController.updatePrivilegeEmployeeById);
router.delete('/deleteEmployee/:id', userController.deleteById);
router.put('/archieve/employee/:idEmployee', userController.archieveEmployee);
router.put('/unarchieve/employee/:idEmployee', userController.unarchiveEmployee);
router.post('/addRestaurant', userController.addRestaurant);
router.post('/addRestaurantsuper', userController.addRestaurantsuper);
router.get('/getListRestaurant', userController.getListRestaurant);

router.put('/modifyRestaurant/:restaurantId/:userId', userController.modifyRestaurant);
//--------------- Responsable operations -------------------------
router.get('/getRestaurant', userController.getRestaurant);
router.put('/updateRestaurant', userController.updateRestaurant);

// ------------- other users --------------------------------------
router.put('/updateUserAdmin/:userId', upload, userController.updateUserAdmin);
router.get('/getUser', userController.getUser);
router.put('/updateUserRES/:userId', upload, userController.updateUserRES);
router.put('/updateUser',upload, userController.updateUser);
router.put('/updatePassword', userController.updatePassword);
router.post('/checkPassword',userController.checkOldPassword);
router.post('/sendSMS', userController.sendSMS);
router.put('/updatePhone',userController.updatePhone);
router.post('/resend', userController.resend);
router.post('/updateImage', upload, userController.updateImage);
router.get('/getImage', upload,  userController.getImage);


router.get('/desactivateUser', userController.desactivateUser)
router.get('/utils/citiesByCountry', userController.getCitiesByCountry);
router.get('/utils/citiesByCountryweb', (req, res) => {
  const countriesWithCities = [];

  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const countryName = country.en;
    const cities = [];

    for (let j = 0; j < subdivisions.length; j++) {
      const subdivision = subdivisions[j];

      if (country.alpha2.toLowerCase() === subdivision.country.toLowerCase()) {
        cities.push(subdivision.name);
      }
    }

    countriesWithCities.push({ country: countryName, cities: cities });
  }

  res.json(countriesWithCities);
});
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du propriétaire :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des détails du propriétaire' });
  }
});
//cuisinetype
function afficherCuisinesCallback(cuisines) {
  const result = {};

  for (const cuisine in cuisines) {
    if (Array.isArray(cuisines[cuisine])) {
      result[cuisine] = cuisines[cuisine];
    } else {
      result[cuisine] = afficherCuisinesCallback(cuisines[cuisine]);
    }
  }

  return result;
}

function afficherCuisines(req, res) {
  try {
   
    const cuisinesObject = afficherCuisinesCallback(cuisinesData);
    res.json(cuisinesObject);
  } catch (err) {
    return res.status(500).json({ message: "Something wrong " + err.message });
  }
};
router.get('/utils/typecuisine', afficherCuisines);
// -------------------- All users -----------------------------
router.get('/usersList', userController.findAll);

module.exports = router;
