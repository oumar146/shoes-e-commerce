import React, { useEffect, useState , useContext} from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import config from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const { user } = useContext(UserContext);
  
  const { cart, removeFromCart } = useCart();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const navigate = useNavigate();

  // Etats pour formulaire client
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  // Etats pour paiement
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Charger tous les produits en stock une seule fois
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/product/stock`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Met à jour les produits à afficher selon id ou panier
  useEffect(() => {
    if (products.length === 0) return;

    if (id) {
      const prod = products.find((p) => p.product_id === Number(id));
      setDisplayedProducts(prod ? [prod] : []);
    } else {
      const prodsInCart = cart
        .map((item) => products.find((p) => p.product_id === item.product_id))
        .filter(Boolean);
      setDisplayedProducts(prodsInCart);
    }
  }, [products, id, cart]);

  // Calculs
  const shippingFee = 0;
  const priceSum = displayedProducts.reduce(
    (sum, prod) => sum + Number(prod.price),
    0
  );
  const total = priceSum + shippingFee;

  // Formatage du numéro de carte (espaces tous les 4 chiffres)
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .substring(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  // Gestion saisie numéro de carte
  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  // Gestion saisie date d'expiration MM/AA
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);

    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    setExpiryDate(value);
  };

  // Gestion saisie CVC (3 chiffres max)
  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.substring(0, 3);
    setCvc(value);
  };

  // Validation formulaire
  const handleSubmit = async (cart, user_id, total) => {

        if (
      !prenom ||
      !nom ||
      !adresse ||
      !codePostal ||
      !ville ||
      !tel ||
      !email ||
      !cardNumber ||
      cardNumber.replace(/\s/g, "").length !== 16 ||
      !expiryDate ||
      expiryDate.length !== 5 ||
      !cvc ||
      cvc.length !== 3
    ) {
      alert("Merci de remplir correctement tous les champs du formulaire.");
      return;
    }
  try {
    const orders = cart.map((item) => {
      const product = products.find(p => p.product_id === item.product_id);
      const unitPrice = product ? Number(product.price) : 300; // fallback 300 si produit introuvable

      return {
        product_id: item.product_id,
        user_id: user_id,
        unit_price: unitPrice,
        status_id: 1,
        amount: total,
        quantity: item.quantity,
      };
    });


    const response = await axios.post(`${config.apiUrl}/order/new`, { orders });

    orders.forEach(order => {
      removeFromCart(order.product_id);
    });

    if (response.data.success) {
      alert("Commande passée avec succès !");
      navigate("/")
    } else {
      alert("Erreur lors de la commande : " + response.data.message);
    }

  } catch (error) {
    console.error("Erreur lors de la commande :", error);
    alert("Une erreur est survenue lors de la commande.");
  }
};

  return (
    <div>
      <Header />

      <Box p={4}>
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          flexDirection={{ xs: "column", md: "row" }}
        >
          {/* FORMULAIRE CLIENT */}
          <Grid item xs={12} md={7} sx={{ width: { xs: "100%", md: "40%" } }}>
            <Typography variant="h5" gutterBottom>
              Informations client
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <TextField
                label="Prénom"
                variant="outlined"
                fullWidth
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              <TextField
                label="Nom"
                variant="outlined"
                fullWidth
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
              <TextField
                label="Adresse"
                variant="outlined"
                fullWidth
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
              />
              <TextField
                label="Code postal"
                variant="outlined"
                fullWidth
                value={codePostal}
                onChange={(e) => setCodePostal(e.target.value)}
              />
              <TextField
                label="Ville"
                variant="outlined"
                fullWidth
                value={ville}
                onChange={(e) => setVille(e.target.value)}
              />
              <TextField
                label="Numéro de téléphone"
                variant="outlined"
                fullWidth
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Divider sx={{ my: 2 }} />

              {/* Méthodes de paiement */}
              <Typography variant="h6">Méthode de paiement</Typography>
              <TextField
                label="Numéro de carte"
                variant="outlined"
                fullWidth
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                inputProps={{ maxLength: 19 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Date d’expiration"
                    variant="outlined"
                    fullWidth
                    placeholder="MM/AA"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="CVC"
                    variant="outlined"
                    fullWidth
                    placeholder="123"
                    value={cvc}
                    onChange={handleCvcChange}
                    inputProps={{ maxLength: 3 }}
                  />
                </Grid>
              </Grid>


              <Button
                variant="contained"
                style={{ backgroundColor: "#232321" , marginTop:"5vh"}}
                size="large"
                 onClick={()=>{handleSubmit(cart, user.id, total)}}
              >
                Procéder au paiement
              </Button>
            </Box>
          </Grid>

          {/* RÉCAPITULATIF */}
          <Grid item xs={12} md={5} sx={{ width: { xs: "100%", md: "38%" } }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
              <Typography variant="h6" gutterBottom>
                Récapitulatif de commande
              </Typography>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography>Prix des articles</Typography>
                <Typography>{priceSum.toFixed(2)} €</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Frais de livraison</Typography>
                <Typography>{shippingFee.toFixed(2)} €</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="green">
                  {total.toFixed(2)} €
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Affichage des produits */}
              {displayedProducts.length > 0 ? (
                displayedProducts.map((prod, index) => (
                  <Box key={`${prod.product_id} - ${index}`} mt={2} mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                      Produit sélectionné
                    </Typography>
                    <Box display="flex" gap={2} alignItems="center">
                      <Box
                        component="img"
                        src={prod.image_url}
                        alt={prod.product_name}
                        sx={{ width: 80, height: 80, objectFit: "contain" }}
                      />
                      <Box>
                        <Typography fontWeight="bold">
                          {prod.product_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {prod.description}
                        </Typography>
                        <Typography fontWeight="bold" mt={1}>
                          {Number(prod.price).toFixed(2)} €
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography mt={2} color="text.secondary">
                  {id ? "Chargement du produit..." : "Votre panier est vide."}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};

export default PaymentPage;
