import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token,setToken] = useState(null)
  const navigate = useNavigate();
  
  const value = {
    backendUrl,
    token,
    setToken,
    navigate
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}