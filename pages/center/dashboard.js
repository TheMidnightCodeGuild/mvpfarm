import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function CenterDashboard() {
  const [items, setItems] = useState({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [centerData, setCenterData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem("centerId");
        if (!userId) {
          router.push("/center");
          return;
        }

        const centersRef = collection(db, "Center");
        const q = query(centersRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          router.push("/center");
          return;
        }

        const centerDoc = querySnapshot.docs[0];
        const data = centerDoc.data();
        setCenterData({ id: centerDoc.id, ...data });
        setItems(data.items || {});
        setLoading(false);
      } catch (err) {
        setError("Failed to load center data: " + err.message);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      setError("Both key and value are required");
      return;
    }

    try {
      const updatedItems = { ...items, [newKey]: newValue };
      const centerRef = doc(db, "Center", centerData.id);
      await updateDoc(centerRef, { items: updatedItems });

      setItems(updatedItems);
      setNewKey("");
      setNewValue("");
      setSuccess("Item added successfully!");
      setError("");
    } catch (err) {
      setError("Failed to add item: " + err.message);
    }
  };

  const handleUpdateItem = async (key, newValue) => {
    try {
      const updatedItems = { ...items, [key]: newValue };
      const centerRef = doc(db, "Center", centerData.id);
      await updateDoc(centerRef, { items: updatedItems });

      setItems(updatedItems);
      setSuccess("Item updated successfully!");
      setError("");
    } catch (err) {
      setError("Failed to update item: " + err.message);
    }
  };

  const handleDeleteItem = async (key) => {
    try {
      const updatedItems = { ...items };
      delete updatedItems[key];
      const centerRef = doc(db, "Center", centerData.id);
      await updateDoc(centerRef, { items: updatedItems });

      setItems(updatedItems);
      setSuccess("Item deleted successfully!");
      setError("");
    } catch (err) {
      setError("Failed to delete item: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-xl text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Center Dashboard
          </h1>
          <p className="text-gray-600">Manage your center&apos;s inventory</p>
        </div>

        {/* Add New Item Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Add New Item
          </h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity/Value
                </label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter quantity or value"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-md">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Items List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Current Items
          </h2>
          {Object.keys(items).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items have been added yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add your first item using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(items).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 rounded-lg p-4 transition hover:bg-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 mb-1">{key}</h3>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleUpdateItem(key, e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteItem(key)}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
