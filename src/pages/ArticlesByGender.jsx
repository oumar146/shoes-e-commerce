import Header from "../components/Header";
import Filters from "../components/Filters";
import ArticleSection from "../components/ArticleSection";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import "../styles/articlesByGender.css";

const ArticlesByGender = () => {
  const { gender } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uniqueSizes, setUniqueSizes] = useState([]);

  const [filters, setFilters] = useState({
    category: [],
    price: [0, 500],
    size: [],
    gender: gender ? [gender] : []

  });

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/product/stock`);
        setProducts(response.data.products || []);

        const sizes = (response.data.products || [])
          .flatMap((product) =>
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

  useEffect(() => {
    if (products.length && gender) {
      const filtered = products.filter((product) => {
        const hasValidData =
          product.product_name &&
          product.category_name &&
          product.gender_name;

        if (!hasValidData) return false;

        const matchGender = filters.gender.length
          ? filters.gender.includes(product.gender_name)
          : true;

        const matchCategory = filters.category.length
          ? filters.category.includes(product.category_name)
          : true;
        const matchPrice =
          parseFloat(product.price) >= filters.price[0] &&
          parseFloat(product.price) <= filters.price[1];
        const matchSize = filters.size.length
          ? product.stock?.some((stockItem) =>
            filters.size.includes(stockItem.size)
          )
          : true;

        return matchGender && matchCategory && matchPrice && matchSize;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, gender, filters]);

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
            title={`Articles ${gender}`}
            showButton={false}
          />
          {filteredProducts.length === 0 && (
            <p className="no-products-message">Aucun article disponible pour ces filtres.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ArticlesByGender;
