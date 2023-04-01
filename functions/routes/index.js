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

/**
 * Незащищенные маршруты
 */
/**
 * POST /signup
 * @summary Регистрация нового пользователя
 * @tags users
 * @example request body:
 * {
 *   "email": "anatoly@yandex.ru",
 *   "password": "verystrongpassword",
 *   "name": "Anatoly"
 * }
 * @return {object} 200 - success response - application/json
 * @example response - 200 ОК:
 * {
 *   "_id": "64283e4635e0dee12bfc5376",
 *   "email": "anatoly@yandex.ru",
 *   "name": "Anatoly"
 * }
 */
router.post('/signup', validateCreateUser, createUser);

/**
 * POST /signin
 * @summary Аутентификация пользователя
 * @tags users
 * @example request body:
 * {
 *   "email": "anatoly@yandex.ru",
 *   "password": "verystrongpassword",
 * }
 * @return {object} 200 - success response - application/json
 * @example response - 200 ОК:
 * {
 *  "token": "verylongtoken"
 * }
 */
router.post('/signin', validateLogin, login);

/**
 * GET /posts
 * @summary Получение массива постов
 * @tags posts
 * @return {array} 200 - success response - application/json
 * @example response - 200 ОК:
 * [
 *   {
 *       "_id": "6426fb7206f323dded88595d",
 *       "content": "<h1>Текст поста<h1>",
 *       "filename": "original-1hdk.jpg",
 *       "filelink": "https://firebasestorage.googleapis.com/file.jpg",
 *       "pubdate": "2023-03-31T00:00:00.000Z",
 *       "owner": {
 *           "_id": "6421a55c4c222dd35c81b446",
 *           "email": "anatoly@yandex.ru",
 *           "name": "Anatoly"
 *       }
 * ]
 */
router.get('/posts', getPosts);

/**
 * Защищенные маршруты
 */
router.use(auth);

/**
 * GET /users/me
 * @summary Авторизация пользователя
 * @tags users
 * @example request headers:
 * {
 *   "Authorization": "Bearer verylongtoken"
 * }
 * @return {object} 200 - success response - application/json
 * @example response - 200 ОК:
 * {
 *   "_id": "64283e4635e0dee12bfc5376",
 *   "email": "anatoly@yandex.ru",
 *   "name": "Anatoly"
 * }
 */
router.get('/users/me', getUserInfo);

/**
 * GET /posts/deferred
 * @summary Получение массива постов пользователя с отложенной датой публикации
 * @tags posts
 * @example request headers:
 * {
 *   "Authorization": "Bearer verylongtoken",
 * }
 * @return {array} 200 - success response - application/json
 * @example response - 200 ОК:
 * [
 *   {
 *       "_id": "6426fb7206f323dded88595d",
 *       "content": "<h1>Текст поста<h1>",
 *       "filename": "original-1hdk.jpg",
 *       "filelink": "https://firebasestorage.googleapis.com/file.jpg",
 *       "pubdate": "2023-03-31T00:00:00.000Z",
 *       "owner": {
 *           "_id": "6421a55c4c222dd35c81b446",
 *           "email": "anatoly@yandex.ru",
 *           "name": "Anatoly"
 *       }
 * ]
 */
router.get('/posts/deferred', getDeferredPosts);

/**
 * POST /posts
 * @summary Создание нового поста
 * @tags posts
 * @example request headers:
 * {
 *   "Authorization": "Bearer verylongtoken",
 * }
 * request body:
 *   {
 *       "content": "<h1>Текст поста<h1>",
 *       "filename": "original-1hdk.jpg",
 *       "filelink": "https://firebasestorage.googleapis.com/file.jpg",
 *       "pubdate": "2023-03-31",
 *   }
 * @return {object} 200 - success response - application/json
 * @example response - 200 ОК:
 *   {
 *       "_id": "6426fb7206f323dded88595d",
 *       "content": "<h1>Текст поста<h1>",
 *       "filename": "original-1hdk.jpg",
 *       "filelink": "https://firebasestorage.googleapis.com/file.jpg",
 *       "pubdate": "2023-03-31T00:00:00.000Z",
 *       "owner": {
 *           "_id": "6421a55c4c222dd35c81b446",
 *           "email": "anatoly@yandex.ru",
 *           "name": "Anatoly"
 *       }
 */
router.post('/posts', validatePost, createPost);

/**
 * PATCH /posts/:postId
 * @summary Редактирование поста
 * @tags posts
 * @example request headers:
 * {
 *   "Authorization": "Bearer verylongtoken",
 * }
 * request body:
 *   {
 *       "content": "<h1>Текст поста<h1>",
 *       "filename": "original-1hdk.jpg",
 *       "filelink": "https://firebasestorage.googleapis.com/file.jpg",
 *       "pubdate": "2023-03-31",
 *   }
 * request params: /:postId
 * @return {object} 200 - success response - application/json
 * @example response - 200 ОК:
 *   {
 *       "_id": "6426fb7206f323dded88595d",
 *       "content": "<h1>Новый текст поста<h1>",
 *       "filename": "original-1hdk.jpg",
 *       "filelink": "https://firebasestorage.googleapis.com/file.jpg",
 *       "pubdate": "2023-03-31T00:00:00.000Z",
 *       "owner": {
 *           "_id": "6421a55c4c222dd35c81b446",
 *           "email": "anatoly@yandex.ru",
 *           "name": "Anatoly"
 *       }
 */
router.patch('/posts/:postId', validatePost, updatePost);

/**
 * DELETE /posts/:postId
 * @summary Удаление поста
 * @tags posts
 * @example request headers:
 * {
 *   "Authorization": "Bearer verylongtoken",
 * }
 * request params: /:postId
 * @return {object} 200 - success response - application/json
 * @example response - 200 ОК:
 *   {
 *      message: Пост удален.
 *   }
 */
router.delete('/posts/:postId', validateDeletePost, deletePost);

// Несуществующий маршрут
router.use('*', handleMissingRoute);

module.exports = router;
