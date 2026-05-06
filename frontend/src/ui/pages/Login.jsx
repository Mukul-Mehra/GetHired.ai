import { useState } from "react";
import { useAuth } from './../../hooks/useAuth';
import { Link, useNavigate} from "react-router-dom";

export default function Login() {
  const { loading, handleLogin, error, setError } = useAuth();
  const  navigate = useNavigate();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({  email, password });
    if (success) {
      navigate("/dashboard");
    }




  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-lg p-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="#22d3ee" stroke-width="15" stroke-linecap="round" stroke-dasharray="300 385" stroke-dashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"><animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate></path></svg></div>
    </div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-sm text-red-300 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-200">&times;</button>
          </div>
        )}

        <div className="flex flex-col gap-4">


          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"

            className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"

            className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-2 bg-blue-600 hover:bg-blue-700 transition duration-300 p-3 rounded-lg font-semibold"
          >
          Login
        </button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            <Link to="/register">Register</Link>
          </span>
        </p>
      </div>
    </div>

  );
}
