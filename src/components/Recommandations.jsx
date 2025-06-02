// import "../styles/global.css"
// import Header from "../components/Header";
// import Banner from "../components/Banner";
import ArticleSection from "../components/ArticleSection";
// import CategorySection from "../components/CategoriesSection";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import config from "../config";
// import Footer from "../components/Footer";

const Recommandations = ({ products }) => {


  return (
    <ArticleSection
      products={products}
      maxItems={4}
      showIcon={false}
      iconColor="#4A69E2"
      textColor="#fff"
      title={"Vous aimerez peut-être aussi"}
    //   buttonLabel="Découvrir les nouveautés"
      onButtonClick={() => alert("Bouton cliqué !")}
    />
  );
};

export default Recommandations;

