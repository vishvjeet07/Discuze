// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const {setToken, backendUrl} = useContext(AppContext);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const {data} = await axios.post(backendUrl + `/api/auth/login`,
        {
          email: form.email,
          password: form.password,
          remember: form.remember,
        },{ withCredentials: true}
      );

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token)
        navigate("/");
        toast.success(data.message)
      } 
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black mt-3 text-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-1 text-white">Welcome back</h1>
        <p className="text-gray-500 mb-6">Log in to Discuze.</p>

        {serverError ? (
          <div className="mb-4 text-sm text-red-500 border border-red-800 rounded-lg p-2 bg-red-900/20">
            {serverError}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-white text-white
              placeholder:text-base focus:placeholder:text-sm duration-200 transition-all"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Your password"
                className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 pr-12 placeholder-gray-500 focus:outline-none focus:border-white text-white
                placeholder:text-base focus:placeholder:text-sm duration-200 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-200"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={onChange}
                className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-0"
              />
              <span className="text-gray-400">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 font-medium transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Signup hint */}
          <p className="text-center text-sm text-gray-500">
            New here?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
