// Firebase App and Firestore
export { default as app, db } from '../firebase';

// Firestore helpers
export {
  getDocument,
  getDocuments,
  addDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from './firestore';
