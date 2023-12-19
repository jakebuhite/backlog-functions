/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

exports.addLog = onRequest(async (req, res) => {
    // Get all log data
    const logObj = {
        name: req.body.name,
        creation_date: new Date().toString(),
        last_modified_date: new Date().toString(),
        is_visible: req.body.is_visible,
        owner_id: req.body.owner_id,
        collaborators: {},
        movie_ids: [],
        watched_ids: [],
        priority: 999 
    }

    const writeResult = await getFirestore()
        .collection("logs")
        .add(logObj);
        
    // Send back a message that we've successfully written the log
    res.json({result: `Log with Id: ${writeResult.id} added.`});
}); 

exports.getLogs = onRequest(async (req, res) => {
    try {
        // Check if user ID is provided in the request body
        if (!req.body.user_id) {
            res.status(400).json({ error: "User ID is required in the request body." });
            return;
        }

        const user_id = req.body.user_id;

        // Query logs based on the owner_id field in Firestore
        const result = await getFirestore()
            .collection("logs")
            .where("owner_id", "==", user_id)
            .get();

        // Extract log data from the result
        const logs = result.docs.map((doc) => {
            return {
                id: doc.id,
                data: doc.data(),
            };
        });

        // Return log data
        res.json({ data: logs });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});