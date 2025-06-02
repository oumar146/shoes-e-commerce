import "../styles/articleSection.css";
import imgTemplate from '../sneaker_template.jpg';
import { NavLink } from "react-router-dom";

const ArticleSection = ({
  products = [],
  maxItems = 4,
  showIcon = true,
  iconColor = "#fff",
  textColor = "#000",
  title = "Ne manquez pas\nnos dernières sorties",
  buttonLabel = "Shop new drop",
  showButton = false,

  onButtonClick = () => { }
}) => {

  // Trier et extraire maxItems derniers produits
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
    .slice(0, maxItems);

  return (
    <section
      id="article-section"
      style={{ color: textColor }}
    >
      {latestProducts.length > 0 && (
        <div className="article-header-wrapper">
          <div className="article-header">
            <h2 style={{ whiteSpace: 'pre-line' }}>{title}</h2>
            {showButton && <button
              className="shop-button"
              onClick={onButtonClick}
              style={{ color: textColor }}
            >
              {buttonLabel}
            </button>}
          </div>

          <div className="product-grid">
            {latestProducts.map((product, index) => (
              <div key={index} className="product-card">
                <div className="image-wrapper">
                  <NavLink to={`/product/detail/${product.product_id}`}>
                    {showIcon && <span className="top-left-badge" style={{ backgroundColor: iconColor }}>Nouveau</span>}
                    <img src={product.image_url || imgTemplate} alt={product.product_name} />
                  </NavLink>
                </div>
                <h3>
                  {product.product_name}<br />
                  {product.category_name}
                </h3><NavLink to={`/product/detail/${product.product_id}`}>
                  <button className="view-button">
                    Voir le produit - <span className="price">{`${product.price} €`}</span>
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ArticleSection;
