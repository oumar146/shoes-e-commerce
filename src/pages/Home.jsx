import "../styles/global.css"
import Header from "../components/Header";
import Banner from "../components/Banner";
import ArticleSection from "../components/ArticleSection";
import CategorySection from "../components/CategoriesSection";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import Footer from "../components/Footer";

const LastestArticle = ({ products }) => {


  return (
    <ArticleSection
      products={products}
      maxItems={4}
      showIcon={true}
      iconColor="#4A69E2"
      textColor="#fff"
      title={"Ne manquez pas\nnos dernières sorties"}
      buttonLabel="Découvrir les nouveautés"
      onButtonClick={() => alert("Bouton cliqué !")}
      showButton = {false}
    />
  );
};

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0,0)
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/product/offers`);
        setProducts(response.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Header />
      <Banner product={products[0]} />
      <LastestArticle products={products} />
      <CategorySection products={products} />
      <Footer />
    </div>
  );
}

export default Home;
