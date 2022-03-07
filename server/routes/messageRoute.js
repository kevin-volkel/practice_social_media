const router = require('express').Router();
const { getChats, getUserInfo, deleteChat } = require('../controllers/messages')

router.route('/').get(getChats)
router.route('/user/:userToFindId').get(getUserInfo)
router.route('/:messagesWith').delete(deleteChat)

module.exports = router;