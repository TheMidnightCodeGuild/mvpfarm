import { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Complete Payment
      </h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {loading ? "Processing..." : "Mark Payment as Successfull"}
      </button>
      {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
      {success && <p className="text-green-500 text-xs mt-4">{success}</p>}
    </div>
  );
}
