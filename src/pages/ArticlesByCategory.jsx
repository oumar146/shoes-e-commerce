import Header from "../components/Header";
import Filters from "../components/Filters";
import ArticleSection from "../components/ArticleSection";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import "../styles/articlesByGender.css";

const ArticlesByCategory = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uniqueSizes, setUniqueSizes] = useState([]);

  const [filters, setFilters] = useState({
    gender: [],
    price: [0, 500],
    size: [],
    category: category ? [category] : [], // initialisation une seule fois ici
  });

  const [openSections, setOpenSections] = useState({
    gender: true,
    price: true,
    size: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Chargement des produits et tailles uniques
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/product/stock`);
        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);

        // Récupérer les tailles uniques
        const sizes = fetchedProducts.flatMap((product) =>
          product.stock?.map((s) => s.size).filter(Boolean) || []
        );
        const unique = [...new Set(sizes)].sort((a, b) => parseFloat(a) - parseFloat(b));
        setUniqueSizes(unique);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, []);

  // Mise à jour des produits filtrés quand produits ou filtres changent
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter((product) => {
      // Filtre catégorie : si aucune sélection, tout passe, sinon vérifie inclusion
      const matchCategory = filters.category.length === 0
        ? true
        : filters.category.includes(product.category_name);

      // Filtre genre
      const matchGender =
        filters.gender.length === 0 || filters.gender.includes(product.gender_name);

      // Filtre prix
      const matchPrice =
        parseFloat(product.price) >= filters.price[0] &&
        parseFloat(product.price) <= filters.price[1];

      // Filtre taille
      const matchSize =
        filters.size.length === 0 ||
        (product.stock &&
          product.stock.some((item) => filters.size.includes(item.size)));

      return matchCategory && matchGender && matchPrice && matchSize;
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  return (
    <div className="articles-by-gender">
      <Header>
        <Filters
          products={products}
          filters={filters}
          setFilters={setFilters}
          openSections={openSections}
          toggleSection={toggleSection}
          uniqueSizes={uniqueSizes}
        />
      </Header>

      <div className="content">
        <Filters
          products={products}
          filters={filters}
          setFilters={setFilters}
          openSections={openSections}
          toggleSection={toggleSection}
          uniqueSizes={uniqueSizes}
        />

        <main className="products-list">
          <ArticleSection
            products={filteredProducts}
            maxItems={100000}
            showIcon={false}
            iconColor="#4A69E2"
            textColor="#fff"
            title={filters.category.length === 1 ? filters.category[0] : "Tous les articles"}
            showButton={false}
          />
          {filteredProducts.length === 0 && (
            <p className="no-products-message">
              Aucun article disponible pour ces filtres.
            </p>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ArticlesByCategory;
