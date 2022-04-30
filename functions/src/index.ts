import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const createUserStore = functions.auth.user().onCreate((user) => {
  let app;
  if (!admin.apps.length) app = admin.initializeApp();
  else app = admin.app();

  const userObject = {
    email: user.email,
    registeredAt: user.metadata.creationTime,
  };

  return admin
    .firestore(app)
    .doc("users/" + user.uid)
    .set(userObject);
});

export const deleteUserStore = functions.auth.user().onDelete((user) => {
  let app;
  if (!admin.apps.length) app = admin.initializeApp();
  else app = admin.app();

  // TBD 참조형 필드를 삭제하는 로직 개발

  return admin
    .firestore(app)
    .doc("users/" + user.uid)
    .delete();
});
