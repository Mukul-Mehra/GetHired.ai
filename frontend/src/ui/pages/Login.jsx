import { useState } from "react";
import { useAuth } from './../../hooks/useAuth';
import { Link, useNavigate} from "react-router-dom";

export default function Login() {
  const { loading, handleLogin } = useAuth();
  const  navigate = useNavigate();  

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);



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
        Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

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
