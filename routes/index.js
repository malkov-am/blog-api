const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/requestValidation');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

// Обработчик несуществующего маршрута
const handleMissingRoute = (req, res, next) => {
  next(new NotFoundError({ message: 'Ресурс не найден. Проверьте URL и метод запроса.' }));
};

// Незащищенные маршруты
router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

// Защищенные маршруты
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

// Несуществующий маршрут
router.use('*', handleMissingRoute);

module.exports = router;
