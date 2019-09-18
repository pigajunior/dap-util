const algoliasearch = require('algoliasearch');
const firebase = require('firebase');
require('dotenv').config();

firebase.initializeApp({ databaseURL: process.env.FIREBASE_DATABASE_URL });
const database = firebase.database();

const algolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const messageIndex = algolia.initIndex(process.env.ALGOLIA_MESSAGE_INDEX_NAME);

// Add all messages from the database to the messages Algolia index
database.ref('/messages').once('value', snap => {
    snap.forEach(data => {
        const userMessages = data.val();
        for (k in userMessages) {
            messageIndex.saveObject({
                ...userMessages[k],
                objectID: data.key + k
            })
        }
    });
})

const usersIndex = algolia.initIndex(process.env.ALGOLIA_USERS_INDEX_NAME);

usersIndex.setSettings({
    searchableAttributes: ['username']
})

// Add all messages from the database to the users Algolia index
database.ref('/users').once('value', snap => {
    snap.forEach(data => {
        const user = data.val();
        // TODO MAYBE NOT SAVE EVERYTHING
        usersIndex.saveObject({
            ...user,
            objectID: user.uid
        })
    });
})
