import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Import du contexte utilisateur
import axios from "axios";
import "../styles/login/form.css";
import config from "../config";

const login = async (email, password, setError, updateUser) => {
  try {
    const response = await axios.post(`${config.apiUrl}/user/login`, {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem("token", token); // Stocker le token
    updateUser(user); // Mettre à jour l'utilisateur dans le contexte
    setError(""); // Réinitialise les erreurs en cas de succès
    return token;
  } catch (error) {
    console.error("Erreur de connexion :", error);
    if (error.response && error.response.data.error) {
      setError(error.response.data.error); // Définit l'erreur si le backend envoie une erreur
    } else {
      setError("Une erreur est survenue lors de la connexion");
    }
    return null;
  }
};

const Login = () => {
  const [email, setEmail] = useState("invité1@gmail.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext); // Utilisation du contexte

  // Gérer la connexion de l'utilisateur
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Tous les champs doivent être remplis.");
        return;
      }
      const token = await login(email, password, setError, updateUser);

      if (token) {
        navigate("/#/home");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
  
      <div className="login-container">
        <div className="login-box">
          <h2>Connexion à votre compte</h2>
          {!error && (
            <p>Entrez votre email et votre mot de passe pour vous connecter</p>
          )}
          {error && <p className="error">{error}</p>}
          <div className="input-group">
            <label htmlFor="yourEmail">Email</label>
            <input
              type="email"
              id="yourEmail"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="yourPassword">Mot de passe</label>
            <input
              type="password"
              id="yourPassword"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="submit-btn" onClick={handleLogin}>
            Connexion
          </button>
          <p>
            Vous n'avez pas de compte ?{" "}
            <NavLink to="/signup">Inscrivez-vous ici</NavLink>
          </p>
        </div>
      </div>
  );
};

export default Login;
