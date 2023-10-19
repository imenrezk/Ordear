const fs = require("fs");
const path = require("path");
const Category = require("../models/category.model");

const categoryController = {
  addNew: async (req, res) => {
    try {
      const menu = req.params.menu;
      const { libelle, description, photo} = req.body;
      const newCategory = new Category({ libelle, description, photo, menu });
      const savedCategory = await newCategory.save();
      return res.status(201).json({ data: savedCategory });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  retrieveAll: async (req, res) => {
    try {
      req = null;
      await Category.find()
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

  retrieveByMenuId: async (req, res) => {
    try {
      const menu = req.params.menu;
      await Category.find({menu : menu})
        .then((data) => {
          if (data) {
            res.json(data);
          } else {
            res.status(400).json({ error: "Could not find category in this menu with id " + menu });
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


  retrieveById: async (req, res) => {
    try {
      const id = req.params.id;
      await Category.findById(id)
        .then((data) => {
          res.json(data);
        })
        .catch(() => {
          res
            .status(400)
            .json({ error: "Could not find category with id " + id });
        });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteById: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if(!category){
        res.status(404).json({ message: "Could not find any category with name of "+category?.libelle });
      }
      fs.unlinkSync(path.join(__dirname,"../uploads/category/", category?.photo));
       
      res.status(200).json({
        message:"This operation has been achieved with success. You have deleted an item with id" +req.params.id+". "+
        "Please note that the photo of this category with name of "+category?.photo+" has been deleted from your local server."
      });
    } catch (error) {
        res.json(error);
    }
  },

  updateById: async (req, res) => {
    try {
      const { libelle, description } = req.body;
      const category = await Category.findById(req.params.id);
      category.libelle = libelle;
      category.description = description;
      const saved = await category.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updatePhotoById: async (req, res) => {
    try {
      const { photo } = req.body;
      const category = await Category.findById(req.params.id);
      category.photo = photo;
      const saved = await category.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  enableCategoryById: async (req, res) => {
    try {
      const { visibility = "ENABLE" } = req.body;
      const category = await Category.findById(req.params.id);
      category.visibility = visibility;
      const saved = await category.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  disableCategoryById: async (req, res) => {
    try {
      const { visibility = "DISABLE" } = req.body;
      const category = await Category.findById(req.params.id);
      category.visibility = visibility;
      const saved = await category.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  retrieveWhereVisibilityIsEqualToENABLE: async (req, res) => {
    try {
      const menu = req.params.menu;
      await Category.find({ menu: menu, visibility: "ENABLE" })
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {

          res.status(400).json({ message: "no category with this menu" + error });
        });
    } catch (error) {
      res.status(500).json({ message: " opps "+error });
    }
  },

  retrieveWhereVisibilityIsEqualToDISABLE: async (req, res) => {
    try {
      const menu = req.params.menu;
      await Category.find({ menu: menu,visibility: "DISABLE" })
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

module.exports = categoryController;
