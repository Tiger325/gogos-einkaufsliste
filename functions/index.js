/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendeBenachrichtigung = functions.https.onRequest(async (req, res) => {
  const { titel, text, token } = req.body;

  const message = {
    notification: {
      title: titel,
      body: text,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Benachrichtigung gesendet:", response);
    res.status(200).send("OK");
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    res.status(500).send("Fehler beim Versenden");
  }
});
