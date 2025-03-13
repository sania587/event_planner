const express = require('express');
const { createEvent, getEvents } = require('../controllers/eventcontrollers');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createEvent);
router.get('/view', authMiddleware, getEvents);

module.exports = router;
