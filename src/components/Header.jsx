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
import { Menu, MenuItem } from "@mui/material";
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


const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate("/login")
    handleClose()
  };

  const handleLogout = () => {
    updateUser(null);
    localStorage.removeItem("token");
    handleClose()

  };

  const { cart } = useCart();
  const { user, updateUser } = useContext(UserContext);
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
                <HeaderBadge number={!user ? null : cart.length || null} className="hidden lg:flex">
                  <ShoppingBagIcon />
                </HeaderBadge>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${user ? "favorites" : "login"}`}>
                <HeaderBadge number={!user ? null :  favorites.length || null} className="hidden lg:flex">
                  <FavoriteIcon />
                </HeaderBadge>
              </NavLink>
            </li>
            <li>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}

                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {user ? <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem> :
                    <MenuItem onClick={handleLogin}>Se connecter</MenuItem>}
                </Menu>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
