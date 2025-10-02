'use server';

import { app } from '@/lib/firebase-config';
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc, DocumentData, WithFieldValue, getDoc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const db = getFirestore(app);

// Generic function to get a document from a collection
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError; // re-throw to stop execution
    });

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
        return null;
    }
}

// Generic function to get all documents from a collection
export async function getCollection<T>(collectionName: string): Promise<T[]> {
    const colRef = collection(db, collectionName);
    const querySnapshot = await getDocs(colRef).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: colRef.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// Function to add a document with a specific ID
export async function setDocument<T extends WithFieldValue<DocumentData>>(collectionName: string, docId: string, data: T): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    setDoc(docRef, data, { merge: true }).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'create', // or 'update' depending on merge, 'create' is safer
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

// Function to add a document to a collection
export async function addDocument<T extends WithFieldValue<DocumentData>>(collectionName: string, data: T): Promise<string> {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: colRef.path,
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });
    return docRef.id;
}

// Function to update a document in a collection
export async function updateDocument<T extends WithFieldValue<DocumentData>>(collectionName:string, docId: string, data: T): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    updateDoc(docRef, data).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

// Function to delete a document from a collection
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    deleteDoc(docRef).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

// Function to check if a user is an admin
export async function checkAdminStatus(userId: string): Promise<boolean> {
    const adminDoc = await getDoc(doc(db, 'admins', userId)).catch(() => null);
    return adminDoc?.exists() ?? false;
}

// Function to make a user an admin
export async function makeUserAdmin(userId: string): Promise<void> {
    const docRef = doc(db, 'admins', userId);
    setDoc(docRef, { isAdmin: true }).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'create',
            requestResourceData: { isAdmin: true },
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}
