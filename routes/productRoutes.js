const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

router
    .route('/')
    .get(getProducts)
    .post(protect, authorize('seller', 'admin'), createProduct);

router.route('/:id/reviews').post(protect, createProductReview);

router
    .route('/:id')
    .get(getProductById)
    .put(protect, authorize('seller', 'admin'), updateProduct)
    .delete(protect, authorize('seller', 'admin'), deleteProduct);

// Upload endpoint for images
router.post('/upload', protect, authorize('seller', 'admin'), upload.single('image'), (req, res) => {
    res.send(req.file.path);
});

module.exports = router;
