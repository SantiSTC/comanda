import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

async function register(email: string, password: string): Promise<User> {
    try {
        console.log("EMAIL: ", email, password)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
}

async function login(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert("Error al iniciar sesión:" + error)
        throw error;
    }
}

async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
}

function authStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

function getCurrentUser(): User | null {
    return auth.currentUser;
}

export { register, login, logout, authStateChanged, getCurrentUser };