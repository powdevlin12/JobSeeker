var jwt = require('jsonwebtoken');

module.exports = {
genaralAccessToken : (_id, role) => {
  return jwt.sign({ _id, role }, process.env.SECRET_TOKEN_KEY, {
    expiresIn: process.env.ACCESS_EXPIRESIN
  }, function (err, token) {
    if (err) {
      console.log(err)
    } else {
      console.log('token '+ token)
    }
  })
},
 genaralRefreshToken : (_id, role, accessToken) => {
  return jwt.sign({ _id, role }, accessToken, {
    expiresIn: process.env.REFRESH_EXPIRESIN
  }, function (err, token) {
    if (err) {
      console.log(err)
    } else {
      console.log('token '+ token)
    }
  })
} 
}