const Menu = require("../models/menu.model");

const menuController = {
  addNew: async (req, res) => {
    try {
      const restaurantFK = req?.params?.restaurantFK;
      const { name } = req.body;
      const newMenu = new Menu({ name, restaurantFK});
      const savedMenu = await newMenu.save();
      return res.status(201).json({ data: savedMenu });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  retrieveAll: async (req, res) => {
    try {
      req = null;
      await Menu.find()
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

  retrieveById: async (req, res) => {
    try {
      const id = req.params.id;
      await Menu.findById(id)
        .then((data) => {
          res.json(data);
        })
        .catch(() => {
          res
            .status(400)
            .json({ error: "Could not find menu with id " + id });
        });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteById: async (req, res) => {
    try {
      const menu = await Menu.findByIdAndDelete(req.params.id);
      if(!menu){
        res.status(404).json({ message: "Could not find any menu with name of "+menu?.name });
      }       
      res.status(200).json({
        message:"This operation has been achieved with success. You have deleted an item with id" +req.params.id+". "
      });
    } catch (error) {
        res.json(error);
    }
  },

  updateById: async (req, res) => {
    try {
      const { name } = req.body;
      const menu = await Menu.findById(req.params.id);
      menu.name = name;
      const saved = await menu.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  enableMenuById: async (req, res) => {
    try {
      const { visibility = "ENABLE" } = req.body;
      const menu = await Menu.findById(req.params.id);
      menu.visibility = visibility;
      const saved = await menu.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  disableMenuById: async (req, res) => {
    try {
      const { visibility = "DISABLE" } = req.body;
      const menu = await Menu.findById(req.params.id);
      menu.visibility = visibility;
      const saved = await menu.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  retrieveWhereVisibilityIsEqualToENABLE: async (req, res) => {
    try {

      
      const restaurantFK = req.params.restaurantFK; 
      await Menu.find({ restaurantFK: restaurantFK ,visibility: "ENABLE" })
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

  retrieveWhereVisibilityIsEqualToDISABLE: async (req, res) => {
    try {

      const restaurantFK = req.params.restaurantFK; 
      await Menu.find({ restaurantFK: restaurantFK ,visibility: "DISABLE" })
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

  retrieveByRestoId: async (req, res) => {
    try {
      const restaurantFK = req.params.restaurantFK; 
      await Menu.find({restaurantFK: restaurantFK})
        .then((data) => {
          if (data) {
            res.json(data);
          } else {
            res.status(400).json({ error: "Could not find menu in this restaurant with id " + restaurantFK });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },  
};

module.exports = menuController;
