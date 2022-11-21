const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/contact.route");
const adminRouter = require("./app/routes/admin.route");
const TaiKhoanRouter = require("./app/routes/taikhoan.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Welcome to contact book application."});
});

app.use("/api/contacts", contactsRouter);
app.use("/api/admins", adminRouter);
app.use("/api/TaiKhoan", TaiKhoanRouter);

// handle 404 response
app.use((req, res, next) => {
	// Code o day se chay khi khong cos route duoc dinh nghia nao
	// khop yeu cau. Goi next() de chuyen sang middleware xu ly loi
	return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
	// Middleware xử lý lỗi tập trung.
	// Trong các đoạn code xử lý ở các route, gọi next(error)
	// sẽ chuyển về middleware xử lý lỗi này
	return res.status(err.statusCode || 500).json({
		message: err.message || "Internal Server Error",
	});
});	

module.exports = app;