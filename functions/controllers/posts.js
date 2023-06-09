// Импорты
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Post = require('../models/post');

// Возвращает все посты
function getPosts(req, res, next) {
  const currentDate = new Date();
  Post.find({ pubdate: { $lte: currentDate } })
    .populate('owner')
    .then((populatedPosts) => res.send(populatedPosts))
    .catch(next);
}

// Возвращает посты с отложенной датой публикации
function getDeferredPosts(req, res, next) {
  const currentDate = new Date();
  Post.find({ owner: req.user._id, pubdate: { $gt: currentDate } })
    .populate('owner')
    .then((populatedPosts) => res.send(populatedPosts))
    .catch(next);
}

// Создаёт пост
function createPost(req, res, next) {
  const { content, filename, filelink, pubdate } = req.body;
  Post.create({
    content,
    filename,
    filelink,
    pubdate,
    owner: req.user,
  })
    .then((post) => {
      post.populate('owner').then((populatedPost) => res.send(populatedPost));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: 'Переданы некорректные данные при создании поста.',
          }),
        );
      }
      return next(err);
    });
}

// Редактирует пост
function updatePost(req, res, next) {
  const { content, filename, filelink, pubdate } = req.body;
  Post.findById(req.params.postId)
    .orFail(new NotFoundError({ message: 'Пост с указанным _id не найден.' }))
    .then((post) => {
      if (post.owner._id.toString() !== req.user._id) {
        return next(new ForbiddenError({ message: 'Вы не являетесь автором поста.' }));
      }
      return Post.findByIdAndUpdate(
        req.params.postId,
        { content, filename, filelink, pubdate },
        { new: true, runValidators: true },
      )
        .populate('owner')
        .then((updatedPost) => {
          res.send(updatedPost);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(
              new BadRequestError({
                message: 'Переданы некорректные данные при обновлении поста.',
              }),
            );
          }
          return next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError({
            message: 'Передан некорректный _id поста.',
          }),
        );
      }
      return next(err);
    });
}

// Удаляет пост по id
function deletePost(req, res, next) {
  Post.findById(req.params.postId)
    .orFail(new NotFoundError({ message: 'Пост с указанным _id не найден.' }))
    .then((post) => {
      if (post.owner._id.toString() !== req.user._id) {
        return next(new ForbiddenError({ message: 'Вы не являетесь автором поста.' }));
      }
      return Post.findByIdAndRemove(req.params.postId).then(() => {
        res.send({ message: 'Пост удален.' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError({
            message: 'Передан некорректный _id поста.',
          }),
        );
      }
      return next(err);
    });
}

module.exports = { getPosts, getDeferredPosts, createPost, updatePost, deletePost };
