const router = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { validateUpdateUserInfo } = require('../middlewares/requestValidation');

// Возвращает информацию о пользователе (email и имя)
router.get('/me', getUserInfo);
// Обновляет информацию о пользователе (email и имя)
router.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
