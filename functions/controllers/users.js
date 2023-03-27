// Импорты
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { CREATED_CODE } = require('../utils/constants');

const { JWT_SECRET = 'very-secret-key' } = process.env;

// Получение информации о пользователе
function getUserInfo(req, res, next) {
  User.findById(req.user._id)
    .orFail(new NotFoundError({ message: 'Пользователь по указанному _id не найден.' }))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}

// Обновление информации о пользователе
function updateUserInfo(req, res, next) {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError({ message: 'Пользователь по указанному _id не найден.' }))
    .then((updatedUserData) => {
      res.send(updatedUserData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError({
            message: `Пользователь с таким email: ${email} уже зарегестрирован.`,
          }),
        );
      }
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: 'Переданы некорректные данные при обновлении профиля.',
          }),
        );
      }
      return next(err);
    });
}

// Регистрация нового пользователя
function createUser(req, res, next) {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(
          new ConflictError({
            message: `Пользователь с таким email: ${user.email} уже зарегестрирован.`,
          }),
        );
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            email,
            password: hash,
            name,
          }),
        )
        .then((newUser) =>
          res.status(CREATED_CODE).send({
            _id: newUser._id,
            email,
            name,
          }),
        );
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError({
            message: 'Пользователь с таким email уже зарегестрирован.',
          }),
        );
      }
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError({
            message: 'Переданы некорректные данные при регистрации пользователя.',
          }),
        );
      }
      return next(err);
    });
}

// Вход в систему
function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token }).end();
    })
    .catch(next);
}

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
};
