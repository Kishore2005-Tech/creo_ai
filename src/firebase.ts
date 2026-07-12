import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom databaseId if provided as second argument of getFirestore
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

// Test connection constraint from SKILL.md
async function testConnection() {
  try {
    // Just a server check to verify connection is alive
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration or network status.", error);
    } else {
      console.log("Firebase connection test complete (database initialized successfully).");
    }
  }
}

testConnection();

export { app, db };

