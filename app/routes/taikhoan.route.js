const express = require("express");
const TaiKhoan = require("../controllers/taikhoan.controller");

const router = express.Router();

router.route("/")
    .get(TaiKhoan.findAll)
    .post(TaiKhoan.create)
    .delete(TaiKhoan.deleteAll);

router.route("/:id")
    .get(TaiKhoan.findOne)
    .put(TaiKhoan.update)
    .delete(TaiKhoan.delete);

module.exports = router;
