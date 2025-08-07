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
        const centersList = centersSnapshot.docs.map((doc) => ({
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-800">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {farmerData?.name || "Farmer"}!
          </h1>
          <div className="inline-block bg-green-100 px-4 py-2 rounded-full">
            <p className="text-green-800">
              Payment Status:{" "}
              <span className="font-semibold">{farmerData?.paymentstatus}</span>
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 text-center">
            Available Collection Centers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  No collection centers available at the moment.
                </p>
              </div>
            ) : (
              centers.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold text-xl">
                        {(center.Manager || center.manager || "C")[0]}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {center.Manager || center.manager || "Center"}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="font-semibold w-20">State:</span>
                      <span>{center.State || center.state}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="font-semibold w-20">District:</span>
                      <span>{center.District || center.district}</span>
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Available Items:
                    </h4>
                    {center.items && Object.keys(center.items).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(center.items).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded"
                          >
                            <span className="font-medium text-gray-700">
                              {key}
                            </span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-2">
                        No items listed for this center.
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
