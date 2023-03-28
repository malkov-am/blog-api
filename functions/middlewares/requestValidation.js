const { celebrate, Joi } = require('celebrate');

// Кастомная валидация mongoose id
function validateId(id, helper) {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  return helper.message('Передан некорретный id.');
}

// Кастомная валидация email
function validateEmail(email, helper) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return email;
  }
  return helper.message('Некорректный адрес электронной почты.');
}

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      'any.required': 'Поле E-mail обязательно для заполнения.',
      'string.custom': 'Некорректный адрес электронной почты.',
    }),
    password: Joi.string().required().min(6).max(30).messages({
      'any.required': 'Поле Пароль обязательно для заполнения.',
      'string.min': 'Поле Пароль не должно быть короче 6 символов.',
      'string.max': 'Поле Пароль не должно быть длиннее 30 символов.',
    }),
    name: Joi.string().required().min(2).max(30).messages({
      'any.required': 'Поле Имя обязательно для заполнения.',
      'string.min': 'Поле Имя не должно быть короче 2 символов.',
      'string.max': 'Поле Имя не должно быть длиннее 30 символов.',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      'any.required': 'Поле E-mail обязательно для заполнения.',
      'string.custom': 'Некорректный адрес электронной почты.',
    }),
    password: Joi.string().required().min(6).max(30).messages({
      'any.required': 'Поле Пароль обязательно для заполнения.',
      'string.min': 'Поле Пароль не должно быть короче 6 символов.',
      'string.max': 'Поле Пароль не должно быть длиннее 30 символов.',
    }),
  }),
});

const validatePost = celebrate({
  body: Joi.object().keys({
    content: Joi.string().required().messages({
      'any.required': 'Не передано поле "content".',
    }),
    attachment: Joi.string().uri().messages({
      'any.required': 'Не передано поле "attachment".',
    }),
  }),
});

const validateDeletePost = celebrate({
  params: Joi.object().keys({
    postId: Joi.string().required().custom(validateId).messages({
      'any.required': 'Не передан id удаляемого поста.',
      'string.custom': 'Некорректный id поста.',
    }),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validatePost,
  validateDeletePost,
};
