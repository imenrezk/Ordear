const fs = require("fs");
const path = require("path");
const Product = require("../models/product.model");
const { $where } = require("../models/user.model");

const productController = {
  addNew: async (req, res) => {
    try {
      const categoryFK = req?.params?.categoryFK;
      let convertPromotion = 0;
      let convertedPrice = 0;
      let priceWithPromotion = 0;
      const {
        name,
        photo,
        description,
        price,
        disponibilityDuration,
        promotion,
      } = req.body;
      if (promotion != 0) {
        convertPromotion = promotion / 100;
        convertedPrice = price * convertPromotion;
        priceWithPromotion = (price - convertedPrice).toPrecision(6);
      } else {
        return res.status(500).json({
          message:
            "The promotion value is equal to 0. This product does not have a reduction. So the product price still unchange.",
        });
      }
      const _ = new Product({
        name,
        photo,
        description,
        price,
        disponibilityDuration,
        promotion,
        categoryFK,
      });
      const saved = await _.save();
      return res
        .status(201)
        .json({ data: saved, priceWithPromotion: priceWithPromotion });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  retrieveAll: async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const skip = (page - 1) * limit;

      const count = await Product.find().countDocuments()
      await Product.find()
        .skip(skip)
        .limit(limit)
        .then((data) => {
          res.json({
            items : data,
            count,
            page : page +1
          });
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
      await Product.findById(id)
        .then((data) => {
          res.json(data);
        })
        .catch(() => {
          res
            .status(400)
            .json({ error: "Could not find product with id " + id });
        });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  retrieveByProductId: async (req, res) => {
    try {
      const id = req.params.id;
      await Product.findById(menu)
        .then((data) => {
          res.json(data);
        })
        .catch(() => {
          res.status(400).json({
            error: "Could not find product in this menu with id " + id,
          });
        });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteById: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        res.status(404).json({
          message: "Could not find any product with name of " + product?.name,
        });
      }
      fs.unlinkSync(
        path.join(__dirname, "../uploads/product/", product?.photo)
      );

      res.status(200).json({
        message:
          "This operation has been achieved with success. You have deleted an item with id" +
          req.params.id +
          ". " +
          "Please note that the photo of this product with name of " +
          product?.photo +
          " has been deleted from your local server.",
      });
    } catch (error) {
      res.json(error);
    }
  },

  updateById: async (req, res) => {
    try {
      const { name, description, price, disponibilityDuration, promotion } =
        req.body;
      let convertPromotion = 0;
      let convertedPrice = 0;
      let priceWithPromotion = 0;
      if (promotion != 0) {
        convertPromotion = promotion / 100;
        convertedPrice = price * convertPromotion;
        priceWithPromotion = (price - convertedPrice).toPrecision(6);
      } else {
        return res.status(500).json({
          message:
            "The promotion value is equal to 0. This product does not have a reduction. So the product price still unchange.",
        });
      }
      const product = await Product.findById(req.params.id);
      product.name = name;
      product.description = description;
      product.price = price;
      product.disponibilityDuration = disponibilityDuration;
      product.promotion = promotion;

      const saved = await product.save();
      res.json({ saved, priceWithPromotion: priceWithPromotion });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updatePhotoById: async (req, res) => {
    try {
      const { photo } = req.body;
      const product = await Product.findById(req.params.id);
      product.photo = photo;
      const saved = await product.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  enableProductById: async (req, res) => {
    try {
      const { visibility = "ENABLE" } = req.body;
      const product = await Product.findById(req.params.id);
      product.visibility = visibility;
      const saved = await product.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  disableProductById: async (req, res) => {
    try {
      const { visibility = "DISABLE" } = req.body;
      const product = await Product.findById(req.params.id);
      product.visibility = visibility;
      const saved = await product.save();
      res.json(saved);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  retrieveWhereVisibilityIsEqualToENABLE: async (req, res) => {
    try {
      await Product.find({ visibility: "ENABLE" })
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
      req = null;
      await Product.find({ visibility: "DISABLE" })
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

  retrieveEnabledProductsByCategory: async (req, res) => {
    try {
      const categoryFK = req?.params?.categoryFK;
      await Product.find({visibility : "ENABLE",categoryFK})
        .then((data) => {
          res.status(201).json(data);
        })
        .catch((error) => {
          res.status(400).json({ message: error });
        });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};

module.exports = productController;