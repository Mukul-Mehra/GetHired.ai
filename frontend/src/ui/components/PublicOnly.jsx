import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PublicOnly({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main>
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
          <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-lg p-8">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
