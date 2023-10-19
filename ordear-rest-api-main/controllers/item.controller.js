const Item = require("../models/item.model");

const itemController = {

    addNewItem: async (req, res) => {
        try {
            const ingredientFK = req.params.ingredientFK;
            const { title, price } = req.body;
            const newItem = new Item({
                title,
                price,
                ingredientFK
            });
            const savedItem = await newItem.save();
            return res.status(201).json({ data: savedItem });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    getItemById : async (req, res) => {
       try {
        const id = req.params.id;
        await Item.findById(id)
        .then((data) => {
            res.json(data);
          })
          .catch((error) => {
            res.status(400).json({ message: "no item with id" + id + " "+ error });
          });
       }catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
    },
    getVisibleItemByIngredientId: async (req, res) => {
        try {
            const ingredientFK = req.params.ingredient;
            await Item.find({ingredientFK : ingredientFK, visibility : true})
                .then((data) => {
                    res.json(data);
                  })
                  .catch((error) => {
                    res.status(400).json({ message: "no item with this ingredient" + error });
                  });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getAllItems : async (req, res) => {
        try {
            await Item.find()
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

    updateItem : async (req, res) => {
        try {
            const itemId = req.params.itemId
            const {title, price} = req.body
            const item = await Item.findById(itemId);
            item.title = title || item.title; 
            item.price = price || item.price;
            const savedItem = await item.save();
            return res.status(201).json({ data: savedItem });
        
        }catch (error) {
            res.status(500).json({ message: error });
          }
    },
    deleteItem: async (req, res) => {
        try {
            const itemId = req.params.itemId
            const item = await Item.findByIdAndDelete(itemId);
           if(!item){
            res.status(404).json({ message: "the item "+category?.libelle +"does not exist" });
          }         
          res.status(200).json({
            message:"The item has been deleted with success."
          });
        } catch (error) {
            res.json(error);
        }
    },

    hideItem : async (req, res) => {
        try {
            const item = await Item.findById(req.params.id);
            item.visibility = 0;
            await item.save();
            return res.status(200).json({ message: "Item hidden" });

        } catch (error) {
            return res.status(500).json({ message: "failed" + "" + error });
        }
    },

    enableItem : async (req, res) => {
        try {
            const item = await Item.findById(req.params.id);
            item.visibility = 1;
            await item.save();
            return res.status(200).json({ message: "Item enabled" });
        } catch (error) {
            return res.status(500).json({ message: "failed to enable the item " + error });
        }
    }
}
module.exports = itemController