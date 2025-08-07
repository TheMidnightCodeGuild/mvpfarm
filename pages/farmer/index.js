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
      localStorage.setItem("farmerMobile", form.mobilenumber);
      router.push("/farmer/dashboard");
    } catch (err) {
      setError("Signup failed: " + err.message);
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
        {isLogin ? "Welcome Back Farmer" : "Create Farmer Account"}
      </h1>

      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
        className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10 mb-4 w-full max-w-md"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mobilenumber"
          >
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
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
            placeholder="Enter your 10-digit mobile number"
          />
        </div>

        {!isLogin && (
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required={!isLogin}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              placeholder="Enter your full name"
            />
          </div>
        )}

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
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg"
          >
            {loading
              ? isLogin
                ? "Signing you in..."
                : "Creating account..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          <button
            type="button"
            className="text-orange-600 hover:text-orange-700 font-medium text-center transition duration-200"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setForm({
                mobilenumber: "",
                name: "",
                password: "",
              });
            }}
          >
            {isLogin
              ? "New farmer? Create an account"
              : "Already registered? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
