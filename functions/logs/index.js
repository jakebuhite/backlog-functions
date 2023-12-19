/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { mapIdArray } = require('../utils')

exports.addLog = onRequest(async (req, res) => {
    try {
        // Check if required data are provided in the request body
        if (!req.body.name || !req.body.is_visible || !req.body.owner_id) {
            res.status(400).json({ error: "Invalid Request. Ensure all required data is sent in the request." });
            return;
        }

        // Get all log data
        const logObj = {
            name: req.body.name,
            creation_date: new Date().toString(),
            last_modified_date: new Date().toString(),
            is_visible: req.body.is_visible,
            owner_id: req.body.owner_id,
            collaborators: {},
            movie_ids: {},
            watched_ids: {},
            priority: 999 
        }

        const result = await getFirestore().collection("logs").add(logObj);

        // Send back a message that we've successfully written the log
        res.status(200).json({result: `Log with Id: ${result.id} added.`});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}); 

exports.getLog = onRequest(async (req, res) => {
    try {
        // Check if user ID is provided in the request body
        if (!req.body.log_id) {
            res.status(400).json({ error: "Log ID is required in the request body." });
            return;
        }

        // Query logs based on the owner_id field
        const result = await getFirestore().collection("logs").doc(req.body.log_id).get()
    
        // Extract log data from the result
        const log = {
            id: result.id,
            data: result.data(),
        };

        // Return log data
        res.status(200).json({ data: log });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.getLogs = onRequest(async (req, res) => {
    try {
        // Check if user ID is provided in the request body
        if (!req.body.user_id) {
            res.status(400).json({ error: "User ID is required in the request body." });
            return;
        }

        const user_id = req.body.user_id;

        // Query logs based on the owner_id field
        const result = await getFirestore().collection("logs").where("owner_id", "==", user_id).get();

        // Extract log data from the result
        const logs = result.docs.map((doc) => {
            return {
                id: doc.id,
                data: doc.data(),
            };
        });

        // Return log data
        res.status(200).json({ data: logs });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.updateLog = onRequest(async (req, res) => {
    try {
        // Check if log ID is provided in the request body
        if (!req.body.log_id) {
            res.status(400).json({ error: "Log ID is required in the request body." });
            return;
        }

        const updatedLogObj = {};

        // Add the modified properties to updatedLogObj
        let modified = false;
        if (req.body.name != undefined) {
            updatedLogObj["name"] = req.body.name;
            modified = true;
        }
        if (req.body.is_visible != undefined) {
            updatedLogObj["is_visible"] = req.body.is_visible;
            modified = true;
        } 
        if (req.body.collaborators != undefined) {
            updatedLogObj["collaborators"] = mapIdArray(req.body.collaborators);
            modified = true;
        } 
        if (req.body.movie_ids != undefined) {
            updatedLogObj["movie_ids"] = mapIdArray(req.body.movie_ids)
            modified = true;
        } 
        if (req.body.watched_ids != undefined) {
            updatedLogObj["watched_ids"] = mapIdArray(req.body.watched_ids)
            modified = true;
        } 
        if (req.body.priority != undefined) {
            updatedLogObj["priority"] = req.body.priority
            modified = true;
        }

        if (modified) {
            updatedLogObj["last_modified_date"] = new Date().toString()
        }

        // Query logs based on the owner_id field
        const result = await getFirestore().collection("logs").doc(req.body.log_id).update(updatedLogObj)

        // Send back a message that we've successfully written the user
        res.status(200).json({result: `Log with Id: ${req.body.log_id} updated.`});
    } catch (error) {
        res.status(500).json({ error: "Internal server error: " + error });
    }
});