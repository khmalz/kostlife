// Firebase App and Firestore
export { default as app, db, storage } from "../firebase";

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

// Storage helpers
export { getImageURL, getMultipleImageURLs } from "./storage";
