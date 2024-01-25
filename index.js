const express =require("express");
const app = express();
const path = require('path');
const albumRoute = require('./routes/album.routes.js');
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/phototheque')

const publicPath = path.join(__dirname, 'public');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(publicPath));

app.get('/',(req,res)=>{
    res.render('album')
})

app.use('/',albumRoute)

app.use((req,res)=>{
    res.status(404);
    res.send("Page non trouvée");
})

app.listen(3023,()=>{
    console.log(`on écoute`)
})