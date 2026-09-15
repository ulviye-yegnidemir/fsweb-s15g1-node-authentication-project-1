// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!


/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */


// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

const router = require("express").Router();
const Users = require("./users-model");
const {restricted} = require("../auth/auth-middleware");

router.get("/",restricted,async(req,res,next) => {
  try {
    const kullanicilar = await Users.bul();
    res.status(200).json(kullanicilar);
  }catch (error){
    next(error);
  }
});
module.exports = router;
