import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function FarmerPay() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const farmerMobile = localStorage.getItem("farmerMobile");
      if (!farmerMobile) {
        setError("No farmer found. Please login again.");
        setLoading(false);
        return;
      }
      // Find the farmer document
      const q = query(
        collection(db, "Farmer"),
        where("mobilenumber", "==", farmerMobile)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("Farmer not found.");
        setLoading(false);
        return;
      }
      const farmerDoc = querySnapshot.docs[0];
      const farmerRef = doc(db, "Farmer", farmerDoc.id);
      await updateDoc(farmerRef, { paymentstatus: "successfull" });
      setSuccess("Payment status updated successfully!");
      setTimeout(() => {
        router.push("/farmer/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to update payment status: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 text-center">
          Complete Payment
        </h1>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              Click the button below to mark your payment as successful. This
              will update your payment status in our system.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Mark Payment as Successful"
            )}
          </button>

          {error && (
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
