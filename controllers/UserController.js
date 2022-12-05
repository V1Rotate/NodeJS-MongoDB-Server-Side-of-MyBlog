import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()); //we return errors if they are found.
    }

    //before the document preparation below, we need totake our open password and encrypt it. This wll work with async type
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt); //we pass the password and algorythms of the password encryption

    //Preparing a document for a user creation with MongoDB
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash, //encrypted password as per above
    });

    const user = await doc.save(); // the result we get from MongoDB will be save in use variable.

    const token = jwt.sign(
      {
        //creating user token with id.
        _id: user._id,
      },
      'olegsecret', //secret key which secured the user token.
      {
        expiresIn: '30d', //token lifetime.
      }
    );

    const { passwordHash, ...userData } = user._doc; //splicing out the passwordHash not to make it visible.

    res.json({ ...userData, token }); //at this point I  return the user data & token, otherwise return err. Passwordhash is not shown in fetched data.
  } catch (err) {
    res.status(500).json({
      //error 500 is gonna be visible in console, but not shown to the user.
      message: 'Registration went wrong',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); //need to find a user by the email. if nothing found, we return response with the message saying that the user is not found.
    if (!user) {
      return req.status(404).json({
        message: 'User not found',
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    ); //password check.

    if (!isValidPass) {
      return res.status(404).json({
        message: 'Your login or password is incorrect', //don't let thefts know what is exactly wrong. Who knows, right?
      });
    }

    //If user is found and his password is correct, we getting a token for him. Basically, the same as at the resistration process.
    const token = jwt.sign(
      {
        //creating user token with id.
        _id: user._id,
      },
      'olegsecret', //secret key which secured the user token.
      {
        expiresIn: '30d', //token lifetime.
      }
    );

    const { passwordHash, ...userData } = user._doc; //splicing out the passwordHash not to make it visible.

    res.json({ ...userData, token }); //at this point I  return the user data & token, otherwise return err. Passwordhash is not shown in fetched data.
  } catch (err) {
    res.status(500).json({
      //error 500 is gonna be visible in console, but not shown to the user.
      message: 'Log in went wrong :(',
    });
  }
};

export const getMe = async (req, res) => {
  //req,res will be started after checkAuth passes the token checking.
  try {
    const user = await UserModel.findById(req.userId); //UserModel needs to find user by findById find data by user Id.
    if (!user) {
      return res.status(404).json({
        message: 'User not found', // if user not found, it get error.
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    res.status(500).json({
      //error 500 is gonna be visible in console, but not shown to the user.
      message: 'No access',
    });
  }
};
