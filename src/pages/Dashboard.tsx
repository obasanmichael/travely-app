// src/pages/Dashboard.tsx
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>You must be logged in to view this page.</p>;

  return <div className="flex justify-center h-screen w-full items-center">
      <h2>Welcome, {user.email}</h2>
  </div>;
}

export default Dashboard;
