import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login/form.css";
import config from "../config";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // Gérer l'inscription au site
  const handleSignup = async () => {
    // Vérifier si les champs sont remplis
    if (!firstName || !lastName || !email || !password) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    try {
      // Requête pour l'inscription d'un utilisateur
      await axios.post(`${config.apiUrl}/user/signup`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      // redirection vers la page de connexion
      navigate(`/login`);
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      // Gérer les messages d'erreur
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <div>
          <h2>Créer un compte</h2>
          {error && <p className="error-msg">{error}</p>}
          {/* Début champs du formulaire */}
          <div className="input-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Fin des champs du formulaire  */}
          <button className="submit-btn" onClick={handleSignup}>
            S'inscrire
          </button>

          <p>
            Vous avez déjà un compte ? <NavLink to="/login">Connectez-vous ici</NavLink>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
