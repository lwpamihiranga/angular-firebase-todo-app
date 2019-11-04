import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

exports.fcmSend = functions.firestore
    .document(`messages/{userID}`).onCreate((snap, context) => {
        const dataObj = snap.data() || {};
        const title = dataObj.title;
        const text = dataObj.text;
        const fcmToken = dataObj.fcmToken;

        const payload = {
                notification: {
                    title: title,
                    text: text
                  }
          };

          admin.messaging().sendToDevice(fcmToken, payload)
          .then((res) => {
              console.log('message sent', res);
          }).catch((err) => {
              console.log('error', err);
          })
    })
