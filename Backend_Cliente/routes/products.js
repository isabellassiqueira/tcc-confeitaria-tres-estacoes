const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const productsController = require("../controllers/productsController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

/* ====== ROTAS ====== */
router.get("/", productsController.listProducts);
router.post("/", upload.single("image"), productsController.addProduct);

// 🔹 Rotas específicas SEM parâmetros vêm primeiro
// router.get("/related", productsController.getRelatedProducts);

// 🔹 Agora as que usam :id
router.get("/:id", productsController.getProductById);
router.put("/:id", upload.single("image"), productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);


module.exports = router;
