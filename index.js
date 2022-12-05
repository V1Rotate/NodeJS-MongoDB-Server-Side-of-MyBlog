import express from 'express';
import mongoose from 'mongoose';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations.js'; // .js extension has to be typed
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

// connecting MongoDB with messages to console.log
mongoose
  .connect(
    'mongodb+srv://admin:env.local.PASSWORD@cluster0.umfdjvr.mongodb.net/blog?retryWrites=true&w=majority' // blog inseted between / and ?, so it will know that we need to connect not to the server in general but to the exact data base
  )
  .then(() => console.log('DB Ok'))
  .catch((err) => console.log('DB error', err));

//setting up the express framework
const app = express();

app.use(express.json());

app.post('/auth/login', UserController.login); //all the internals from app.post related to login, register and me was transferred to userController file to mae the core more readable

// validator checked if we get propertied from the user, if yes - it will let req-res to proceed.
app.post(
  '/auth/register',
  postCreateValidation,
  registerValidation,
  UserController.register
);

app.get('/auth/me', checkAuth, UserController.getMe); //moved to separated functions in UserController and just imported here.

//app.get('/posts', PostController.getAll);
//app.get('/posts/:id', PostController.getOne); ++ id added
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
//app.delete('/posts', PostController.remove);
//app.patch('/posts', PostController.update);

//set up port 44444, did not select 3000 not to interfere with another porject I have runnning, by chance
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server is running');
});
