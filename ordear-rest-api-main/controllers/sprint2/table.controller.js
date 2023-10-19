const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require('path');
const mongoose = require('mongoose');
const Table = require('../../models/sprint2/table.model');
const Restaurant = require('../../models/restaurant.model');
const QRCode = require('qrcode');
const User = require('../../models/user.model');

const tableController = {

    AddNewTable: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;

            console.log(idUser+"aaaaaaaaaaaa");

            if (idUser) {
                const restaurantId = req.params.restaurant;
                const { tableNb, chairNb} = req.body;

                if (isNaN(tableNb) || isNaN(chairNb)) {
                    return res.status(400).json({ message: "Les champs tableNb et chairNb doivent être des nombres." });
                }
                if (tableNb === 0 || chairNb === 0) {
                    return res.status(400).json({ message: "Les champs tableNb et chairNb doivent être supérieurs à zéro." });
                }
                const qrCodeContent = JSON.stringify({
                    restaurantId: restaurantId,
                    tableNb: tableNb
                });

                QRCode.toDataURL(qrCodeContent, async (err, qrCodeUrl) => {
                    if (err) {
                        return res.status(500).json({ message: err });
                    }

                    const existingTable = await Table.findOne({ tableNb, restaurant: restaurantId });
                    if (existingTable) {
                        return res.status(409).json({ message: "Ce numéro de table existe déjà." });
                    }

                    const table = new Table({ tableNb, chairNb, restaurant: restaurantId, qr: qrCodeUrl, user: idUser });
                    const savedTable = await table.save();
                    return res.status(201).json({ data: savedTable, qr: qrCodeUrl });
                });
            }
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },
    
    getTablebyId: async (req, res) => {
        try {
            await Table.findById(req.params.id)
                .then((docs) => {
                    res.send(docs)
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ message: "Table not found" + "" + err });
                });

        } catch (error) {
            return res.status(500).json({ message: "updating Table failed" + "" + error });
        }
    },

    getTables: async (req, res) => {
        try {
            const tokenLogin = req.cookies.tokenLogin;
            const decodeTokenLogin = jwt_decode(tokenLogin);
            const idUser = decodeTokenLogin.id;
            console.log(idUser+"aaaaaaaaaaaa");

            const user = await User.findById(idUser);

            Table.find({restaurant : user.restaurantFK})
                .sort({ numberOfTables: 1 })
                .then((docs) => {
                    res.send(docs);
                    console.log(idUser+"aaaaaaaaaaaa");

                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ message: "Invalid" + "" + err });
                });

        } catch (err) {
            return res.status(500).json({ message: "Something wrong" + "" + err.message });
        }

    },
    
    updateTableById: async (req, res) => {
        try {
                const { tableNb, chairNb, qr } = req.body;
                const table = await Table.findById(req.params.id);

                const existingTable = await Table.findOne({ tableNb, restaurant: table.restaurant });
                if (existingTable && existingTable._id.toString() !== table._id.toString()) {
                    return res.status(409).json({ message: "Ce numéro de table existe déjà." });
                }
                table.tableNb = tableNb;
                table.chairNb = chairNb;
                if (tableNb === 0 || chairNb === 0) {
                    return res.status(400).json({ message: "Les champs tableNb et chairNb doivent être supérieurs à zéro." });
                }
                const qrCodeContent = JSON.stringify({
                    restaurantId: table.restaurant,
                    tableNb: tableNb
                });

                QRCode.toDataURL(qrCodeContent, async (err, qrCodeUrl) => {
                    if (err) {
                        return res.status(500).json({ message: err });
                    }
                    table.qr = qrCodeUrl;
                    await table.save();
                    return res.status(200).json({ data: table, qr: qrCodeUrl });
                });
           
        } catch (error) {
            return res.status(500).json({ message: "Updating table failed: " + error });
        }
    },

};

module.exports = tableController;