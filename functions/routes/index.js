const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validateCreateUser,
  validateLogin,
  validatePost,
  validateDeletePost,
} = require('../middlewares/requestValidation');
const { getUserInfo, createUser, login } = require('../controllers/users');
const {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  getDeferredPosts,
} = require('../controllers/posts');
const NotFoundError = require('../errors/NotFoundError');

// Обработчик несуществующего маршрута
const handleMissingRoute = (req, res, next) => {
  next(
    new NotFoundError({
      message: 'Ресурс не найден. Проверьте URL и метод запроса.',
    }),
  );
};

// Незащищенные маршруты
router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);
router.get('/posts', getPosts);

// Защищенные маршруты
router.use(auth);
router.get('/users/me', getUserInfo);
router.get('/posts/deferred', getDeferredPosts);
router.post('/posts', validatePost, createPost);
router.patch('/posts/:postId', validatePost, updatePost);
router.delete('/posts/:postId', validateDeletePost, deletePost);

// Несуществующий маршрут
router.use('*', handleMissingRoute);

module.exports = router;
