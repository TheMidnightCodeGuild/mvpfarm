import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function CenterLogin() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const q = query(
        collection(db, "Center"),
        where("userId", "==", form.userId),
        where("password", "==", form.password)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Store center ID in localStorage
        localStorage.setItem("centerId", form.userId);
        // Successful login, redirect to center dashboard
        router.push("/center/dashboard");
      } else {
        setError("Invalid User ID or Password");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Center Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
