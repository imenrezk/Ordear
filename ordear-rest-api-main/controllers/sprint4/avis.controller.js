const Avis = require('../../models/sprint4/avis.model');
const NotificationEmployee = require('../../models/sprint2/notificationEmployee.model');
const Order = require('../../models/sprint2/order.model');
const jwt_decode = require("jwt-decode");
const User = require('../../models/user.model');
const Comment = require('../../models/sprint4/commentsAvis');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const avisController = {

    addAvis: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            if (idUser) {
                const { comment, note, restaurantFK, orderFK ,} = req.body;
                const newAvis = new Avis({ comment: comment, user: idUser, restaurantFK: restaurantFK, note: note, orderFK: orderFK,});

                const order = await Order.findById(orderFK).populate('user').populate('restaurantFK');
                order.dateAvis = new Date();
                order.avisAdded = true
                await order.save()
                const savedAvis = await newAvis.save();
                return res.status(201).json({ data: savedAvis });
            } 

        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    getAllAvis: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const userResto = await User.findById(idUser);
            await Avis.find({ restaurantFK: userResto.restaurantFK })
                .sort({ date: -1 })
                .populate('user')
                .populate('orderFK')
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

    getAvisById: async (req, res) => {
        try {
            await Avis.findById(req.params.id).populate('restaurantFK').populate('user')
                .then((docs) => {
                    res.send(docs)
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ message: "Avis not found" + "" + err });
                });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    getAvisByUser: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;
            await Avis.find({ user: idUser }).sort({ createdAt: -1 }).populate('restaurantFK')

                .then((docs) => {
                    res.send(docs)
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ message: "Avis not found " + err });
                });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    responseAvis: async (req, res) => {
        try {
            const { response } = req.body;
            const avis = await Avis.findById(req.params.id);
            avis.response = response;

            const savedAvis = await avis.save();
            res.status(200).json(savedAvis);
        } catch (error) {
            return res.status(500).json({ message: "reponse review failed " + error });
        }
    },

    addCommentToAvis: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const idAvis = req.params.idAvis
            const { comment, restaurantFK } = req.body;
            const newComment = new Comment({ comment: comment, avisFK: idAvis, user: idUser, restaurantFK: restaurantFK })

            const savedComment = await newComment.save();
            return res.status(201).json({ data: savedComment });

        } catch (error) {
            return res.status(500).json({ message: "reponse review failed " + error });
        }
    },

    getCommentsByAvis: async (req, res) => {
        try {
            const idAvis = req.params.idAvis;
            const comment = await Comment.find({ avisFK: idAvis })
                .sort({ createdAt: 1 })
                .populate('user')
                .populate('restaurantFK')
                .populate('avisFK')

            return res.status(200).json({ data: comment });

        } catch (error) {
            return res.status(500).json({ message: "reponse review failed " + error });
        }
    }
}

module.exports = avisController;