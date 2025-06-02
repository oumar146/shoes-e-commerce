import React, { createContext, useState, useEffect } from "react";

// Créer le contexte
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Récupérer les infos utilisateur depuis localStorage au chargement de l'app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Définir l'utilisateur depuis localStorage
    }
  }, []);

  // Fonction pour mettre à jour l'utilisateur (lors de la connexion ou déconnexion)
  const updateUser = (userInfo) => {
    setUser(userInfo);
    if (userInfo) {
      localStorage.setItem("user", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
