import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "../config";
import { UserContext } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [fetchCart, setFetchCart] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchMyCart = async () => {
      if (!user) return;
      try {
        const response = await axios.post(`${config.apiUrl}/cart/get`, {
          user_id: user.id,
        });
        setCart(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération du panier", error);
      } finally {
        setFetchCart(true);
      }
    };
    fetchMyCart();
  }, [user,update]);

const addToCart = async (productId, quantity = 1, size) => {
  if (!user) return;
  try {
    const existingItem = cart.find((item) => item.product_id === productId);
    if (existingItem) {
      await axios.post(`${config.apiUrl}/cart/add`, {
        user_id: user.id,
        product_id: productId,
        quantity: quantity,
        size
      });

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product_id === productId ? { ...item, quantity, size } : item
        )
      );
      setUpdate(!update);
    } else {
      await axios.post(`${config.apiUrl}/cart/add`, {
        user_id: user.id,
        product_id: productId,
        quantity,
        size
      });

      setCart((prevCart) => [...prevCart, { product_id: productId, quantity, size }]);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier", error);
  }
};


  const removeFromCart = async (CartId) => {
    
    if (!user) return;
    console.log(CartId, user.id)

    try {
      await axios.delete(`${config.apiUrl}/cart/remove`, {
        data: { user_id: user.id, cart_id: CartId },
      });

      setCart((prevCart) => prevCart.filter((item) => item.id !== CartId));
      setUpdate(!update)
    } catch (error) {
      console.error("Erreur lors de la suppression du produit du panier", error);
    }
  };

  const updateQuantity = async (productId, quantity, size) => {
    if (!user) return;
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      await axios.put(`${config.apiUrl}/cart/update`, {
        user_id: user.id,
        product_id: productId,
        quantity,
        size
      });

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        )
        
      );
      setUpdate(!update)

    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
