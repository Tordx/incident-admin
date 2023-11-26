import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "@firebase/auth";
import React from "react";

// Define the type for your user
type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null | undefined;
};

type AuthContextType = {
  currentUser: User | null;
};

type Children = {
  children: any | null;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
});

// AuthContextProvider component
export const AuthContextProvider: React.FC<Children> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        setCurrentUser({ uid, displayName, email, photoURL });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};