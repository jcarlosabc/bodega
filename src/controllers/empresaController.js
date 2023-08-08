const conexion = require("../database/db");

exports.panel = async (req, res) => {

 res.render("user/dashboard", { user: req.user
  });
};