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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-6 py-5">
        Create Center
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10 mb-4 w-full max-w-xl"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="state"
          >
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            value={form.state}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter State"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="district"
          >
            District
          </label>
          <input
            id="district"
            name="district"
            type="text"
            value={form.district}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter District"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="manager"
          >
            Manager
          </label>
          <input
            id="manager"
            name="manager"
            type="text"
            value={form.manager}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter Manager Name"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="userId"
          >
            User ID
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            value={form.userId}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter User ID"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter Password"
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg"
          >
            {loading ? "Creating..." : "Create Center"}
          </button>
        </div>
      </form>
    </div>
  );
}
