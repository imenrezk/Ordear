const Restaurant = require("../models/restaurant.model");

const RestoController = {
    
    getRestoData : async (req, res) => {
        const restoId = req.params.restoId
        const restaurant = await Restaurant.findById(restoId);
        res.send(restaurant)
    },
    
    retrieveAll: async (req, res) => {
        try {
          req = null;
          await Restaurant.find()
            .then((data) => {
              res.json(data);
            })
            .catch((error) => {
              res.status(400).json({ message: error });
            });
        } catch (error) {
          res.status(500).json({ message: error });
        }
      },


};
module.exports = RestoController;