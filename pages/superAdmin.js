import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function SuperAdmin() {
  const [form, setForm] = useState({
    state: "",
    district: "",
    manager: "",
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addDoc(collection(db, "Center"), {
        State: form.state,
        District: form.district,
        Manager: form.manager,
        userId: form.userId,
        password: form.password,
        createdAt: new Date(),
      });
      setSuccess("Center created successfully!");
      setForm({
        state: "",
        district: "",
        manager: "",
        userId: "",
        password: "",
      });
    } catch (err) {
      setError("Failed to create center: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Center</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="state">
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            value={form.state}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter State"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="district">
            District
          </label>
          <input
            id="district"
            name="district"
            type="text"
            value={form.district}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter District"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="manager">
            Manager
          </label>
          <input
            id="manager"
            name="manager"
            type="text"
            value={form.manager}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Manager Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="userId">
            User ID
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            value={form.userId}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter User ID"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Password"
          />
        </div>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs mb-4">{success}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Center"}
          </button>
        </div>
      </form>
    </div>
  );
}
