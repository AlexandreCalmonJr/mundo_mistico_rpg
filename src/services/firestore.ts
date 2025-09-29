
'use server';

import { app } from '@/lib/firebase-config';
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc, DocumentData, WithFieldValue, getDoc, setDoc } from 'firebase/firestore';

const db = getFirestore(app);

// Generic function to get a document from a collection
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
        return null;
    }
}

// Generic function to get all documents from a collection
export async function getCollection<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// Function to add a document with a specific ID
export async function setDocument<T extends WithFieldValue<DocumentData>>(collectionName: string, docId: string, data: T): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
}

// Function to add a document to a collection
export async function addDocument<T extends WithFieldValue<DocumentData>>(collectionName: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
}

// Function to update a document in a collection
export async function updateDocument<T extends WithFieldValue<DocumentData>>(collectionName:string, docId: string, data: T): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
}

// Function to delete a document from a collection
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
}
