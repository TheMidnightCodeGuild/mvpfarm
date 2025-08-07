import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function FarmerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    mobilenumber: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const q = query(
        collection(db, "Farmer"),
        where("mobilenumber", "==", form.mobilenumber),
        where("password", "==", form.password)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Store farmer ID in localStorage
        localStorage.setItem("farmerMobile", form.mobilenumber);
        router.push("/farmer/dashboard");
      } else {
        setError("Invalid Mobile Number or Password");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Check if farmer already exists
      const q = query(
        collection(db, "Farmer"),
        where("mobilenumber", "==", form.mobilenumber)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("Mobile number already registered. Please login.");
        setLoading(false);
        return;
      }
      await addDoc(collection(db, "Farmer"), {
        mobilenumber: form.mobilenumber,
        name: form.name,
        password: form.password,
        createdAt: new Date(),
        paymentstatus: "pending",
      });
      // Store farmer ID in localStorage
      localStorage.setItem("farmerMobile", form.mobilenumber);
      router.push("/farmer/dashboard");
    } catch (err) {
      setError("Signup failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {isLogin ? "Farmer Login" : "Farmer Signup"}
      </h1>
      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
        className="bg-white dark:bg-neutral-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="mobilenumber">
            Mobile Number
          </label>
          <input
            id="mobilenumber"
            name="mobilenumber"
            type="tel"
            value={form.mobilenumber}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            maxLength={10}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Mobile Number"
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required={!isLogin}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Name"
            />
          </div>
        )}
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
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Signup"}
          </button>
        </div>
      </form>
      <button
        className="text-blue-500 hover:underline mt-2"
        onClick={() => {
          setIsLogin(!isLogin);
          setError("");
        }}
      >
        {isLogin
          ? "Don't have an account? Signup"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
