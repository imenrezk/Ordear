const Cart = require("../models/cart.model");
const CartOrder = require("../models/sprint2/cartOrder.model");
const CartTrash = require("../models/sprint2/cartTrash.model");
const Product = require("../models/product.model");
const jwt_decode = require("jwt-decode");
const Restaurant = require('../models/restaurant.model')

const CartController = {

  addtocart: async (req, res) => {
    try {
      const tokenLogin = req.cookies.tokenLogin;
      const decodeTokenLogin = jwt_decode(tokenLogin);
      const idUser = decodeTokenLogin.id;
      const { productFK, ingredientFK, itemsFK, tableNb, restaurantFK } = req.body;
      const user = req.params.id || idUser;
      const cart = await CartTrash.findOne({ user: idUser, productFK: productFK }).sort({ createdAt: -1 })

      const latestUserCartTrash = await CartTrash.findOne({ user: idUser }).sort({
        createdAt: -1
      })
      const latestUserCartOrder = await CartOrder.findOne({ user: idUser }).sort({
        createdAt: -1
      })

      if (latestUserCartTrash && latestUserCartOrder) {

        latestUserCartTrash.productFK.push(productFK);
        latestUserCartTrash.ingredientFK.push(...ingredientFK);
        latestUserCartTrash.itemsFK.push(...itemsFK);
        latestUserCartTrash.quantityProduct.push(1);

        latestUserCartOrder.productFK.push(productFK);
        latestUserCartOrder.ingredientFK.push(...ingredientFK);
        latestUserCartOrder.itemsFK.push(...itemsFK);
        latestUserCartOrder.quantityProduct.push(1);

        await latestUserCartTrash.save();
        await latestUserCartOrder.save();

        res.json({ latestUserCartTrash, latestUserCartOrder });
      } else {
        
          const cartItemOrder = new CartOrder({
            productFK: productFK,
            ingredientFK: ingredientFK,
            itemsFK: itemsFK,
            tableNb: tableNb,
            quantityProduct: [1],
            user: user,
            restaurantFK: restaurantFK
          });
          const cartItemTrash = new CartTrash({
            productFK: productFK,
            ingredientFK: ingredientFK,
            itemsFK: itemsFK,
            tableNb: tableNb,
            quantityProduct: [1],
            user: user,
            restaurantFK: restaurantFK
          });
          await cartItemOrder.save();
          await cartItemTrash.save();

          res.json({ cartItemOrder, cartItemTrash });
        
      }

    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  getCartTrashByUser: async (req, res) => {
    let total = 0;
    let subtotal = 0;
    let convertPromotion = 0;
    let convertedPrice = 0;
    let convertTPS = 0;
    let convertTVQ = 0;
    let convertedPriceTPS = 0;
    let convertPriceTVQ =0;

    try {
      const tokenLogin = req.cookies.tokenLogin;
      const decodeTokenLogin = jwt_decode(tokenLogin);
      const idUser = decodeTokenLogin.id;

      const cartData = await CartTrash.find({ user: idUser })
        .sort({ createdAt: -1 })
        .populate('productFK')
        .populate('ingredientFK')
        .populate('itemsFK')
        .populate('restaurantFK')

      const restaurantId = cartData[0]?.restaurantFK;
      const restaurant = await Restaurant.findOne({ "_id": restaurantId });

      convertTPS = restaurant && restaurant.taxeTPS / 100;
      convertTVQ = restaurant && restaurant.taxeTVQ / 100;
    
      cartData.forEach((item) => {
        for (let i = 0; i < item.productFK.length; i++) {
          if (item.productFK[i].promotion === 0 || item.ingredientFK[i]?.type === 'Required') {

            total = item.productFK[i].price * item.quantityProduct[i];
            convertedPriceTPS = total * convertTPS;
            convertPriceTVQ = total * convertTVQ;
            total = total + convertedPriceTPS + convertPriceTVQ;

          } else {
            convertPromotion = item.productFK[i].promotion / 100;
            convertedPrice = item.productFK[i].price * convertPromotion;
            productPrice = item.productFK[i].price - convertedPrice;
            productItemprice = productPrice + item.itemsFK[i]?.price

            if (item.itemsFK[i]) {
              total = total + productPrice * item.quantityProduct[i] + item.itemsFK[i].price
              convertedPriceTPS = total * convertTPS;
              convertPriceTVQ = total * convertTVQ;
              total = total + convertedPriceTPS + convertPriceTVQ;

            } else {
              total = total + productPrice * item.quantityProduct[i]
              convertedPriceTPS = total * convertTPS;
              convertPriceTVQ = total * convertTVQ;
              total = total + convertedPriceTPS + convertPriceTVQ;
            }
          }
        }
        convertedPriceTPS = (total * convertTPS).toFixed(2);
        convertPriceTVQ = (total * convertTVQ).toFixed(2);       
        total = total.toFixed(2)
       
        res.send({ cartData, total, convertedPriceTPS, convertPriceTVQ});
      });
    
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  getCartOrderByUser: async (req, res) => {
    let total = 0;
    let convertPromotion = 0;
    let convertedPrice = 0;

    try {
      const tokenLogin = req.cookies.tokenLogin;
      const decodeTokenLogin = jwt_decode(tokenLogin);
      const idUser = decodeTokenLogin.id;

      const cartData = await CartOrder.find({ user: idUser }).sort({ createdAt: -1 })
        .populate("productFK")
        .populate("ingredientFK")
        .populate('itemsFK');

      cartData.forEach((item) => {
        for (let i = 0; i < item.productFK.length; i++) {
          if (item.productFK[i].promotion === 0 || item.ingredientFK[i]?.type === 'Required') {
            total = item.productFK[i].price * item.quantityProduct[i]
          } else {
            convertPromotion = item.productFK[i].promotion / 100;
            convertedPrice = item.productFK[i].price * convertPromotion;
            productPrice = item.productFK[i].price - convertedPrice;
            total = total + productPrice * item.quantityProduct[i]
          }
        }
      });

      res.send({ cartData, total, });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  removefromcart: async (req, res) => {
    try {
      const { id } = req.params;
      const cartItem = await Cart.findById(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Not Product Found" });
      }
      await cartItem.deleteOne();
      res.json({ message: "Product is removed from cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  clearcart: async (req, res) => {
    try {
      const tokenLogin = req.cookies.tokenLogin;
      const decodeTokenLogin = jwt_decode(tokenLogin);
      const idUser = decodeTokenLogin.id;

      await CartTrash.find({ user: idUser }).deleteMany();
      res.json({ message: "Cart empty" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" + error });
    }
  },


  increasequantityProductInCartTrash: async (req, res) => {
    const productFK = req.params.productFK;
    const idCartTrash = req.params.idCartTrash;
    try {
      const product = await Product.findById(productFK);

      const cartItemTrash = await CartTrash.findById(idCartTrash);

      if (!product) {
        return res.status(404).json({ error: "Not Product Found" });
      }

      const productIndexTrash = cartItemTrash.productFK.findIndex(item => item.toString() === productFK);

      cartItemTrash.quantityProduct[productIndexTrash] += 1;
      await cartItemTrash.save();
      res.json({ message: "Product quantity is increased" });

    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  increasequantityProductInCartOrder: async (req, res) => {
    const tokenLogin = req.cookies.tokenLogin;
    const decodeTokenLogin = jwt_decode(tokenLogin);
    const idUser = decodeTokenLogin.id;

    const productFK = req.params.productFK;
    const idCartOrder = req.params.idCartOrder;

    try {
      const product = await Product.findById(productFK);
      const idCart = await CartOrder.findOne({ user: idUser })
        .sort({ createdAt: -1 })
        .populate("productFK")
        .populate("ingredientFK")
        .populate("itemsFK");

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productIndexOrder = idCart.productFK.findIndex(
        (item) => item._id.toString() === productFK
      );

      if (productIndexOrder === -1) {
        return res.status(404).json({ error: "Product not found in the cart" });
      }
      else {
        idCart.quantityProduct[productIndexOrder] += 1;
      }

      await idCart.save();

      res.json({ message: "Product quantity is increased" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  decreasequantityProductInCartTrash: async (req, res) => {
    const productFK = req.params.productFK;
    const idCartTrash = req.params.idCartTrash;
    try {
      const product = await Product.findById(productFK);

      const cartItemTrash = await CartTrash.findById(idCartTrash);

      if (!product) {
        return res.status(404).json({ error: "Not Product Found" });
      }

      const productIndexTrash = cartItemTrash.productFK.findIndex(item => item.toString() === productFK);

      if (cartItemTrash.quantityProduct[productIndexTrash] > 1) {

        cartItemTrash.quantityProduct[productIndexTrash] -= 1;
        await cartItemTrash.save();
        res.json({ message: "Product quantity is decreased" });
      } else {
        res.send({ message: "Product quantity can not be less than 1" });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  decreasequantityProductInCartOrder: async (req, res) => {
    const tokenLogin = req.cookies.tokenLogin;
    const decodeTokenLogin = jwt_decode(tokenLogin);
    const idUser = decodeTokenLogin.id;

    const productFK = req.params.productFK;
    const idCartOrder = req.params.idCartOrder;

    try {
      const product = await Product.findById(productFK);
      const idCart = await CartOrder.findOne({ user: idUser })
        .sort({ createdAt: -1 })
        .populate("productFK")
        .populate("ingredientFK")
        .populate("itemsFK");

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productIndexOrder = idCart.productFK.findIndex(
        (item) => item._id.toString() === productFK
      );

      if (productIndexOrder === -1) {
        return res.status(404).json({ error: "Product not found in the cart" });
      }
      else {
        idCart.quantityProduct[productIndexOrder] -= 1;
      }

      await idCart.save();

      res.json({ message: "Product quantity is decreased" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteProductById: async (req, res) => {
    try {
      const tokenLogin = req.cookies.tokenLogin;
      const decodeTokenLogin = jwt_decode(tokenLogin);
      const idUser = decodeTokenLogin.id;

      const productId = req.params.productId;

      const cartOrder = await CartOrder.findOne({ user: idUser }).sort({ createdAt: -1 });
      const cartTrash = await CartTrash.findOne({ user: idUser }).sort({ createdAt: -1 });

      const ingredientIds = cartOrder.ingredientFK.map(ingredient => ingredient._id);
      const itemIds = cartOrder.itemsFK.map(item => item._id);
      const quantityCartOrder = cartOrder.quantityProduct.map(quantityProduct => quantityProduct._id);

      const ingredientIdsTrash = cartTrash.ingredientFK.map(ingredient => ingredient._id);
      const itemIdsTrash = cartTrash.itemsFK.map(item => item._id);
      const quantityCartTrash = cartTrash.quantityProduct.map(quantityProduct => quantityProduct._id);

      await CartOrder.deleteMany({ _id: { $in: ingredientIds }, productFK: productId });

      await CartTrash.deleteMany({ _id: { $in: ingredientIdsTrash }, productFK: productId });

      await CartOrder.deleteMany({ _id: { $in: itemIds }, productFK: productId });

      await CartTrash.deleteMany({ _id: { $in: itemIdsTrash }, productFK: productId });

      await CartOrder.deleteMany({ _id: { $in: quantityCartOrder }, productFK: productId });

      await CartTrash.deleteMany({ _id: { $in: quantityCartTrash }, productFK: productId });

      await CartTrash.updateOne(
        { user: idUser },
        { $pull: { productFK: productId } }
      );
      await CartOrder.updateMany(
        { user: idUser },
        { $pull: { productFK: productId } }
      );

      await CartOrder.updateOne(
        { user: idUser, productFK: productId },
        { $pull: { quantityProduct: { _id: { $in: quantityCartOrder } } } }
      );

      await CartTrash.updateOne(
        { user: idUser, productFK: productId },
        { $pull: { quantityProduct: { _id: { $in: quantityCartTrash } } } }
      );

      res.status(200).send(cartTrash);
    } catch (error) {

    }
  }

};
module.exports = CartController;