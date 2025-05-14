// import {
//   doc,
//   getDoc,
//   collection,
//   getDocs,
//   query,
//   where,
//   limit,
//   orderBy,
//   startAfter,
//   DocumentSnapshot,
//   QueryConstraint,
// } from "firebase/firestore";
// import { db } from "../firebase/firebase";
// import { Destination } from "../components/types/types";

// // Get all destinations with optional filtering and pagination
// export const getDestinations = async (
//   filters: {
//     location?: string;
//     priceRange?: [number, number];
//     travelStyle?: string[];
//     season?: string;
//   } = {},
//   pageSize = 10,
//   lastDoc?: DocumentSnapshot
// ) => {
//   try {
//     const constraints: QueryConstraint[] = [];

//     if (filters.location)
//       constraints.push(where("location", "==", filters.location));

//     if (filters.priceRange) {
//       const [minPrice, maxPrice] = filters.priceRange;
//       constraints.push(
//         where("price", ">=", minPrice),
//         where("price", "<=", maxPrice)
//       );
//     }

//     if (filters.travelStyle?.length)
//       constraints.push(
//         where("travelStyles", "array-contains-any", filters.travelStyle)
//       );

//     if (filters.season)
//       constraints.push(
//         where("bestTimeToVisit", "array-contains", filters.season)
//       );

//     constraints.push(orderBy("popularity", "desc"), limit(pageSize));

//     if (lastDoc) constraints.push(startAfter(lastDoc));

//     const destinationsQuery = query(
//       collection(db, "destinations"),
//       ...constraints
//     );
//     const querySnapshot = await getDocs(destinationsQuery);

//     const destinations: Destination[] = querySnapshot.docs.map(
//       (doc) => ({ id: doc.id, ...doc.data() } as Destination)
//     );

//     return { destinations, lastVisible: querySnapshot.docs.at(-1) };
//   } catch (error) {
//     console.error("Error fetching destinations:", error);
//     throw error;
//   }
// };

// // Get a single destination by ID
// export const getDestinationById = async (id: string): Promise<Destination> => {
//   try {
//     const destinationDocRef = doc(db, "destinations", id);
//     const destinationDoc = await getDoc(destinationDocRef);

//     if (!destinationDoc.exists()) throw new Error("Destination not found");

//     return { id: destinationDoc.id, ...destinationDoc.data() } as Destination;
//   } catch (error) {
//     console.error("Error fetching destination:", error);
//     throw error;
//   }
// };

// // Get featured destinations
// export const getFeaturedDestinations = async (
//   pageSize = 6
// ): Promise<Destination[]> => {
//   try {
//     const featuredQuery = query(
//       collection(db, "destinations"),
//       where("featured", "==", true),
//       limit(pageSize)
//     );
//     const querySnapshot = await getDocs(featuredQuery);

//     return querySnapshot.docs.map(
//       (doc) => ({ id: doc.id, ...doc.data() } as Destination)
//     );
//   } catch (error) {
//     console.error("Error fetching featured destinations:", error);
//     throw error;
//   }
// };

// // Search destinations by keyword
// export const searchDestinations = async (
//   keyword: string,
//   pageSize = 10
// ): Promise<Destination[]> => {
//   try {
//     const nameQuery = query(
//       collection(db, "destinations"),
//       where("nameKeywords", "array-contains", keyword.toLowerCase()),
//       limit(pageSize)
//     );
//     const querySnapshot = await getDocs(nameQuery);

//     return querySnapshot.docs.map(
//       (doc) => ({ id: doc.id, ...doc.data() } as Destination)
//     );
//   } catch (error) {
//     console.error("Error searching destinations:", error);
//     throw error;
//   }
// };

// // Get destinations by region
// export const getDestinationsByRegion = async (
//   region: string
// ): Promise<Destination[]> => {
//   try {
//     const regionQuery = query(
//       collection(db, "destinations"),
//       where("region", "==", region)
//     );
//     const querySnapshot = await getDocs(regionQuery);

//     return querySnapshot.docs.map(
//       (doc) => ({ id: doc.id, ...doc.data() } as Destination)
//     );
//   } catch (error) {
//     console.error("Error fetching destinations by region:", error);
//     throw error;
//   }
// };

// // Get popular destinations
// export const getPopularDestinations = async (
//   pageSize = 10
// ): Promise<Destination[]> => {
//   try {
//     const popularQuery = query(
//       collection(db, "destinations"),
//       orderBy("views", "desc"),
//       limit(pageSize)
//     );
//     const querySnapshot = await getDocs(popularQuery);

//     return querySnapshot.docs.map(
//       (doc) => ({ id: doc.id, ...doc.data() } as Destination)
//     );
//   } catch (error) {
//     console.error("Error fetching popular destinations:", error);
//     throw error;
//   }
// };
