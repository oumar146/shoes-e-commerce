import { HashRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import ArticlesByGender from "./pages/ArticlesByGender";
import PaymentPage from "./pages/PaymentPage";
import ArticlesByCategory from "./pages/ArticlesByCategory";
// Définir les routes
const routes = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/product/detail/:id", element: <ProductDetail /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/cart", element: <Cart /> },
  { path: "/product/gender/:gender", element: <ArticlesByGender /> },
    { path: "/product/category/:category", element: <ArticlesByCategory /> },

      { path: "/product/checkout", element: <PaymentPage /> },
    { path: "/product/checkout/:id", element: <PaymentPage /> },

];

const Router = () => {
  return (
    <UserProvider>
      <FavoritesProvider>
        <CartProvider>
          <HashRouter>
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              {/* Routes protégées */}
              {routes.map(({ path, element }, index) => (
                <Route
                  key={index}
                  path={path}
                  element={element}
                />
              ))}
            </Routes>
          </HashRouter>
        </CartProvider>
      </FavoritesProvider>
    </UserProvider>
  );
};

export default Router;
