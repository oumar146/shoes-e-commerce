import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "../config";
import { UserContext } from "./UserContext";


const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [fetchFavorites, setFetchFavorites] = useState(false);
  

  useEffect(() => {
    const fetchMyFavorites = async () => {
      if (!user) return;
      try {
        const response = await axios.post(`${config.apiUrl}/favorite/get`, {
          user_id: user.id,
        });
        setFavorites(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris", error);
      } finally {
        setFetchFavorites(true);
      }
    };
    fetchMyFavorites();
  }, [user]);

  const toggleFavorite = async (productId) => {
    if (!user) return;
    try {
      const isFavorite = favorites.includes(productId);
      const url = isFavorite
        ? `${config.apiUrl}/favorite/delete`
        : `${config.apiUrl}/favorite/new`;
      const method = isFavorite ? "delete" : "post";
      
      await axios({
        method,
        url,
        data: { user_id: user.id, product_id: productId },
      });
      
      setFavorites((prevFavorites) =>
        isFavorite
          ? prevFavorites.filter((id) => id !== productId)
          : [...prevFavorites, productId]
      );
    } catch (error) {
      console.error("Erreur lors de la modification des favoris", error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, fetchFavorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
