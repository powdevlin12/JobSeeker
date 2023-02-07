const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const path = require("path")
const dotenv = require('dotenv');
// env
dotenv.config();
let bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

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