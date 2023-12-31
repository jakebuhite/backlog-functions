/* eslint-disable */
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { replaceSpaces } = require('../utils')

exports.addMovie = onRequest(async (req, res) => {
    try {
        // Check if log Id and movie Id are provided in the request body
        if (!req.body.log_id || !req.body.movie_id) {
            res.status(400).json({ error: "Log Id and movie Id are required in the request body." });
            return;
        }

        const result = await getFirestore().collection("logs").doc(req.body.log_id).get()
        if (!result.exists) {
            res.status(404).json({ error: "Log not found." });
            return;
        }

        const logData = result.data();

        // Create a copy of the original and add the movie_id
        const updatedMovieIds = {
            ...logData.movie_ids,
            [req.body.movie_id]: true
        };

        // Update the document
        await getFirestore().collection("logs").doc(req.body.log_id).update({
            movie_ids: updatedMovieIds,
            last_modified_date: new Date().toString()
        });

        res.status(200).json({ result: `Movie ${req.body.movie_id} added.` });
    } catch (error) {
        res.status(500).json({ error: "Internal server error: " + error });
    }
});

exports.markMovieAsWatched = onRequest(async (req, res) => {
    try {
        // Check if log Id and movie Id are provided in the request body
        if (!req.body.log_id || !req.body.movie_id) {
            res.status(400).json({ error: "Log Id and movie Id are required in the request body." });
            return;
        }

        const result = await getFirestore().collection("logs").doc(req.body.log_id).get()
        if (!result.exists) {
            res.status(404).json({ error: "Log not found." });
            return;
        }

        const logData = result.data();

        // Check if the movie_id exists in movie_ids
        if (!logData.movie_ids || !logData.movie_ids[req.body.movie_id]) {
            res.status(400).json({ error: "Movie Id not found." });
            return;
        }

        const updatedMovieIds = { ...logData.movie_ids };
        delete updatedMovieIds[req.body.movie_id];

        // Add movie_id to watched_ids
        const updatedWatchedIds = {
            ...logData.watched_ids,
            [req.body.movie_id]: true
        };

        // Update the document
        await getFirestore().collection("logs").doc(req.body.log_id).update({
            movie_ids: updatedMovieIds,
            watched_ids: updatedWatchedIds,
            last_modified_date: new Date().toString()
        });

        res.status(200).json({ result: `Movie Id ${req.body.movie_id} moved.` });
    } catch (error) {
        res.status(500).json({ error: "Internal server error: " + error });
    }
});

exports.unmarkMovieAsWatched = onRequest(async (req, res) => {
    try {
        // Check if log Id and movie Id are provided in the request body
        if (!req.body.log_id || !req.body.movie_id) {
            res.status(400).json({ error: "Log Id and movie Id are required in the request body." });
            return;
        }

        const result = await getFirestore().collection("logs").doc(req.body.log_id).get()
        if (!result.exists) {
            res.status(404).json({ error: "Log not found." });
            return;
        }

        const logData = result.data();

        // Check if the movie_id exists in watched_ids
        if (!logData.watched_ids || !logData.watched_ids[req.body.movie_id]) {
            res.status(400).json({ error: "Movie Id not found." });
            return;
        }

        const updatedWatchedIds = { ...logData.watched_ids };
        delete updatedWatchedIds[req.body.movie_id];

        // Add movie_id to movie_ids
        const updatedMovieIds = {
            ...logData.movie_ids,
            [req.body.movie_id]: true
        };

        // Update the document
        await getFirestore().collection("logs").doc(req.body.log_id).update({
            movie_ids: updatedMovieIds,
            watched_ids: updatedWatchedIds,
            last_modified_date: new Date().toString()
        });

        res.status(200).json({ result: `Movie Id ${req.body.movie_id} moved.` });
    } catch (error) {
        res.status(500).json({ error: "Internal server error: " + error });
    }
});

exports.searchMovie = onRequest(async (req, res) => {
    try {
        // Check if query is provided in the request body
        if (!req.body.query) {
            res.status(400).json({ error: "Query is required in the request body." });
            return;
        }

        formattedQuery = replaceSpaces(req.body.query)

        // TODO: MODIFY THIS
        const url = `https://api.themoviedb.org/3/search/movie?query=${formattedQuery}&include_adult=false&language=en-US&page=1`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.AUTHORIZATION_KEY}`
          }
        };
     
        // Search TMDB
        // TODO: Pagination
        const response = await fetch(url, options)
        const jsonResponse = await response.json();

        res.status(200).json({ data: jsonResponse });
    } catch (error) {
        res.status(500).json({ error: "Internal server error: " + error });
    }
});

exports.getMovieById = onRequest(async (req, res) => {
    try {
        // Check if movie Id is provided in the request body
        if (!req.body.movie_id) {
            res.status(400).json({ error: "Movie Id is required in the request body." });
            return;
        }

        // TODO: MODIFY THIS
        const url = `https://api.themoviedb.org/3/movie/${req.body.movie_id}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.AUTHORIZATION_KEY}`
            }
        };
     
        // Get movie data
        const response = await fetch(url, options)
        const movieData = await response.json();

        res.status(200).json({ data: movieData });
    } catch (error) {
        res.status(500).json({ error: "Internal server error: " + error });
    }
});