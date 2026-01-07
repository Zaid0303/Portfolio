// Firestore CRUD Operations
// Complete guide for Firebase Firestore integration

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ============================================================
// FIRESTORE CRUD OPERATIONS GUIDE
// ============================================================
// 
// 1. CREATE (Add) Data:
//    await addDocument('collectionName', { field: 'value' })
//
// 2. READ (Get) Data:
//    await getDocuments('collectionName')
//    await getDocument('collectionName', 'documentId')
//
// 3. UPDATE Data:
//    await updateDocument('collectionName', 'documentId', { field: 'newValue' })
//
// 4. DELETE Data:
//    await deleteDocument('collectionName', 'documentId')
//
// ============================================================

// Generic CRUD Functions

// CREATE - Add a new document
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding document:', error);
    return { success: false, error: error.message };
  }
};

// READ - Get all documents from a collection
export const getDocuments = async (collectionName, filters = []) => {
  try {
    let q = query(collection(db, collectionName));
    
    // Apply filters if provided
    if (filters.length > 0) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    // Try to add orderBy, if it fails, get without ordering
    try {
      q = query(q, orderBy('createdAt', 'desc'));
    } catch (orderError) {
      // If orderBy fails (index missing), continue without ordering
      console.warn('OrderBy not available, returning unsorted:', orderError.message);
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort manually by createdAt if available
    documents.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        const aTime = a.createdAt.seconds || (a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0) || 0;
        const bTime = b.createdAt.seconds || (b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0) || 0;
        return bTime - aTime;
      }
      return 0;
    });
    
    return { success: true, data: documents };
  } catch (error) {
    console.error('Error getting documents:', error);
    // If error is due to orderBy, try without orderBy
    if (error.code === 'failed-precondition' || error.message.includes('index')) {
      try {
        let q = query(collection(db, collectionName));
        if (filters.length > 0) {
          filters.forEach(filter => {
            q = query(q, where(filter.field, filter.operator, filter.value));
          });
        }
        const querySnapshot = await getDocs(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: documents };
      } catch (retryError) {
        console.error('Error retrying without orderBy:', retryError);
        return { success: false, error: retryError.message, data: [] };
      }
    }
    return { success: false, error: error.message, data: [] };
  }
};

// READ - Get a single document by ID
export const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Document not found' };
    }
  } catch (error) {
    console.error('Error getting document:', error);
    return { success: false, error: error.message };
  }
};

// UPDATE - Update a document
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating document:', error);
    return { success: false, error: error.message };
  }
};

// DELETE - Delete a document
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: error.message };
  }
};

// SET - Set/Update a document (creates if doesn't exist)
export const setDocumentData = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error setting document:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================
// PROJECTS SPECIFIC FUNCTIONS
// ============================================================

export const getProjects = async (category = null) => {
  const filters = category ? [{ field: 'category', operator: '==', value: category }] : [];
  return await getDocuments('projects', filters);
};

export const getProject = async (projectId) => {
  return await getDocument('projects', projectId);
};

export const addProject = async (projectData) => {
  return await addDocument('projects', projectData);
};

export const updateProject = async (projectId, projectData) => {
  return await updateDocument('projects', projectId, projectData);
};

export const deleteProject = async (projectId) => {
  return await deleteDocument('projects', projectId);
};

// ============================================================
// ABOUT SECTION FUNCTIONS
// ============================================================

export const getAbout = async () => {
  return await getDocument('about', 'profile');
};

export const updateAbout = async (aboutData) => {
  return await setDocumentData('about', 'profile', aboutData);
};

// ============================================================
// SERVICES SPECIFIC FUNCTIONS
// ============================================================

export const getServices = async () => {
  return await getDocuments('services');
};

export const addService = async (serviceData) => {
  return await addDocument('services', serviceData);
};

export const updateService = async (serviceId, serviceData) => {
  return await updateDocument('services', serviceId, serviceData);
};

export const deleteService = async (serviceId) => {
  return await deleteDocument('services', serviceId);
};

// ============================================================
// CONTACT MESSAGES FUNCTIONS
// ============================================================

export const addMessage = async (messageData) => {
  return await addDocument('messages', messageData);
};

export const getMessages = async () => {
  return await getDocuments('messages');
};

// Realtime listener for messages
export const subscribeToMessages = (callback) => {
  try {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback({ success: true, data: messages });
    }, (error) => {
      console.error('Error in messages subscription:', error);
      callback({ success: false, error: error.message, data: [] });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// ============================================================
// SETTINGS FUNCTIONS
// ============================================================

export const getSettings = async () => {
  return await getDocument('settings', 'theme');
};

export const updateTheme = async (theme) => {
  return await setDocumentData('settings', 'theme', { defaultTheme: theme });
};

