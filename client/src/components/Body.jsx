import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router";
import Footer from "./Footer";
import { setUser } from "../redux/UserSlice";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "@/lib/axios";

const Body = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      // Skip auth check on login/register pages
      if (location.pathname === '/login' || location.pathname === '/register') {
        return;
      }
      
      const user = await checkAuthStatus();
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    };
    initAuth();
  }, [dispatch, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
