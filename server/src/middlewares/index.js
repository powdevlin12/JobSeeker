const jwt = require("jsonwebtoken")

export const middleware = {
  verifyToken: async (req, res, next) => {
    const token = req.header('Authorization')
    if (token) {
      const accessToken = token.split(" ")[1]
      try {
        jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY, (err, data) => {
          err ? console.log(err) : console.log(data)
        })
        next()
      } catch (error) {
        console.log(error)
      }
    }
  }
}