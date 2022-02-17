const router = require('express').Router();

const { searchUsers } = require('../controllers/search')
const { authMiddleware } = require('../middleware/auth');

router.route('/:searchText').get(authMiddleware, searchUsers)

module.exports = router;
