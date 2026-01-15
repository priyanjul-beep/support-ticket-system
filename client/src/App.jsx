// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import AdminDashboard from './pages/AdminDashboard'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//     {/* <h1 className="text-3xl font-bold text-blue-600">
//       Tailwind is working 🚀
//     </h1> */}
//     <Login></Login>
//     {/* <Dashboard></Dashboard> */}
//     {/* <AdminDashboard></AdminDashboard> */}
//     </>
//   )
// }

// export default App

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
