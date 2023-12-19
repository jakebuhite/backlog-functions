/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

exports.addUser = onRequest(async (req, res) => {
    // Get all user data
    const userObj = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        join_date: new Date().toString(),
        avatar_preset: req.body.avatar_preset,
        friends: {},
        blocked: {}
    }

    const writeResult = await getFirestore()
        .collection("users")
        .add(userObj);
        
    // Send back a message that we've successfully written the user
    res.json({result: `User with Id: ${writeResult.id} added.`});
}); 