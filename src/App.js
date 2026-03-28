import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register"
import SuperAdminDashboard from "./components/superadminboard";
import Products from "./components/product";
import Home from "./components/home";
import ProtectedRoute from "./components/protectedroutes";

// import CreateRole from "./components/createrole";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
       <Route path="/superadmin/*" element={
        <ProtectedRoute>
        <SuperAdminDashboard/>
        </ProtectedRoute>}/>
        <Route path="/home" element={<Home/>}/>

       <Route path="/products/:categoryId" element={<Products/>}/>
     {/* <Route path="/create-role" element={<CreateRole />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;