import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface FirestoreMovie {
  documentID: string;
  subscribers: string[];
  isSelected?: boolean;
}

export interface FirestoreGame extends FirebaseFirestoreTypes.DocumentData {
  documentID: string;
}
