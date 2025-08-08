import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartShipping from "./pages/CartShipping"
import { useEffect } from 'react';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
import OrderComplete from "./pages/OrderComplete";
import LoginPage from "./pages/LoginPage"
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from "./pages/AdminDashboard"

import AdminProtectedRoute from './components/AdminProtectedRoute';

import BlogDetailPage from './pages/BlogDetailPage';
import MyBookings from './pages/MyBookings';
import AllBlogs from './pages/AllBlogs'; 



import AOS from 'aos';
import 'aos/dist/aos.css';

import { ConfirmProvider } from './components/ConfirmDialog';


export default function App() {
  useEffect(() => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
  });
}, []);
  return (
     <ConfirmProvider>

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shipping" element={<CartShipping />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order" element={<OrderComplete />} />
      <Route path="/login/user" element={<LoginPage />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      
      <Route path="*" element={<HomePage/>} />
      <Route path="/blogs" element={<AllBlogs />} />
       <Route path="/blog/:id" element={<BlogDetailPage />} />
      <Route path="/mybooking" element={<MyBookings />} />


      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />







    </Routes>
    </ConfirmProvider>

  );
}
