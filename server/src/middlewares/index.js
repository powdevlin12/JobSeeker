const jwt = require("jsonwebtoken")

module.exports = {
  verifyToken: async (req, res, next) => {
    const token = req.header('Authorization')
    if (token) {
      const accessToken = token.split(" ")[1]
      try {
        jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY, (err, data) => {
          if (err) {
            console.log(err)
            return res.status(401).json({message : "Not authozation", isSuccess : false})
          }
          console.log(data)
          req.data = data
        })
        next()
      } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Server is error", isSuccess : false})
      }
    } else {
      return res.status(400).json({message : "No token", isSuccess : false})
    }
  },
  verifyTokenIsAdmin: async (req, res, next) => {
    const token = req.header('Authorization')
    if (token) {
      const accessToken = token.split(" ")[1]
      try {
        jwt.verify(accessToken, process.env.SECRET_TOKEN_KEY, (err, data) => {
          if (err) {
            console.log(err)
            return res.status(401).json({message : "Not authozation", isSuccess : false})
          }
          if(data.role === 'admin') {
            req.data = data
            next()
          } else {
            return res.status(403).json({message : "You are not admin", isSuccess : false})
          }
        })
      } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Server is error", isSuccess : false})
      }
    } else {
      return res.status(400).json({message : "No token", isSuccess : false})
    }
  }
}