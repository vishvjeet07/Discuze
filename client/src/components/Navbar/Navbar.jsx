import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import { assests } from '../../assets/assests';
import { Menu, X, User } from "lucide-react";
import { VscAccount } from "react-icons/vsc";


function Navbar() {
  const { token, setToken, backendUrl, navigate } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const fetchToken = () => {
    const token = localStorage.getItem('token');
    setToken(token);
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        localStorage.removeItem("token");
        navigate('/');
        fetchToken();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [token]);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-black border-b border-gray-600 text-white shadow-lg relative">
      {/* Logo */}
      <Link to={'/'} >
        <img
          src={assests.logo}
          alt="Logo"
          className="h-7 w-auto object-contain cursor-pointer"
        />
      </Link>

      {/* Desktop Search */}
      <div className="hidden md:block w-1/2">
        <SearchBar />
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex gap-3 items-center">
        {
          token ? (
            location.pathname === '/profile' ?
              <button
                onClick={logout}
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition duration-200">
                Logout
              </button>
              :
              <a href="/profile"><VscAccount size={30} /></a>
          ) : (
            <>
              <Link to={'/signup'}>
                <button className="px-4 py-0.5 rounded-full border border-gray-500 text-white hover:text-white hover:bg-red-500 transition duration-400">
                  Signup
                </button>
              </Link>
              <Link to={'/login'}>
                <button className="px-4 py-0.5 rounded-full border border-gray-500 text-white hover:text-white hover:bg-red-700 transition duration-400">
                  Login
                </button>
              </Link>
            </>
          )
        }
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-t border-gray-600 flex flex-col items-center gap-4 py-4 md:hidden z-50">
          <div className="w-11/12">
            <SearchBar />
          </div>
          {
            token ? (
              location.pathname === '/profile' ?
                <button
                  onClick={logout}
                  className="w-11/12 px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none transition duration-200">
                  Logout
                </button>
                :
                <a href="/profile"><User /></a>
            ) : (
              <div className="flex flex-col gap-3 w-11/12">
                <Link to={'/signup'}>
                  <button className="w-full px-4 py-2 rounded-full border border-gray-500 text-white hover:bg-red-500 transition duration-400">
                    Signup
                  </button>
                </Link>
                <Link to={'/login'}>
                  <button className="w-full px-4 py-2 rounded-full border border-gray-500 text-white hover:bg-red-700 transition duration-400">
                    Login
                  </button>
                </Link>
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}

export default Navbar
