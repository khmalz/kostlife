import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Get a single document by ID
 */
export const getDocument = async <T = DocumentData>(
    collectionName: string,
    docId: string,
): Promise<T | null> => {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    } catch (error) {
        console.error("Error getting document:", error);
        throw error;
    }
};

/**
 * Get all documents from a collection
 */
export const getDocuments = async <T = DocumentData>(
    collectionName: string,
    ...constraints: QueryConstraint[]
): Promise<T[]> => {
    try {
        const collectionRef = collection(db, collectionName);
        const q =
            constraints.length > 0
                ? query(collectionRef, ...constraints)
                : collectionRef;
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as T[];
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
    }
};

/**
 * Add a new document to a collection (auto-generated ID)
 */
export const addDocument = async <T extends DocumentData = DocumentData>(
    collectionName: string,
    data: T,
): Promise<string> => {
    try {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, data as DocumentData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
};

/**
 * Set a document with a specific ID (creates or overwrites)
 */
export const setDocument = async <T extends DocumentData = DocumentData>(
    collectionName: string,
    docId: string,
    data: T,
    merge = false,
): Promise<void> => {
    try {
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, data as DocumentData, { merge });
    } catch (error) {
        console.error("Error setting document:", error);
        throw error;
    }
};

/**
 * Update an existing document
 */
export const updateDocument = async (
    collectionName: string,
    docId: string,
    data: Partial<DocumentData>,
): Promise<void> => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
    collectionName: string,
    docId: string,
): Promise<void> => {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};

/**
 * Query documents with conditions
 */
export const queryDocuments = async <T = DocumentData>(
    collectionName: string,
    conditions: {
        field: string;
        operator:
            | "=="
            | "!="
            | "<"
            | "<="
            | ">"
            | ">="
            | "array-contains"
            | "in"
            | "array-contains-any";
        value: unknown;
    }[],
    orderByField?: string,
    orderDirection: "asc" | "desc" = "asc",
    limitCount?: number,
): Promise<T[]> => {
    try {
        const collectionRef = collection(db, collectionName);
        const constraints: QueryConstraint[] = [];

        // Add where conditions
        conditions.forEach((condition) => {
            constraints.push(
                where(condition.field, condition.operator, condition.value),
            );
        });

        // Add orderBy
        if (orderByField) {
            constraints.push(orderBy(orderByField, orderDirection));
        }

        // Add limit
        if (limitCount) {
            constraints.push(limit(limitCount));
        }

        const q = query(collectionRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as T[];
    } catch (error) {
        console.error("Error querying documents:", error);
        throw error;
    }
};
