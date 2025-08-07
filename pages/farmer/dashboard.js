import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function FarmerDashboard() {
  const [loading, setLoading] = useState(true);
  const [farmerData, setFarmerData] = useState(null);
  const [error, setError] = useState("");
  const [centers, setCenters] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkPaymentStatusAndFetchCenters = async () => {
      try {
        const farmerMobile = localStorage.getItem("farmerMobile");
        if (!farmerMobile) {
          router.push("/farmer");
          return;
        }
        const farmerQ = query(
          collection(db, "Farmer"),
          where("mobilenumber", "==", farmerMobile)
        );
        const farmerSnapshot = await getDocs(farmerQ);
        if (farmerSnapshot.empty) {
          router.push("/farmer");
          return;
        }
        const farmerDoc = farmerSnapshot.docs[0];
        const data = farmerDoc.data();
        setFarmerData(data);

        if (data.paymentstatus === "pending") {
          router.push("/farmer/pay");
          return;
        }

        // Payment is successful, fetch all centers
        const centersSnapshot = await getDocs(collection(db, "Center"));
        const centersList = centersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCenters(centersList);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data: " + err.message);
        setLoading(false);
      }
    };

    checkPaymentStatusAndFetchCenters();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-gray-700 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Welcome, {farmerData?.name || "Farmer"}!
      </h1>
      <p className="text-gray-700 dark:text-gray-200 mb-8">
        Your payment status: <span className="font-semibold">{farmerData?.paymentstatus}</span>
      </p>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Available Centers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {centers.length === 0 ? (
          <div className="col-span-full text-gray-500 dark:text-gray-300">No centers found.</div>
        ) : (
          centers.map(center => (
            <div
              key={center.id}
              className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-6 flex flex-col"
            >
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                {center.Manager || center.manager || "Center"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold">State:</span> {center.State || center.state}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <span className="font-semibold">District:</span> {center.District || center.district}
              </p>
              <div>
                <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Items:</h4>
                {center.items && Object.keys(center.items).length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {Object.entries(center.items).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No items listed.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

