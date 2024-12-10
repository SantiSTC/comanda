import { addDoc, collection, query, orderBy, getDocs, onSnapshot, doc, getDoc, where, updateDoc, deleteDoc } from 'firebase/firestore'; // Import doc here
import { firestore } from './firebase';

async function guardar(col: string, params: any) {
    try {
        const coleccionRef = collection(firestore, col);
        const docRef = await addDoc(coleccionRef, params);
        return docRef;
    } catch (error) {
        console.error('Error al guardar el documento:', error);
        throw error;
    }
}

function traer(col: string, orderByField: string = '', callback: (data: any[]) => void) {
    try {
        const colRef = collection(firestore, col);
        let q;

        if (orderByField) {
            q = query(colRef, orderBy(orderByField, "asc"));
        } else {
            q = query(colRef);
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(data);
        }, (error) => {
            console.error('Error al recibir actualizaciones en tiempo real:', error);
        });

        return unsubscribe;

    } catch (error) {
        console.error('Error al suscribirse a los documentos:', error);
        throw error;
    }
}

function modificar(col: string, obj: any) {
    const docRef = doc(firestore, col, obj.id);

    try {
        return updateDoc(docRef, obj);
    }
    catch (error) {
        console.error('Error al actualizar el registro en Firestore:', error);
        throw error;
    }
}

function eliminar(col: string, docId: string) {
    try {
        const docRef = doc(firestore, col, docId);
        return deleteDoc(docRef);
    } catch (error) {
        console.error('Error al eliminar el documento:', error);
        throw error;
    }
}

async function getById(col: string, id: any) {
    try {
        const colRef = collection(firestore, col);
        const q = query(colRef, where('id', '==', id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('ID not found');
        }

        const idData = querySnapshot.docs[0].data();
        return idData;
    } catch (error) {
        console.error('Error al obtener el objeto:', error);
        throw error;
    }
}

export { guardar, traer, modificar, eliminar, getById };