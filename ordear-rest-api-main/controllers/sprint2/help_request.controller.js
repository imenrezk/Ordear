const Help_request = require('../../models/sprint2/help_request.model');
const NotificationEmployee = require ('../../models/sprint2/notificationEmployee.model');

const help_requestController = {

    addNewHelp: async (req, res) => {
        try {
            const tableId = req.params.table;
            const { note , type,  } = req.body;
            const newHelpRequest = new Help_request({ note: note, etat: false, tableNb: tableId, type : type,});
            
            const newNotification = new NotificationEmployee({
                helpRequestFK: newHelpRequest._id,
                title: "New help request",
                body: `New help request received from table N° ${tableId}.`,
            });
            await newNotification.save();
            const savedHelpRequest = await newHelpRequest.save();
            return res.status(201).json({ data: savedHelpRequest });

        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    getHelpById: async (req, res) => {
        try {
            await Help_request.findById(req.params.id)
                .then((docs) => {
                    res.send(docs)
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ message: "Help request not found" + "" + err });
                });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    },

    getHelpList: async (req, res) => {
        try {
            await Help_request.find()

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

    getHelpListFalse: async (req, res) => {
        try {
            const helpList = await Help_request.find({ etat: false }).sort({ date: -1 });
            res.json(helpList);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    updateHelp: async (req, res) => {
        try {
            const { noteEmployee } = req.body;
            const help = await Help_request.findById(req.params.id);
            help.etat= true;
            help.noteEmployee= noteEmployee;
            const savedHelpUpdated = await help.save();
            res.status(200).json(savedHelpUpdated);
        } catch (error) {
            return res.status(500).json({ message: "updating help failed" + "" + error });
        }
    },
    
    insatisfactionHelpRequest: async (req, res) => {
        try {

            const {note, tableNb, type} = req.body;            
            const newHelpRequest = new Help_request({ etat: false, tableNb:tableNb , note: note, type : type});
            
            const savedHelpRequest = await newHelpRequest.save();
            return res.status(201).json({ data: savedHelpRequest });
            
        } catch (error) {
            return res.status(500).json({ message: "request not sent " + " " + error });
        }
    }, 
}

module.exports = help_requestController;