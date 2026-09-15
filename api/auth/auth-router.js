// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */


/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model");

const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require("./auth-middleware");

// KAYIT OLMA
router.post(
  "/register",
   checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const kullanici = req.body;
      kullanici.password = bcrypt.hashSync(kullanici.password, 8);
      const yeniKullanici = await Users.ekle(kullanici);
      res.status(201).json(yeniKullanici);
    } catch (error) {
      next(error);
    }
  }
);

// GİRİŞ YAPMA
router.post(
  "/login",
    checkUsernameExists,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const sifreDogruMu = bcrypt.compareSync(
        req.body.password,
        req.user.password
      );

      if (!sifreDogruMu) {
        return res.status(401).json({
          message: "Geçersiz kriter!",
        });
      }

      req.session.userId = req.user.user_id;

      res.status(200).json({
        message: "Hoşgeldin " + req.user.username + "!",
      });
    } catch (error) {
      next(error);
    }
  }
);

// ÇIKIŞ YAPMA
router.get("/logout", (req, res, next) => {
  if (!req.session.userId) {
    return res.status(200).json({
      message: "Oturum bulunamadı!",
    });
  }
    
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.status(200).json({
        message: "Çıkış yapildi",
      });
    });
  });

module.exports = router;