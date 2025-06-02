import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import imgTemplate from "../sneaker_template.jpg";
import "../styles/categorySection.css";
import { NavLink } from "react-router-dom";

const CategorySection = ({ products }) => {
    const [categories, setCategories] = useState([]);

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${config.apiUrl}/category/get`);
                setCategories(res.data.categories);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories", error);
            }
        };
        fetchCategories();
    }, []);

    // Fonction utilitaire pour récupérer une image aléatoire par catégorie
    const getRandomProductImage = (categoryName) => {
        const filtered = products.filter(
            (product) => product.category_name.trim().toLowerCase() === categoryName.trim().toLowerCase()
        );
        if (filtered.length === 0) return imgTemplate;
        const randomProduct = filtered[Math.floor(Math.random() * filtered.length)];
        return randomProduct.image_url || imgTemplate;
    };

    return (
        <div>
            {categories.length > 0 && products.length > 0 && (
                <section className="category-section">
                    <h2 className="section-title">Explorer les catégories</h2>
                    <div className="category-grid">
                        {categories.map((category) => (
                            <NavLink to={`/product/category/${category.name}`} className="category-card" key={category.id}>

                                <img
                                    src={getRandomProductImage(category.name)}
                                    alt={category.name}
                                    className="category-img"
                                />
                                <div className="category-overlay">
                                    <span className="category-name">{category.name}</span>
                                    <ArrowOutwardIcon className="category-icon" />
                                </div>
                            </NavLink>

                        ))}
                    </div>
                </section>)}
        </div>

    );
};

export default CategorySection;
