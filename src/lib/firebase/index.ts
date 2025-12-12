// Firebase App and Firestore
export { default as app, db } from "../firebase";

// Firestore helpers
export {
    addDocument,
    deleteDocument,
    getDocument,
    getDocuments,
    queryDocuments,
    setDocument,
    updateDocument,
} from "./firestore";
