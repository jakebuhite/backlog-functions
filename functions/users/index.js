/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

exports.addUser = onRequest(async (req, res) => {
    try {
        // Check if required data are provided in the request body
        if (!req.body.username || !req.body.email || !req.body.password) {
            res.status(400).json({ error: "Invalid Request. Ensure all required data is sent in the request." });
            return;
        }

        // If no avatar preset provided, select default
        let avatar = 1
        if (req.body.avatar_preset) {
            avatar = req.body.avatar_preset
        }

        // Get all user data
        const userObj = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            join_date: new Date().toString(),
            avatar_preset: avatar,
            friends: {},
            blocked: {}
        }

        const writeResult = await getFirestore().collection("users").add(userObj);

        // Send back a message that we've successfully written the user
        res.status(200).json({result: `User with Id: ${writeResult.id} added.`});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}); 