const express = require('express');
const router = express.Router();
const {
    getWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registerForWorkshop,
} = require('../controllers/workshopController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.route('/')
    .get(protect, authorize('seller'), getWorkshops)
    .post(protect, authorize('seller'), createWorkshop);

router.route('/:id')
    .get(getWorkshopById)
    .put(protect, authorize('seller'), updateWorkshop)
    .delete(protect, authorize('seller'), deleteWorkshop);

router.route('/:id/register')
    .post(protect, registerForWorkshop);

module.exports = router;
