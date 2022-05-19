import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface FirestoreMovie extends FirebaseFirestoreTypes.DocumentData {
  documentID: string;
}

export interface FirestoreGame extends FirebaseFirestoreTypes.DocumentData {
  documentID: string;
}
