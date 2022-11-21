const express = require("express");
const admins = require("../controllers/admin.controller");

const router = express.Router();

router.route("/")
    .get(admins.findAll)
    .post(admins.create)
    .delete(admins.deleteAll);

router.route("/favorite")
    .get(admins.findAllFavorite);

router.route("/:id")
    .get(admins.findOne)
    .put(admins.update)
    .delete(admins.delete);

module.exports = router;
