/* eslint-disable */
const { initializeApp } = require("firebase-admin/app");

const users = require("./users");
const logs = require("./logs");
const movies = require("./movies");

initializeApp();

// Take the request body passed to this HTTP endpoint and insert it into
// Firestore under the path /users/:documentId/
exports.addUser = users.addUser;

// Take the request body passed to this HTTP endpoint and insert it into
// Firestore under the path /logs/:documentId/
exports.addLog = logs.addLog;

// Take the request body passed to this HTTP endpoint and use it to
// get the log under the path /logs/:documentId/
exports.getLog = logs.getLog;

// Take the request body passed to this HTTP endpoint and use it to
// get all valid logs under the path /logs/ where user_id matches
exports.getLogs = logs.getLogs;

// Take the request body passed to this HTTP endpoint and use it to
// update the log under the path /logs/:documentId/
exports.updateLog = logs.updateLog;

exports.addMovie = movies.addMovie;

exports.markMovieAsWatched = movies.markMovieAsWatched;

exports.unmarkMovieAsWatched = movies.unmarkMovieAsWatched;

exports.searchMovie = movies.searchMovie;

exports.getMovieById = movies.getMovieById;