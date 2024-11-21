import Firestore from "@google-cloud/firestore";

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: "./service_account.json",
});

export default db;
