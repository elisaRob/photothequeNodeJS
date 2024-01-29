const express =require("express");
const app = express();
const path = require('path');
const albumRoute = require('./routes/album.routes.js');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload')
const flash = require('connect-flash')

mongoose.connect('mongodb://127.0.0.1:27017/phototheque')

const publicPath = path.join(__dirname, 'public');

app.use(express.urlencoded({extended: false }))
app.use(express.json());
app.use(fileUpload())
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(publicPath));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(flash());

app.get('/',(req,res)=>{
    res.redirect('/albums')
})

app.use('/',albumRoute)

app.use((req,res)=>{
    res.status(404);
    res.send("Page non trouvée");
})

app.listen(3023,()=>{
    console.log(`on écoute`)
})