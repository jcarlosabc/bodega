const express = require("express");
const router = express.Router();
const { isAuthenticated, nologueado, login, logout } = require("../controllers/authController");
const { dashboardVendedor } = require("../controllers/clientes");
router.get("/login", nologueado, (req, res) => { res.render("login", { alert: false });});
router.post("/login", nologueado, login);
router.get("/logout", logout);
/*=========================================================================*/
// * ========== RUTAS DASHBOARD PRINCIPAL ADMIN & VENDEDOR ==========
//                           ↓↓
router.get("/", isAuthenticated, dashboardVendedor, (req, res) => {
    if (!(req.user.rol === "vendedor")) { res.redirect("./administrador"); }
    res.render("user/dashboard", { user: req.user });
  });