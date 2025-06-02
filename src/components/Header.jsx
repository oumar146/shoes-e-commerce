import "../styles/header.css";
import { useState, useEffect, useContext } from "react";
import config from "../config";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -2,
    top: 2,
    border: `2px solid ${theme.palette.background.paper}`,
    color: "white",
    backgroundColor: "#4A69E2",
  },
}));

const HeaderBadge = ({ number, children, className }) => (
  <IconButton aria-label="icon" className={`header-icon ${className || ""}`}>
    <StyledBadge badgeContent={number}>{children}</StyledBadge>
  </IconButton>
);

const MobileMenu = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/category/get`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <IconButton className="menu-button" onClick={() => setShowMenu(!showMenu)}>
        <MenuIcon />
      </IconButton>

      <div className={`side-menu ${showMenu ? "open" : ""}`}>
        <button className="close-button" onClick={() => setShowMenu(false)}>X</button>
        {children ? (<div className="mobile-children">
          {children}
        </div>) : (
          <ul>
            {categories.map((category, index) => (
              <li key={index}>{category.name}</li>
            ))}
          </ul>)}
      </div>

      {showMenu && <div className="overlay" onClick={() => setShowMenu(false)} />}
    </>
  );
};

const Header = ({ children }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");

  const { cart } = useCart();
  const { user } = useContext(UserContext);
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.apiUrl}/product/offers`)
      .then(res => setProducts(res.data.products || []))
      .catch(err => console.error("Erreur chargement produits :", err));

    axios.get(`${config.apiUrl}/product/genders`)
      .then(res => setGenders(res.data.genders || []))
      .catch(err => console.error("Erreur chargement genres :", err));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredSuggestions([]);
    } else {
      const suggestions = products.filter(p =>
        p.product_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(suggestions);
    }
  };

  const handleSuggestionClick = (productId) => {
    setSearchTerm("");
    setFilteredSuggestions([]);
    setShowSearch(false);
    navigate(`/product/detail/${productId}`);
  };

  const handleGenderChange = (e) => {
    const gender = e.target.value;
    setSelectedGender(gender);
    if (gender) {
      navigate(`/product/gender/${gender}`);
      setShowSearch(false);
    }
  };

  return (
    <header>
      {showSearch ? (
        <div className="search-container fade-in" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            autoFocus
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            className="gender-dropdown"
            value={selectedGender}
            onChange={handleGenderChange}
          >
            <option value="">Choisir un genre</option>
            {genders.map((gender, index) => (
              <option key={index} value={gender}>{gender}</option>
            ))}
          </select>
          <IconButton onClick={() => setShowSearch(false)} className="header-icon">
            <CloseIcon />
          </IconButton>

          {filteredSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {filteredSuggestions.map(product => (
                <li
                  key={product.product_id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product.product_id)}
                >
                  {product.product_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="fade-in" style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          {/* <MobileMenu>{children}</MobileMenu> */}
          <NavLink className="nav-link" to="/home"><h1 className="logo">KICKS</h1></NavLink>
          <ul className="nav-items">
            <li>
              <IconButton onClick={() => setShowSearch(true)} className="header-icon">
                <SearchIcon />
              </IconButton>
            </li>
            <li>
              <NavLink to={`/${user ? "cart" : "login"}`}>
                <HeaderBadge number={cart.length || null} className="hidden lg:flex">
                  <ShoppingBagIcon />
                </HeaderBadge>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${user ? "favorites" : "login"}`}>
                <HeaderBadge number={favorites.length || null} className="hidden lg:flex">
                  <FavoriteIcon />
                </HeaderBadge>
              </NavLink>
            </li>
            <li>
              <IconButton className="header-icon">
                <AccountCircleIcon />
              </IconButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
