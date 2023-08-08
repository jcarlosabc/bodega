const express = require("express");
const router = express.Router();
const { isAuthenticated, nologueado, login, logout } = require("../controllers/authController");
const { panel } = require("../controllers/empresaController");


// * ========== RUTAS ==========
router.get("/login", nologueado, (req, res) => {
  res.render("login", { alert: false });
});

router.post("/login", nologueado, login);
router.get("/logout", logout);

router.get("/", isAuthenticated, panel);

module.exports = router;
