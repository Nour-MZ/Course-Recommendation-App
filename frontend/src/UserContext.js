import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(1)

  return (
    <UserContext.Provider value={{ user, setUser, language, setLanguage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);