const express = require('express');
const router = express.Router();
const {
    getItems,
    setItem,
    updateItem,
    deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

router.route('/').get(getItems).post(protect, upload.single('image'), setItem);
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem);

module.exports = router;
