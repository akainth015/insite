import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}
export function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}
export function logOut() {
    return signOut(auth);
}

export function useAuthUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        return onAuthStateChanged(auth, setUser);
    }, []);

    return user;
}
