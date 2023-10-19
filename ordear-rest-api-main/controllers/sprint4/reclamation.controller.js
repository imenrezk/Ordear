const reclamation = require('../../models/sprint4/reclamation.model');
const NotificationEmployee = require('../../models/sprint2/notificationEmployee.model');
const Order = require('../../models/sprint2/order.model');
const jwt_decode = require("jwt-decode");
const multer = require('multer');
const User = require('../../models/user.model');

// ----------- Multer image ----------------------------
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/reclamation/');
    },
    filename: (req, file, callback) => {
        const originalName = file.originalname;
        const extension = MIME_TYPES[file.mimetype];
        callback(null, originalName);
    }
});
const upload = multer({ storage: storage }).single("image");

const reclamationController = {


    addReclamation: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            if (idUser) {
                const { message, type, tableNb, restaurantFK, orderFK, image } = req.body;
                const newReclamation = new reclamation({ statusReclamation: false, message: message, type: type, tableNb: tableNb, image: image, restaurantFK: restaurantFK, orderFK: orderFK, user: idUser });

                const newNotification = new NotificationEmployee({
                    reclamationFK: newReclamation._id,
                    title: "New claim",
                    body: `New claim received from table N° ${tableNb}.`,
                });
                await newNotification.save();
                const savedReclamation = await newReclamation.save();
                return res.status(201).json({ data: savedReclamation });
            }

        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },
    addImageReclamation: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            let decodeTokenLogin = jwt_decode(tokenLogin);
            let idUser = decodeTokenLogin.id;

            const image = req?.file?.filename;

            const Reclamation = await reclamation.findOne({ user: idUser }).sort({ createdAt: -1 })
            Reclamation.image = image;
            const save = await Reclamation.save()
            return res.status(200).json({ data: save })

        } catch (err) {
            return res.status(500).json({ message: "Something wrong " + err.message });
        }
    },
    getAllReclamations: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            const user = await User.findById(idUser);
            await reclamation.find({ restaurantFK: user.restaurantFK })
                .sort({ date: 1 })
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

    getReclamationNotTretead: async (req, res) => {
        try {
            const rec = await reclamation.find({ statusReclamation: false }).sort({ date: -1 });
            res.json(rec);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    getReclamationById: async (req, res) => {
        try {
            await reclamation.findById(req.params.id)
                .then((docs) => {
                    res.send(docs)
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ message: "Reclamation not found" + "" + err });
                });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    getReclamationByUser: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            await reclamation.find({ user: idUser })
                .then((docs) => {
                    res.send(docs)
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ message: "Reclamation not found " + err });
                });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    executeReclamation: async (req, res) => {
        try {
            const { response } = req.body;
            const Reclamation = await reclamation.findById(req.params.id);
            Reclamation.response = response;
            Reclamation.statusReclamation = true;
            const savedReclamation = await Reclamation.save();
            res.status(200).json(savedReclamation);
        } catch (error) {
            return res.status(500).json({ message: "updating reclamation failed " + error });
        }
    },

    getAllReclamationsByUser: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            await reclamation.find({ user: idUser })
                .sort({ date: -1 })
                .populate("restaurantFK")
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

}

module.exports = reclamationController;