const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors()); // permite conectar servidor y cliente simultaneamente (localhost:3000 y 4200)

app.use(express.json()); //para entender archivos json
app.use(express.urlencoded({extended:false})); //servidor es capaz de entender los datos que le envian desde un formulario y convertirlo en un objeto javascript
app.use(require('./controllers/authController'));
module.exports= app;