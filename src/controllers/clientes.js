const conexion = require("../database/db");

exports.dashboardVendedor = async (req, res) => {

 res.render("user/dashboard", { user: req.user
  });
};