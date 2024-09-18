const express = require("express");
const router = express.Router();
const userRoute = require("./user.routes");

const routes = [
  {
    path: "/api/user",
    route: userRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
