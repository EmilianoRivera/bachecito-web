"use client"
import { createContext, useState } from "react";

const Context = createContext({});

export function ContextAuthProvider({ children }) {
  const [isLogged, setisLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
 
  return (
    <Context.Provider value={{ isLogged, setisLogged, isAdmin, setIsAdmin,  }}>
      {children}
    </Context.Provider>
  );
}

export default Context;