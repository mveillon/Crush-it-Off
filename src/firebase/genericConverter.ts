import { QueryDocumentSnapshot } from "firebase/firestore";

/**
 * Creates a converter that allows for typescript to recognize
 * what the type of pushed and pulled data to/from Firestore is
 * @returns the converter to use that prevents TS from complaining
 * with Typescript
 */
function genericConverter<T>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
      return snapshot.data() as T
    }
  }
}

export default genericConverter
