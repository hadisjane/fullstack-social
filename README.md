# Социальная сеть

## Описание

социальная сеть - приложение, которое позволяет пользователям регистрироваться, логиниться, создавать посты, добавлять друзей, общаться в чате. Это full-stack приложение, которое использует React на клиентской стороне, Node.js на серверной стороне и MongoDB как базу данных.

## Технологии

**Фронтенд:**
- React, Redux, React Hook Form, React Router Dom, Socket.io-client, Axios, Emotion, Mui

**Бэкенд:**
- Node.js, Express, Mongoose, Nodemon, Helmet, Morgan, Multer, Socket.io

**База данных:**
- MongoDB


## Как запустить проект

1. Установите Node.js, если у вас его нет
2. Установите MongoDB, если у вас его нет
3. Клонируйте репозиторий
4. Введите `npm install` в терминале, чтобы установить все зависимости
5. Создайте файл `.env` в api и client
6. Перейдите в api и введите `npm start` в терминале, чтобы запустить сервер
7. Перейдите в client и введите `npm start` в терминале, чтобы запустить клиентскую часть
8. Перейдите в socket и введите `npm start` в терминале, чтобы запустить socket
9. Откройте веб-браузер и перейдите на `http://localhost:3000`

## env

Создайте файл `.env` в директории api.

В файле `.env` в необходимо прописать следующие переменные:

* `MONGO_URL` - URL для подключения к MongoDB (например, `mongodb://localhost:27017/social-network`)
* `PORT` - ваш порт (например 5500)

Создайте файл `.env` в директории client.

В файле `.env` в необходимо прописать следующие переменные:

* `REACT_APP_PUBLIC_FOLDER` - путь к папке public (например, http://localhost:8800/images/)

