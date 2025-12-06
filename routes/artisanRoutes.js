const express = require('express');
const router = express.Router();
const {
    getArtisans,
    getArtisanById,
    createArtisan,
    updateArtisan,
    deleteArtisan,
} = require('../controllers/artisanController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.route('/')
    .get(protect, authorize('seller'), getArtisans)
    .post(protect, authorize('seller'), createArtisan);

router.route('/:id')
    .get(getArtisanById)
    .put(protect, authorize('seller'), updateArtisan)
    .delete(protect, authorize('seller'), deleteArtisan);

module.exports = router;
