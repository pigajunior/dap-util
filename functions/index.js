const algoliasearch = require('algoliasearch');
const firebase = require('firebase');
const functions = require('firebase-functions');
require('dotenv').config();

firebase.initializeApp({ databaseURL: process.env.FIREBASE_DATABASE_URL });
const database = firebase.database();

const algolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

// Add every new message to the Algolia index
exports.addMessageToAlgolia = functions.database.ref('messages/{senderId}/{receiverId}/{messageId}').onCreate((snap, context) => {
    const { senderId, receiverId } = context.params;

    const message = { 
        ...snap.val(),
        objectID: senderId + receiverId
    }

    return index.partialUpdateObject(message);
})
