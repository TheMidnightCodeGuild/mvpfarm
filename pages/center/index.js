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
        localStorage.setItem("centerId", form.userId);
        router.push("/center/dashboard");
      } else {
        setError(
          "The User ID or Password you entered is incorrect. Please try again."
        );
      }
    } catch (err) {
      setError(
        "Sorry, we couldn't log you in at this time. Please try again later."
      );
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-8"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-6 py-5">
        Welcome to Center Login
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10 mb-4 w-full max-w-md"
      >
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
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Please enter your User ID"
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
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Please enter your password"
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg"
          >
            {loading ? "Signing you in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
