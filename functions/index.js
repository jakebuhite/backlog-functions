/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const users = require("./users");
const logs = require("./logs");

initializeApp();

// Take the request body passed to this HTTP endpoint and insert it into
// Firestore under the path /users/:documentId/
exports.addUser = users.addUser;

// Take the request body passed to this HTTP endpoint and insert it into
// Firestore under the path /logs/:documentId/
exports.addLog = logs.addLog;

// Take the request body passed to this HTTP endpoint and use it to
// get all valid logs under the path /logs/ where user_id matches
exports.getLogs = logs.getLogs;
