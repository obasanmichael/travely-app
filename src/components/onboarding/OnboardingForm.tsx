// // src/components/OnboardingForm.tsx
// import React, { useState } from "react";
// import Step1_TravelGoal from "./Step1_TravelGoal";
// import Step2_Activities from "./Step2_Activities";
// import Step3_DestinationType from "./Step3_DestinationType";
// import Step4_Companions from "./Step4_Companions";
// import Step5_Duration from "./Step5_Duration";
// import Step6_Budget from "./Step6_Budget";
// import Step7_TravelerCount from "./Step7_TravelerCount";
// import Step8_ClimatePreference from "./Step8_ClimatePreference";
// import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
// import { db } from "../../firebase/firebase";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import firebase from "firebase/compat/app";
// import { getRecommendations } from "../../utils/api";

// // Define the step configurations with the corresponding keys
// const stepConfigs = [
//   { key: "travelGoal", component: Step1_TravelGoal },
//   { key: "activities", component: Step2_Activities },
//   { key: "destinationType", component: Step3_DestinationType },
//   { key: "companions", component: Step4_Companions },
//   { key: "duration", component: Step5_Duration },
//   { key: "budget", component: Step6_Budget },
//   { key: "travelerCount", component: Step7_TravelerCount },
//   { key: "climate", component: Step8_ClimatePreference },
// ] as const;

// interface FormData {
//   travelGoal: string;
//   activities: string[];
//   destinationType: string;
//   companions: string;
//   duration: number;
//   budget: string;
//   travelerCount: number;
//   climate: string;
// }

// const OnboardingForm: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState<FormData>({
//     travelGoal: "",
//     activities: [],
//     destinationType: "",
//     companions: "",
//     duration: 0,
//     budget: "",
//     travelerCount: 1,
//     climate: "",
//   });

//   const currentKey = stepConfigs[currentStep].key as keyof FormData;
//   const StepComponent = stepConfigs[currentStep].component as any;
//   const totalSteps = stepConfigs.length;
//   const navigate = useNavigate();

//   const handleChange = (val: string | string[] | number) => {
//     setFormData((prev) => ({ ...prev, [currentKey]: val }));
//   };

//   const goNext = () =>
//     setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
//   const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

//   const handleSave = async () => {
//     try {
//       // Save user preferences to Firestore
//       await addDoc(collection(db, "userPreferences"), formData);
//       toast.success("Preferences saved successfully! 🎉");

//       // Fetch recommendations from the backend
//       const recommendations = await getRecommendations(
//         parseFloat(formData.budget), // Budget as a number
//         8, // Safety Rating (example value)
//         "Moderate", // Accessibility (example value)
//         formData.destinationType,
//         formData.climate,
//         formData.activities.join(", "), // Convert array to string
//         formData.duration
//       );

//       // After saving, update the user document to mark onboarding as completed
//       const user = firebase.auth().currentUser;
//       if (user) {
//         await updateDoc(doc(db, "users", user.uid), {
//           hasCompletedOnboarding: true,
//           recommendations, // Save recommendations for display on dashboard
//         });
//       }

//       // Redirect to dashboard after saving data
//       setTimeout(() => {
//         navigate("/dashboard", { state: { recommendations } });
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving form data:", error);
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
//         <div className="text-sm text-gray-600 mb-4">
//           Step {currentStep + 1} of {totalSteps}
//         </div>

//         {/* Pass correct props to StepComponent */}
//         <StepComponent
//           value={formData[currentKey as keyof FormData]}
//           onChange={handleChange}
//           step={currentStep + 1}
//           totalSteps={totalSteps}
//         />

//         <div className="flex justify-between mt-6">
//           <button
//             onClick={goBack}
//             disabled={currentStep === 0}
//             className="px-4 py-2 rounded bg-gray-300 text-white disabled:opacity-50"
//           >
//             Previous
//           </button>
//           {currentStep < totalSteps - 1 ? (
//             <button
//               onClick={goNext}
//               className="px-4 py-2 rounded bg-blue-500 text-white"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 rounded bg-green-500 text-white"
//             >
//               Save & Get Recommendations
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnboardingForm;
