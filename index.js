const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const PORT = 4000;
app.use(express.urlencoded());  //for ajax
app.use(express.json()); //for ajax
 
// Initialization
app.use(cookieParser());
 
app.use(session({
    secret: "amar",
    saveUninitialized: true,
    resave: true
}));
 
const port = 5001;

const db = require('./db/database.js');
const routes =  require('./routes/mainRoutes.js');


//app.set('port', process.env.port || port); // set express to use this port
//app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(express.static(path.join(__dirname, 'public/assets'))); // configure express to use public folder
app.use(fileUpload()); 
//--- Use Routes -----
app.use(routes);

global.db = db;
// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


