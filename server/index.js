const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const path = require("path")
const dotenv = require('dotenv');
const cors = require('cors')
// env
dotenv.config();
app.use(cors());
app.options('*', cors());
let bodyParser = require('body-parser')
// user cors
app.use(cors())

// parse application/x-www-form-urlencoded
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// swagger
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition : {
    openapi : "3.0.0",
    info : {
      title : "Job Seeker",
      version : "1.0.0",
      description : "Dat Ngoc Ba Ngan Nghia"
    },
    servers : [
      {
        url : 'http://localhost:8000'
      }
    ],
  },
  apis : ["./src/controllers/*.js"]
}

const specs = swaggerJsdoc(options)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// parse application/json
app.use(bodyParser.json())

// static file 
app.use(express.static(path.join(__dirname, './public')));
// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
// Router
require('./src/routes')(app)

// config mongodb
require('./src/db').connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})