import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from "@mui/icons-material/Favorite";
import config from "../config";
import "../styles/productDetail.css";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Recommandations from "../components/Recommandations";

import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { user } = useContext(UserContext);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [products, setProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Charger les produits une seule fois
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/product/stock`);
        setProducts(res.data.products);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      }
    };

    fetchProducts();
  }, []);

  // Définir l'article sélectionné
  useEffect(() => {
    if (id && products.length > 0) {
      const found = products.find(p => p.product_id.toString() === id);
      setSelectedArticle(found);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, products]);

  // Définir les tailles
  useEffect(() => {
    if (selectedArticle?.stock) {
      const formattedSizes = selectedArticle.stock.map(({ size, quantity }) => ({
        label: size,
        available: quantity > 0
      }));
      setSizes(formattedSizes);
    }
  }, [selectedArticle]);

  // Produits similaires dans la même catégorie
  useEffect(() => {
    if (selectedArticle && favorites.length === 0) {
      const filtered = products.filter(
        p => p.category_name === selectedArticle.category_name &&
          p.product_id !== selectedArticle.product_id
      );
      setRelatedProducts(filtered);
    }
  }, [selectedArticle, products, favorites]);

  // Si l'utilisateur a des favoris → recommandations
  useEffect(() => {
    if (favorites.length > 0 && products.length > 0) {
      const favoriteProducts = products.filter(p => favorites.includes(p.product_id));
      const favoriteCategories = [...new Set(favoriteProducts.map(p => p.category_name))];

      let recommendations = products.filter(p =>
        favoriteCategories.includes(p.category_name) &&
        !favorites.includes(p.product_id)
      );

      if (recommendations.length === 0) {
        recommendations = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
      }

      setRelatedProducts(recommendations);
    }
  }, [products, favorites]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      alert("Veuillez sélectionner une taille");
      return;
    }

    try {
      addToCart(selectedArticle.product_id, 1, selectedSize);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="product-detail-container">
        {selectedArticle && (
          <div className="product-content">
            <div className="image-grid">
              {/* {[1, 2, 3, 4].map((_, index) => ( */}
                <img
                  // key={index}
                  src={selectedArticle.image_url}
                  alt={selectedArticle.product_name}
                />
              {/* ))} */}
            </div>

            <div className="product-infos">
              <p className="product-main-info">
                <span className="product-title">{selectedArticle.product_name}</span>
                <span className="category">{selectedArticle.category_name}</span>
                <span className="gender">{selectedArticle.gender_name}</span>
              </p>
              <p className="product-price">{selectedArticle.price} €</p>

              {sizes.length > 0 && (
                <div className="sizes-list">
                  {sizes.map((size, idx) => (
                    <button
                      key={idx}
                      disabled={!size.available}
                      onClick={() => size.available && setSelectedSize(size.label)}
                      className={`size-button ${!size.available ? "disabled" : ""} ${selectedSize === size.label ? "selected" : ""}`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="buttons">
                <div className="action-buttons">
                  <button className="primary-btn" onClick={handleAddToCart}>
                    Ajouter au panier
                  </button>
                  <button
                    className="fav-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) return navigate("/login");
                      toggleFavorite(selectedArticle.product_id);
                    }}
                  >
                    {favorites.includes(selectedArticle.product_id)
                      ? <FavoriteIcon />
                      : <FavoriteBorderIcon />
                    }
                  </button>
                </div>
                <NavLink className="nav-link" to={`/product/checkout/${selectedArticle.product_id}`}>
                  <button className="buy-now-btn">
                    Acheter maintenant
                  </button>
                </NavLink>
              </div>

              <div>
                <h2 className="description-title">À propos du produit</h2>
                <p className="mb-2 text-gray-700">Shadow Navy / Army Green</p>
                <p className="description-text">
                  Ce produit est exclu de toutes promotions et offres spéciales.
                  <br /><br />
                  Payez en plusieurs fois sans frais avec Affirm, Klarna ou Afterpay.
                  <br />
                  Rejoignez adiClub pour bénéficier de la livraison, des retours et des échanges gratuits en illimité.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Recommandations products={relatedProducts} />
      <Footer />
    </div>
  );
};

export default ProductDetail;
