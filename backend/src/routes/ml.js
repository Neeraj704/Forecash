const router = require('express').Router();
const ctrl = require('../controllers/mlController');
const auth = require('../middleware/auth');

// Mock savings: returns random amount -> TEST API JAB TAK HEMANK ACTUAL NHI DE DETA
router.get('/savings', auth, ctrl.mockSavings);

module.exports = router;
