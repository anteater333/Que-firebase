import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const createUserStore = functions.auth.user().onCreate((user) => {
  const userObject = {
    email: user.email,
    registeredAt: user.metadata.creationTime,
  };

  return admin
    .firestore(admin.app())
    .doc("users/" + user.uid)
    .set(userObject);
});

export const deleteUserStore = functions.auth.user().onDelete((user) => {
  // TBD 참조형 필드를 삭제하는 로직 개발

  return admin
    .firestore(admin.app())
    .doc("users/" + user.uid)
    .delete();
});

export const updateAuth = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    /**
     * 사용자 정보 객체 형식
     */
    interface UserType {
      /** 사용자 표시명 */
      nickname?: string;
      /** 프로필 사진 URL */
      profilePictureUrl?: string;
      /** 사용자 소개글 */
      description?: string;
      /** 사용자 서비스 가입일 */
      registeredAt?: Date;
    }

    const app = admin.app();

    const userId: string = context.params.userId;

    const updatedUserData = change.after.data() as UserType;

    return admin.auth(app).updateUser(userId, {
      displayName: updatedUserData.nickname,
      photoURL: updatedUserData.profilePictureUrl,
    });
    // 어차피 이 정보들 auth가 아니라 store에서 가져오면 별 쓸모없긴 한데
  });
