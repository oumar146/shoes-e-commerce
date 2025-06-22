import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useState, useEffect, useContext } from "react";
import { useFavorites } from "../context/FavoritesContext";
import axios from "axios";
import config from "../config";
import { UserContext } from "../context/UserContext";
import ArticleSection from "../components/ArticleSection";
import Recommandations from "../components/Recommandations";
import Loader from "../components/Loader"

const Favorites = () => {
  const { favorites } = useFavorites();
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!user) return;
        const response = await axios.get(`${config.apiUrl}/product/offers`);
        const allProducts = response.data.products || [];

        setProducts(allProducts);

        // 1. On filtre les favoris
        const favProducts = allProducts.filter((product) =>
          favorites.includes(product.product_id)
        );

        // 2. On récupère les catégories des favoris
        const favCategories = [...new Set(favProducts.map(p => p.category_name))];

        // 3. On filtre les recommandations avec même catégorie (mais pas déjà en favoris)
        let recommendations = allProducts.filter(p =>
          favCategories.includes(p.category_name) &&
          !favorites.includes(p.product_id)
        );

        // 4. Si aucun favori → recommander des produits aléatoires
        if (favorites.length === 0 || recommendations.length === 0) {
          recommendations = allProducts
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);
        }

        setRecommendedProducts(recommendations);
        setFetch(true)

      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, [user, favorites]);

  const filteredProducts = products.filter((product) =>
    favorites.includes(product.product_id)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main className="product-list">
        {!fetch ? <Loader /> :
          <div>        <ArticleSection
            products={filteredProducts}
            maxItems={4}
            showIcon={false}
            iconColor="#4A69E2"
            textColor="#fff"
            title="Mes favoris"
            showButton={false}
          />

            <Recommandations products={recommendedProducts} />
          </div>}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
