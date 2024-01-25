const express = require('express');
const router = express.Router();

router.get('/albums/create',(req,res)=>{
    res.render('newAlbum')
})

module.exports = router;