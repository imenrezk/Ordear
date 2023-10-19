const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const RandomString = require("randomstring");
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('../models/user.model');
const send = require('../utils/config/EmailInscription')
const sendF = require('../utils/config/ForgotPwdConfig');
const rsendF = require('../utils/config/ResendPwdCode');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URI,
      profileFields: ["email", "name"]
    },
    async (accessToken, refreshToken, profile, res) => {
      const userData = {
        email: profile.email,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
      };
      new User(userData).save();
      console.log({ profile: profile });
    }
  )
);

// --------------- Email send -------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.PASSWORD}`,
  },
});

const AuthController = {

  registerClient: async (req, res) => {
    try {
      const content = 'Thank you for join us! Please copy the code below to validate your email address and start exploring our application.';
      const { firstName, lastName, email, password, passwordVerify } = req.body;
      if (!firstName || !lastName || !email || !password || !passwordVerify) {
        return res
          .status(400)
          .json({ message: "Not all fields have been entered" });
      }
      User.findOne({ email }).then((user) => {
        if (user) { return res.status(400).json({ error: "Email is already taken" }); }
      });

      if (password !== passwordVerify) { return res.status(400).json({ error: "Mismatch password" }); }

      const activationCode = RandomString.generate({ length: 4, charset: "numeric", });
      const token = jwt.sign(
        { firstName, lastName, email, password, passwordVerify, activationCode },
        `${process.env.JWT_ACC_ACTIVATE}`,
        { expiresIn: "10m" }
      );
      const email_content = {email:req.body.email , content:content , activationCode : activationCode};
      res.cookie("token", token, { expiresIn: "10m",  overwrite: true });
      send.sendMailInscription(email_content, res)

    } catch (err) { return res.status(500).json({ message: "Register failed" + "" + err.message }); }
  },

  activateAccount: async (req, res) => {
    try {
      const token = req.cookies.token;
      if (token) {
        jwt.verify(
          token,
          `${process.env.JWT_ACC_ACTIVATE}`,
          function (err, decodedToken) {
            if (err) {
              return res
                .status(400)
                .json({ error: "Incorrect or Expired code." });
            }
            const { firstName, lastName, email, password, activationCode } = decodedToken;
            User.findOne({ email }).then(async (err, user) => {
              if (user) {
                return res
                  .status(400)
                  .json({ error: "User with this email already exists." });
              }
              const salt = await bcrypt.genSalt();
              const passwordHash = await bcrypt.hash(password, salt);
              const code = req.body.activationCode;

              if (code !== activationCode) {
                return res.status(400).json({ error: "Mismatch code" });
              }

              const newUser = new User({
                firstName,
                lastName,
                image: 'client.png',
                phone: "+1 11111111",
                address: "Montreal, Canada",
                birthday: "01/01/2023",
                email,
                password: passwordHash,
                role: 'client',
                activate: 1

              });
              newUser.save()
                .then(savedUser => {
                  res.status(200).json({ message: "successfully registered"  })
                })
                .catch(err => {
                  console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', err);
                });
            });
          }
        );
      } else { return res.json({ error: "Something went wrong." }); }
    } catch (err) { return res.status(500).json({ message: "Register failed" + "" + err.message }); }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Not all fields have been entered" });
      }


      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ message: "No account with this email has been found" });
      }

      const activation = user.activate;
      if (!activation) {
        return res.json({ message: "User deactivated" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!user.firstLogin) {
        await User.updateOne({ email: email }, { $set: { firstLogin: true } });
        console.log("updated");
      }

      const tokenLogin = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      res.cookie("tokenLogin", tokenLogin);
      return res.json({
        tokenLogin,
        user: {
          id : user._id,
          role: user.role,
          firstLogin: user.firstLogin,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },



  forgotPasswordWithCode: async (req, res) => {
    try {
      const content = 'Just copy the code below in your interface to validate your email address...';
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ message: "Email field is empty" });
      }
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          return res.status(400).json({ error: "User does not exist" });
        }
      });

      const activationCodeForgotPass = RandomString.generate({
        length: 4,
        charset: "numeric",
      });
      const tokenForgotPass = jwt.sign(
        { email, activationCodeForgotPass },
        `${process.env.JWT_ACC_ACTIVATE}`,
        { expiresIn: "2m" }
      );

      res.cookie("tokenForgotPass", tokenForgotPass, { expiresIn: "2m", overwrite: true });

      const forgotten_content = {email:req.body.email , content:content, activationCodeForgotPass: activationCodeForgotPass};
      sendF.sendMailForgot(forgotten_content,res);

    } catch (err) {
      return res.status(500).json({ message: "Something wrong " + err.message });
    }

  },

  resendForgotCode: async (req, res) => {
    const tokenForgotPass = req.cookies.tokenForgotPass;
    const decodedToken = jwt.verify(tokenForgotPass, process.env.JWT_ACC_ACTIVATE);
    const emailR = decodedToken.email;

    const content = 'Just copy the code below in your interface to validate your email address..';

    const activationResendCode = RandomString.generate({
      length: 4,
      charset: "numeric",
    });
    const tokenResendCode = jwt.sign(
      { emailR, activationResendCode },
      `${process.env.JWT_ACC_ACTIVATE}`,
      { expiresIn: "2m" }
    );

    const resendForgotten_content = {email:emailR , content:content, activationResendCode : activationResendCode};
    rsendF.sendMailResendForgot(resendForgotten_content,res);

    res.cookie("tokenResendCode", tokenResendCode, { expiresIn: "2m" , overwrite: true });
  },

  verifCodeForgotPassword: async (req, res) => {
    try {
      const code = req.body.activationCodeForgotPass;

      // ---------- tokenForgot ---------------------------
      const tokenForgotPass =  req.cookies.tokenResendCode  ||  req.cookies.tokenForgotPass
      const decodedTokenForgotPass = jwt.verify(tokenForgotPass, process.env.JWT_ACC_ACTIVATE)
      const codeForgot =  decodedTokenForgotPass.activationResendCode || decodedTokenForgotPass.activationCodeForgotPass;
      const email = decodedTokenForgotPass.emailR || decodedTokenForgotPass.email;
   
      console.log('code ',codeForgot);
      if (tokenForgotPass && code === codeForgot) {

        User.findOne({ email }).then(async (user) => {
          if (!user) {
            return res
              .status(400)
              .json({ error: "User does not exist" });
          }
        else{
          res.cookie("tokenForgotPass", tokenForgotPass, { overwrite: true});

            res.status(201).json({ message: 'Code verification verified' });
          }
        });

      }
      else {
        return res
              .status(400)
              .json({ error: "invalid code" });
      
     }
   } catch (err) {
      return res.status(500).json({ message: "error " + err.message });
    }
  },


  resetPassword: async (req, res) => {
    try {
      const tokenForgotPass = req.cookies.tokenForgotPass;
      let decodeTokenLogin = jwt_decode(tokenForgotPass);
      let emailUser = decodeTokenLogin.emailR || decodeTokenLogin.email;

      const confirmPassword = req.body.confirmPassword;
      const password = req.body.password;

      if (!password || !confirmPassword) {
        return res
          .status(400)
          .json({ message: "Not all fields have been entered" });
      }
      if (password != confirmPassword) {
        return res.status(400).json({ error: "Mismatch password" });
      }

      let salt = bcrypt.genSaltSync(10);
      User.updateOne(
        { "email": emailUser },
        { $set: { "password": bcrypt.hashSync(password, salt) } }
      )
        .then(() => {
          res.json({ message: "Password updated" })
        })
        .catch((err) => { throw (err); })
    } catch (err) {
      return res.status(500).json({ message: "Password updating error" + err.message });
    }
  },
  logout: async (req, res) => { 

    try {
      res.cookie("tokenLogin", null , {
        httpOnly: true,
        overwrite : true
      });
      res.json({ message: "Logged out" });
    } catch (err) {
      return res.status(500).json({ message: "Logout failed" + err.message });
    }
  },


}


module.exports = AuthController;
