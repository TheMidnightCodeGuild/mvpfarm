import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
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
        // Get userId from localStorage (set during login)
        const userId = localStorage.getItem("centerId");
        if (!userId) {
          router.push("/center");
          return;
        }

        // Fetch center data
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Center Dashboard
        </h1>
        
        {/* Add New Item Form */}
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Item</h2>
          <form onSubmit={handleAddItem} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                Key
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900"
                placeholder="Enter key"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900"
                placeholder="Enter value"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Item
            </button>
          </form>
        </div>

        {/* Messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Items List */}
        <div className="bg-white dark:bg-neutral-900 shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Current Items</h2>
          {Object.keys(items).length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300">No items added yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(items).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-neutral-800 rounded">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700 dark:text-gray-200">{key}</p>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleUpdateItem(key, e.target.value)}
                      className="mt-1 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 dark:text-gray-900"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteItem(key)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
