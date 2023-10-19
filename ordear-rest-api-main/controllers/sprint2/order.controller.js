const jwt_decode = require("jwt-decode");
const RandomString = require("randomstring");
const Order = require('../../models/sprint2/order.model')
const User = require('../../models/user.model')
const CartOrder = require('../../models/sprint2/cartOrder.model');
const CartTrash = require('../../models/sprint2/cartTrash.model');
const Notification = require('../../models/sprint2/notification.model');
const NotificationEmployee = require('../../models/sprint2/notificationEmployee.model');
const nodemailer = require("nodemailer");
const moment = require('moment')
const invoice = require('../../utils/config/invoice');
const invoiceCreditCard = require('../../utils/config/invoiceCreditCard');
const mongoose = require('mongoose')
const Restaurant = require('../../models/restaurant.model')
const Product = require('../../models/product.model');
const Ingredient = require('../../models/ingredient.model');
const Item = require('../../models/item.model');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const player = require('play-sound')();
const notificationSoundFile = '../../utils/audio/notif.mp3';
const orderModel = require("../../models/sprint2/order.model");


// --------------- Email send -------------------
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
    },
});

const orderController = {

    addOrder: async (req, res) => {
        let total = 0;
        let convertPromotion = 0;
        let convertedPrice = 0;
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const cartData = await CartOrder
                .findOne({ user: idUser }).sort({ createdAt: -1 })
                .populate("productFK")
                .populate("ingredientFK")
                .populate('itemsFK');

            const restaurantId = cartData.restaurantFK;
            const restaurant = await Restaurant.findOne({ "_id": restaurantId });
            convertTPS = restaurant.taxeTPS / 100;
            convertTVQ = restaurant.taxeTVQ / 100;

            if (cartData) {
                for (let i = 0; i < cartData.productFK.length; i++) {
                    if (cartData.productFK[i].promotion === 0 || cartData.ingredientFK[i]?.type === 'Required') {

                        total = cartData.productFK[i].price * cartData.quantityProduct[i];
                        convertedPriceTPS = total * convertTPS;
                        convertPriceTVQ = total * convertTVQ;
                        total = (total + convertedPriceTPS + convertPriceTVQ)

                    } else {
                        convertPromotion = cartData.productFK[i].promotion / 100;
                        convertedPrice = cartData.productFK[i].price * convertPromotion;
                        productPrice = cartData.productFK[i].price - convertedPrice;
                        productItemprice = productPrice + cartData.itemsFK[i]?.price

                        if (cartData.itemsFK[i]) {
                            total = total + productPrice * cartData.quantityProduct[i] + cartData.itemsFK[i].price
                            convertedPriceTPS = total * convertTPS;
                            convertPriceTVQ = total * convertTVQ;
                            total = (total + convertedPriceTPS + convertPriceTVQ)
                        } else {
                            total = total + productPrice * cartData.quantityProduct[i]
                            convertedPriceTPS = total * convertTPS;
                            convertPriceTVQ = total * convertTVQ;
                            total = (total + convertedPriceTPS + convertPriceTVQ)
                        }
                    }
                }
            }
            const latestOrder = await Order.findOne().sort({ createdAt: -1 })
            const latestOrderNb = latestOrder.orderNb
            const orderNb = latestOrderNb + 1

            const { tableNb, payMethod, restaurantFK, taxFK, allergy } = req.body;

            const newOrder = new Order({
                cartOrderFK: cartData,
                user: new mongoose.Types.ObjectId(idUser),
                statusOrder: "Waiting",
                tableNb: tableNb,
                orderNb: orderNb,
                totalPrice: total.toFixed(2),
                payMethod: payMethod,
                restaurantFK: restaurantFK,
                taxFK: taxFK,
                allergyName: allergy,
                statusCancelRequest: "No cancel request"
            });

            if (taxFK) {
                newOrder.taxFK = taxFK;
            } else {
                newOrder.tableFK = "null";
            }

            const newNotification = new NotificationEmployee({
                orderFK: newOrder._id,
                title: "New order",
                body: `New order received, N° ${orderNb}.`
            });
            await newNotification.save();

            const saveOrder = await newOrder.save();
            await CartTrash.find({ user: idUser }).deleteMany();
            return res.status(200).json({ data: saveOrder });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const user = await User.findById(idUser);
            await Order.find({ payMethod: { $ne: "" }, restaurantFK: user.restaurantFK })
                .sort({ date: -1 })
                .populate('user')
                .populate({
                    path: 'cartOrderFK',
                    populate: [
                        { path: 'productFK' },
                    ]
                })
                .populate('user')
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

    getAllOrdersByUser: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            await Order.find({ user: idUser })
                .sort({ date: -1 })

                .populate("cartOrderFK").populate("restaurantFK")
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

    getOrderByUser: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const orderData = await Order.findOne({ user: idUser })
                .populate("cartOrderFK")
                .populate("restaurantFK")
                .sort({ date: -1 })
            res.send(orderData);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    getOrderWhereReviewNotAdded: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const order = await Order.findOne({user : idUser, avisAdded : false}).sort({createdAt : -1}).populate('user').populate('restaurantFK')

            res.status(200).json(order)
        } catch (error) {
            console.log(error);
        }

    },

    cashPaymentMethod: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const orderData = await Order.findOne({ user: idUser }).populate("cartOrderFK").sort({ date: -1 })
            orderData.payMethod = "Cash";

            const savedPayMethod = await orderData.save();
            res.status(200).json(savedPayMethod);
        } catch (error) {
            res.status(500).json({ message: error });
        }

    },

    creditCardPaymentMethod: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const { tax } = req.body
            const orderData = await Order.findOne({ user: idUser }).populate("cartOrderFK").sort({ date: -1 })
            if (tax) {
                orderData.taxFK = tax;
            } else {
                orderData.taxFK = "null";
            }


            const savedPayMethod = await orderData.save();
            res.status(200).json(savedPayMethod);

        } catch (error) {
            res.status(500).json({ message: error })
        }
    },

    getOrderById: async (req, res) => {
        try {
            const id = req.params.id;
            await Order.findById(id)

                .populate({
                    path: 'cartOrderFK',
                    populate: [
                        { path: 'productFK' },
                        { path: 'ingredientFK' },
                        { path: 'itemsFK' }
                    ]
                })
                .populate('restaurantFK')
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    res.status(400).json({ message: error });
                });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    },

    getStatus: async (req, res) => {
        try {
            await Order.find({ payMethod: { $ne: "" } })
                .distinct('statusOrder')
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

    acceptOrder: async (req, res) => {
        try {
            const { duree } = req.body

            const orderStatus = await Order.findById(req.params.id);
            orderStatus.statusOrder = "Preparing";
            orderStatus.durationPreparation = duree;
            orderStatus.dateAcceptOrder = Date.now();
            orderStatus.dateAvis = null

            const newNotification = new Notification({
                userConcerned: orderStatus.user,
                orderFK: req.params.id,
                title: "Order accepted",
                body: `Your order ${orderStatus.orderNb} will be ready verry soon !`
            });

           const savedNotification = await newNotification.save();

            const savedStatus = await orderStatus.save();
            res.status(200).json({ savedStatus, savedNotification });

        } catch (error) {
            return res.status(500).json({ message: "Order not accepted" + "" + error });
        }
    },

    refuseOrder: async (req, res) => {
        try {
            const { reason, suggestion } = req.body
            const id = req.params.id
            const orderStatus = await Order.findById(id);
            orderStatus.statusOrder = "Refused";
            orderStatus.reason = reason;
            orderStatus.suggestion = suggestion
            orderStatus.dateAvis = null

            const newNotification = new Notification({ userConcerned: orderStatus.user, orderFK: req.params.id, title: "Order rejected", body: reason, suggestion: suggestion });
            const savedNotification = await newNotification.save();
            const savedStatus = await orderStatus.save();

            if (orderStatus.payMethod === "Credit card") {
                if (orderStatus.statusRefunded) {
                    return res.status(400).json({ message: "Order refunded" })
                }
                const totalPrice = orderStatus.totalPrice;
                const amountInCents = Math.round(totalPrice * 100);
                const refund = await stripe.refunds.create({
                    payment_intent: orderStatus.payment_intent,
                    amount: amountInCents,
                });

                if (refund.status === 'succeeded') {
                    orderStatus.statusRefunded = true;
                    orderStatus.save();
                    return res.status(200).json({ message: 'Remboursement réussi !', savedStatus, savedNotification });
                } else {
                    return res.status(400).json({ message: 'Échec du remboursement', failure_reason: refund.failure_reason });
                }
            };
               
        } catch (error) {
            return res.status(500).json({ message: "Order not refused " + error });
        }
    },

    updateOrderById: async (req, res) => {
        try {
            const { statusOrder, duree, } = req.body

            const orderStatus = await Order.findById(req.params.id);
            orderStatus.statusOrder = statusOrder || orderStatus.statusOrder;
            orderStatus.durationPreparation = duree || orderStatus.durationPreparation;
            orderStatus.dateAvis = null
            
            if (statusOrder === "Ready" && statusOrder.payMethod === "Cash") {
                const newNotification = new Notification({ userConcerned: orderStatus.user, orderFK: req.params.id, title: "Order Ready", body: `Hey ! Your order N° ${orderStatus.orderNb} has been ready! please remember to complete the payment`});
                await newNotification.save();

            };
            if (statusOrder === "Delivered") {
                const newNotification = new Notification({ userConcerned: orderStatus.user, orderFK: req.params.id, title: "Order delivered", body: `Hey ! Your order N° ${orderStatus.orderNb} has been delivered ! Enjoy your delicious meal !` });
                await newNotification.save();

            };
            if (statusOrder === "Delivered") {
                const newNotification = new Notification({ userConcerned: orderStatus.user, orderFK: req.params.id, title: "Order delivered", body: `Hey ! Your order N° ${orderStatus.orderNb} has been delivered ! Enjoy your delicious meal !` });
                await newNotification.save();

            };

            if (statusOrder === "Canceled" && statusOrder.payMethod === "Credit Card") {
                const orderAmount = orderStatus.totalPrice;
                const amountInCents = Math.round(orderAmount * 100);

                if (orderStatus.statusRefunded) {
                    console.log("order refunded")
                }
                const refund = await stripe.refunds.create({
                    payment_intent: order.payment_intent,
                    amount: amountInCents,
                });

                if (refund.status === 'succeeded') {
                    orderStatus.statusRefunded = true;
                    const newNotification = new Notification({ userConcerned: orderStatus.user, orderFK: req.params.id, title: "Confirmation cancel order", body: `You have just canceled your order N° ${orderStatus.orderNb} \n And the amount of ${orderStatus.totalPrice}$ is refunded` });
                    await newNotification.save();
                    orderStatus.save();

                    return res.status(200).json({ message: 'Remboursement réussi !' });
                } else {
                    return res.status(400).json({ message: 'Échec du remboursement', failure_reason: refund.failure_reason });
                }

            } else if (statusOrder === "Canceled" && orderStatus.payMethod === "Cash") {
                const newNotification = new Notification({ userConcerned: orderStatus.user, orderFK: req.params.id, title: "Confirmation cancel order", body: `You have just canceled your order N° ${orderStatus.orderNb}` })
                await newNotification.save();
                orderStatus.save();
            };


            const savedStatus = await orderStatus.save();
            res.status(200).json({ data: savedStatus });
        } catch (error) {
            return res.status(500).json({ message: "Order not updated " + error });
        }
    },

    getDiffTime: async (req, res) => {
        try {
            const currentDate = moment().format('HH:mm');
            const orderDurée = await Order.find({}, 'durationPreparation');
            const orderDateAccept = await Order.find({}, 'dateAcceptOrder');
            const durations = [];

            for (let i = 0; i < orderDurée.length; i++) {
                const duration = parseInt(orderDurée[i].durationPreparation);
                const dateAccept = moment(orderDateAccept[i].dateAcceptOrder, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');

                const [currentHours, currentMinutes] = currentDate.split(':');
                const [acceptHours, acceptMinutes] = dateAccept.split(':');
                const currentTimeInMinutes = parseInt(currentHours) * 60 + parseInt(currentMinutes);
                const acceptTimeInMinutes = parseInt(acceptHours) * 60 + parseInt(acceptMinutes);

                const dureeInMinutes = acceptTimeInMinutes + duration;

                const dureeHours = Math.floor(dureeInMinutes / 60);
                const dureeMinutes = dureeInMinutes % 60;
                const duree = `${dureeHours.toString().padStart(2, '0')}:${dureeMinutes.toString().padStart(2, '0')}`;

                durations.push(duree);
            }
            res.json({ durations });
        } catch (error) {
            return res.status(500).json({ message: "Order not accepted" + "" + error });
        }
    },

    confirmPayOrderById: async (req, res) => {
        try {

            const orderPayment = await Order.findById(req.params.id).populate('user').populate('restaurantFK').populate({
                path: 'cartOrderFK',
                populate: [
                    { path: 'productFK' },
                    { path: 'ingredientFK' },
                    { path: 'itemsFK' }
                ]
            })
            orderPayment.statusPay = true;
            const savedPayment = await orderPayment.save();

            const invoiceSend = { order: orderPayment }
            invoice.sendMail(invoiceSend, res);

            res.status(200).json(savedPayment);
        } catch (error) {
            return res.status(500).json({ message: "Payment not confirmed " + error });
        }
    },

    invoicePayOrderCreditCardById: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;
            
            const orderPayment = await Order.findOne({ user: idUser }).populate('user').populate('taxFK').populate('restaurantFK').populate({
                path: 'cartOrderFK',
                populate: [
                    { path: 'productFK' },
                    { path: 'ingredientFK' },
                    { path: 'itemsFK' }
                ]
            }).sort({ createdAt: -1 })

            const invoiceSend = { order: orderPayment }
            invoiceCreditCard.sendMail(invoiceSend, res);

            res.status(200).json({ message: " Invoice sent" });

        } catch (error) {
            return res.status(500).json({ message: "request not sent " + " " + error });
        }
    },

    confirPayOrderByUser: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const order = await Order.findOne({ user: idUser }).sort({ createdAt: -1 })
                .populate("cartOrderFK")

            order.statusPay = true;
            order.payMethod = "Credit card"
            const savedStatusPay = await order.save();
            res.status(200).json(savedStatusPay);
        } catch (error) {
            return res.status(500).json({ message: "Order not canceled " + error });
        }
    },

    askCancelOrder: async (req, res) => {
        try {

            const idOrder = req.params.idOrder;
            const { reasonCancelOrder } = req.body;
            const order = await Order.findOne({ _id: idOrder });
            order.statusCancelRequest = "In progress";
            order.reasonCancelOrder = reasonCancelOrder;

            const savedAskCancelOrder = await order.save();

            return res.status(201).json({ data: savedAskCancelOrder });


        } catch (error) {
            return res.status(500).json({ message: "request not sent " + " " + error });
        }
    },

    getCancelOrderRequests: async (req, res) => {
        try {
            await Order.find({ statusCancelRequest: "In progress" })
                .sort({ date: -1 })
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

    ConfirmCancelOrder: async (req, res) => {
        try {
            const id = req.params.id
            const noteCancelOrder = req.body.noteCancelOrder

            const order = await Order.findById(id);
            const totalOrder = order.totalPrice

            order.statusOrder = "Canceled";
            order.statusCancelRequest = "Accepted",
                order.noteCancelOrder = noteCancelOrder
            const newNotification = new Notification({ userConcerned: order.user, orderFK: req.params.id, title: "Confirm cancel order request", body: `Your order N° ${order.orderNb} has been canceled` });
            await newNotification.save();
            const savedStatus = await order.save();
            const savesOrder = await order.save();

            if (order.payMethod === "Credit card") {
                if (order.statusRefunded) {
                    return res.status(400).json({ message: "Order refunded" })
                }

                const amountInCents = Math.round(totalOrder * 100);
                const refund = await stripe.refunds.create({
                    payment_intent: order.payment_intent,
                    amount: amountInCents,
                });

                if (refund.status === 'succeeded') {
                    order.statusRefunded = true;
                    order.save();
                    return res.status(200).json({ message: 'Remboursement réussi !', savedStatus });
                } else {
                    return res.status(400).json({ message: 'Échec du remboursement', failure_reason: refund.failure_reason });
                }
            }

            return res.status(200).json({ data: savesOrder })
        } catch (error) {
            return res.status(500).json({ message: "Order not canceled " + error });
        }
    },

    ConfirmCancelOrderCash: async (req, res) => {
        try {
            const id = req.params.id
            const noteCancelOrder = req.body.noteCancelOrder

            const orderStatus = await Order.findById(id);
            orderStatus.statusOrder = "Canceled";
            orderStatus.statusCancelRequest = "Accepted";
            orderStatus.noteCancelOrder = noteCancelOrder;
            const newNotification = new Notification({ userConcerned: orderStatus.user, orderFK: req.params.id, title: "Confirm cancel order cash request", body: `Your order N° ${orderStatus.orderNb} has been canceled` });
            await newNotification.save();


            const savedStatus = await orderStatus.save();
            res.status(200).json(savedStatus);
        } catch (error) {
            return res.status(500).json({ message: "Order not accepted" + "" + error });
        }
    },

    RejectCancelOrder: async (req, res) => {
        try {
            const noteCancelOrder = req.body.noteCancelOrder;
            const order = await Order.findById(req.params.id);
            order.statusCancelRequest = "Rejected"
                order.noteCancelOrder = noteCancelOrder;
            const newNotification = new Notification({ userConcerned: order.user, orderFK: req.params.id, title: "Reject cancel order request", body: `Your order N° ${order.orderNb} has been canceled` });
            await newNotification.save();
            const savesOrder = await order.save();

            res.status(200).json(savesOrder);
        } catch (error) {
            return res.status(500).json({ message: "Order not canceled " + error });
        }
    },

    UpdateOrder: async (req, res) => {
        let total = 0;
        let convertPromotion = 0;
        let convertedPrice = 0;
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const idOrder = req.params.idOrder;
            const productId = req.params.productId;

            const updatedProducts = req.body.updatedProducts;
            const ingredientId = req.body.ingredientId;
            const itemId = req.body.itemId;

            const order = await Order.findOne({ _id: idOrder }).populate({
                path: 'cartOrderFK',
                populate: { path: 'productFK', path: 'ingredientFK', path: 'itemsFK' }
            });

            const oldPrice = order.totalPrice;

            const cartOrder = await CartOrder.findOne({ _id: order.cartOrderFK }).populate('productFK').populate('ingredientFK').populate('itemsFK')
            const product = await Product.findOne({ _id: updatedProducts })
            const ingredient = await Ingredient.findOne({ _id: ingredientId });
            const item = await Item.findOne({ _id: itemId });

            const productIndex = cartOrder.productFK.findIndex(product => product._id.equals(productId));

            cartOrder.productFK[productIndex] = product._id || cartOrder.productFK[productIndex];
            cartOrder.ingredientFK[productIndex] = ingredient._id || null;
            cartOrder.itemsFK[productIndex] = item._id || null;

            await cartOrder.save();

            const cartData = await CartOrder
                .findOne({ user: idUser }).sort({ updatedAt: -1 })
                .populate("productFK")
                .populate("ingredientFK")
                .populate('itemsFK');

            const restaurantId = cartData.restaurantFK;
            const restaurant = await Restaurant.findOne({ "_id": restaurantId });
            convertTPS = restaurant.taxeTPS / 100;
            convertTVQ = restaurant.taxeTVQ / 100;

            if (cartData) {
                for (let i = 0; i < cartData.productFK.length; i++) {
                    if (cartData.productFK[i].promotion === 0 || cartData.ingredientFK[i]?.type === 'Required') {

                        total = cartData.productFK[i].price * cartData.quantityProduct[i];
                        convertedPriceTPS = total * convertTPS;
                        convertPriceTVQ = total * convertTVQ;
                        total = (total + convertedPriceTPS + convertPriceTVQ)

                    } else {
                        convertPromotion = cartData.productFK[i].promotion / 100;
                        convertedPrice = cartData.productFK[i].price * convertPromotion;
                        productPrice = cartData.productFK[i].price - convertedPrice;
                        productItemprice = productPrice + cartData.itemsFK[i]?.price

                        if (cartData.itemsFK[i]) {
                            total = total + productPrice * cartData.quantityProduct[i] + cartData.itemsFK[i].price
                            convertedPriceTPS = total * convertTPS;
                            convertPriceTVQ = total * convertTVQ;
                            total = (total + convertedPriceTPS + convertPriceTVQ)
                        } else {
                            total = total + productPrice * cartData.quantityProduct[i]
                            convertedPriceTPS = total * convertTPS;
                            convertPriceTVQ = total * convertTVQ;
                            total = (total + convertedPriceTPS + convertPriceTVQ)
                        }
                    }
                    order.totalPrice = total;
                    order.save();

                    if (oldPrice > total) {
                        const diff = (oldPrice - total).toFixed(2)
                        const amountInCents = Math.round(diff * 100);

                        if (order.statusRefunded) {
                            console.log("order refunded")
                        }
                        const refund = await stripe.refunds.create({
                            payment_intent: order.payment_intent,
                            amount: amountInCents,
                        });

                        if (refund.status === 'succeeded') {
                            order.statusRefunded = true;
                            order.statusModified = true;
                            order.save();
                            return res.status(200).json({ message: 'Remboursement réussi !' });
                        } else {
                            return res.status(400).json({ message: 'Échec du remboursement', failure_reason: refund.failure_reason });
                        }
                    } else if (oldPrice < total) {
                        const diff = (total - oldPrice).toFixed(2);
                        const emailUser = order.user.email;

                        try {
                            const paymentMethod = await stripe.paymentMethods.create({
                                type: 'card',
                                card: {
                                    number: "4242424242424242",
                                    exp_month: 9,
                                    exp_year: 24,
                                    cvc: "123",
                                },
                            });

                            const customer = await stripe.customers.create({
                                email: emailUser,
                                payment_method: paymentMethod.id,
                                invoice_settings: {
                                    default_payment_method: paymentMethod.id,
                                },
                            });

                            const ephemeralKey = await stripe.ephemeralKeys.create(
                                { customer: customer.id },
                                { apiVersion: '2022-11-15' }
                            );
                            const amountInCents = Math.round(diff * 100);
                            const paymentIntent = await stripe.paymentIntents.create({
                                amount: amountInCents,
                                currency: 'usd',
                                customer: customer.id,
                                payment_method_types: ['card'],
                            });

                            res.json({
                                paymentIntent: paymentIntent.client_secret,
                                ephemeralKey: ephemeralKey.secret,
                                customer: customer.id,
                                publishableKey: process.env.PUBLISH_STRIPE_KEY,
                            });

                            order.statusRefunded = false;
                            order.statusModified = true;
                            order.payment_intent = paymentIntent.id;
                        } catch (error) {
                            console.error('Error processing payment:', error);
                            let message = 'An error occurred while processing your payment.';

                            if (error.type === 'StripeCardError') {
                                message = error.message;
                            }

                            res.status(500).json({ error: 'Payment failed' });
                        }
                    } else if (oldPrice == total) {
                        order.statusModified = true
                    }
                }
            }
            order.save();

        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour de la commande : " + error });
        }
    },

    UpdatedOrderMethodPaymentCash: async (req, res) => {
        try {
            const idOrder = req.params.idOrder;
            const productId = req.params.productId;

            const updatedProducts = req.body.updatedProducts;
            const ingredientId = req.body.ingredientId;
            const itemId = req.body.itemId;

            const order = await Order.findOne({ _id: idOrder }).populate({
                path: 'cartOrderFK',
                populate: { path: 'productFK', path: 'ingredientFK', path: 'itemsFK' }
            });
            const cartOrder = await CartOrder.findOne({ _id: order.cartOrderFK }).populate('productFK').populate('ingredientFK').populate('itemsFK')
            const product = await Product.findOne({ _id: updatedProducts })
            const ingredient = await Ingredient.findOne({ _id: ingredientId });
            const item = await Item.findOne({ _id: itemId });

            const productIndex = cartOrder.productFK.findIndex(product => product._id.equals(productId));

            cartOrder.productFK[productIndex] = product._id || cartOrder.productFK[productIndex];
            cartOrder.ingredientFK[productIndex] = ingredient._id || "null";
            cartOrder.itemsFK[productIndex] = item._id || "null";

            const savedUpdates = await cartOrder.save();
            order.statusModified = 1
            order.save();
            return res.status(200).json({ savedUpdates })


        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour de la commande : " + error });
        }
    },



}

module.exports = orderController;