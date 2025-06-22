import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import config from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import Recommandations from "../components/Recommandations";
import Loader from "../components/Loader"

import "../styles/cart.css";

const Cart = () => {

  const { cart, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Charge tous les produits
  useEffect(() => {
    axios.get(`${config.apiUrl}/product/offers`)
      .then(res => {
        const allProducts = res.data.products || [];
        setProducts(allProducts);

        // Si le panier est vide, recommander des produits aléatoires (max 6)
        if (cart.length === 0) {
          const randomProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 6);
          setRecommendedProducts(randomProducts);
        }
      })
      .catch(err => console.error("Erreur chargement produits :", err));
  }, [cart]);

  // Combine produits et panier
  const cartItems = cart
    .map(item => {
      const product = products.find(p => p.product_id === item.product_id);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  // Filtrer les recommandations si panier non vide
  useEffect(() => {
    if (cartItems.length > 0 && products.length > 0) {
      const cartCategories = [...new Set(cartItems.map(item => item.product.category_name))];

      const filtered = products.filter(p =>
        cartCategories.includes(p.category_name) &&
        !cartItems.some(item => item.product.product_id === p.product_id)
      );

      setRecommendedProducts(filtered.slice(0, 6));
      setFetch(true)

    }
  }, [products]);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <Header />
      {!fetch ?
        <Loader />

        : cartItems.length === 0 && fetch ? (
          <div className="no-product">
            <p style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>
              Votre panier est vide.
            </p>
          </div>
        ) : (
          <div className="cart-page">
            <div className="cart-items">
              {cartItems.map(({ id, product_id, product, quantity, size }) => (
                <div key={id} className="cart-item">
                  <div className="item-header">
                    <CloseIcon
                      onClick={() => removeFromCart(product_id)}
                      style={{ cursor: "pointer", color: "#888" }}
                    />
                  </div>
                  <div className="cart-left">
                    <NavLink className="nav-link" to={`/product/detail/${product.product_id}`}>
                      <img src={product.image_url} alt={product.product_name} />
                    </NavLink>
                  </div>
                  <div className="cart-center">
                    <NavLink className="nav-link" to={`/product/detail/${product.product_id}`}>
                      <h3>{product.product_name}</h3>
                      <p className="category">{product.category_name}</p>
                    </NavLink>
                    <div className="info-row">
                      <span><strong>Taille :</strong> {size}</span>
                      <span><strong>Quantité :</strong> {quantity}</span>
                    </div>
                  </div>
                  <div className="cart-right">
                    <span className="price-blue">{product.price} €</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h4>Récapitulatif de la commande</h4>
              {cartItems.map(({ id, product, quantity, size }) => (
                <div key={id} className="item-detail">
                  <p><strong>{product.product_name}</strong></p>
                  <p className="summary-row ">Taille  <span>{size}</span></p>
                  <p className="summary-row ">Quantité  <span>{quantity}</span></p>
                  <p className="summary-row ">Sous-total  <span>{`${product.price * quantity} €`}</span></p>
                </div>
              ))}
              <div className="summary-row"><span>Articles</span><span>{cartItems.length}</span></div>
              <div className="summary-row"><span>Livraison</span><span>Gratuite</span></div>
              <div className="summary-row"><span>Taxes</span><span>Incluses</span></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{total} €</span>
              </div>
              <NavLink to="/product/checkout">  <button className="checkout-btn">Valider la commande</button></NavLink>
            </div>
          </div>
        )}

      {/* Recommandations même si panier vide */}
      <Recommandations products={recommendedProducts} />

      <Footer />
    </div>
  );
};

export default Cart;
