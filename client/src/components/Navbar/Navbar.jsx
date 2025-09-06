import React, { useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import { assests } from '../../assets/assests';

function Navbar() {
  const {token, setToken,backendUrl, navigate} = useContext(AppContext);
  const fetchToken = () =>{
    const token = localStorage.getItem('token');
    setToken(token)
  }
  const logout = async() => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if(data.success){
        localStorage.removeItem("token");
        navigate('/');
        fetchToken();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const location = useLocation();
  useEffect(()=>{
    fetchToken()
  },[token]);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-black border-b border-gray-600 text-white shadow-lg">
      {/* Logo */}
      <Link to={'/'} >
      <img src={assests.logo} alt="Logo" 
      className="h-7 w-auto object-contain cursor-pointer" /></Link>

      {/* Search bar */}
      <div className="relative">

        <SearchBar />
      </div>

      {/* Auth Buttons */}
      {
        token ?  location.pathname === '/profile' ? <button
        onClick={logout}
        className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition duration-200">
        Logout
        </button>
        : <a href="/profile"><h3>Profile</h3></a> 
        : <div className="flex gap-3">
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
      </div>
      }
    </div>
  )
}

export default Navbar
