import { database } from "../firebase";
import { doc, updateDoc, deleteField, setDoc, collection, getDocFromServer, deleteDoc } from "firebase/firestore";
import { getAllCurrentValues, getAllSettingValues } from "../Nodes/nodes";

export async function getAllFlows(auth) {
    const userId = auth.uid;
    const colRef = collection(database, userId);
    const docRef = doc(colRef, "flowNames");
    let docSnap = await getDocFromServer(docRef);
    if (docSnap.data() === undefined) {
        return {};
    }
    return docSnap.data();
}

export async function getFlow(auth, id) {
    const userId = auth.uid;
    const docRef = doc(database, userId, id);
    let docSnap = await getDocFromServer(docRef);
    if (docSnap.data() === undefined) {
        return {};
    }
    return docSnap.data();
}

export async function saveFlow(auth, id, name, flowObject) {
    const userId = auth.uid;
    const docRef = doc(database, userId, id);
    const date = new Date();
    await setDoc(
        docRef,
        { ...flowObject, values: getAllCurrentValues(), settings: getAllSettingValues() },
        { merge: true }
    );
    await setDoc(
        doc(database, userId, "flowNames"),
        {
            [id]: {
                name: name,
                lastModified: date.getFullYear() + " / " + (date.getMonth() + 1) + " / " + date.getDate() + " ",
            },
        },
        { merge: true }
    );
}

export async function deleteFlow(auth, id) {
    const userId = auth.uid;
    const docRef = doc(database, userId, id);
    await deleteDoc(docRef);
    await updateDoc(doc(database, userId, "flowNames"), { [id]: deleteField() });
}
