const Users = require("../users/users-model");
/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function restricted(req,res,next) {
if(req.session.userId) {
  next();
}else {
  res.status(401).json({
    message:"Geçemezsiniz!"
  });
}
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function checkUsernameFree(req,res,next) {
try {
  const kullanicilar = await Users.goreBul({
    username:
    req.body.username,
  });
  if(kullanicilar.length > 0){
    return res.status(422).json({
      message: "Username kullaniliyor",
    });
  }
    return next();
}catch(error){
  return next(error);
}
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function checkUsernameExists(req,res,next) {
try {
  const kullanicilar = await Users.goreBul({
    username:req.body.username,
  });
  if(kullanicilar.length === 0){
    res.status(401).json({
      message:"Geçersiz kriter",
    });
  }else {
    req.user = kullanicilar[0];
    next();
  }
}catch(error){
  next(error);
}
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function checkPasswordLength(req,res,next) {
const {password} = req.body;
if(!password || password.length <= 3) {
  return res.status(422).json({
    message : "Şifre 3 karakterden fazla olmalı",
  });
}
next();
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};