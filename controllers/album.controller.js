const Album = require('../modeles/Album')

const albums = async (req,res)=>{
    const albums = await Album.find();
    console.log(albums)
    res.render('albums',{
        mesAlbums : albums,
    })
}

const mongoose = require('mongoose');

const album = async (req, res) => {
    const idAlbum=req.params.id;
    const monAlbum = await Album.findById(idAlbum);
    console.log(monAlbum)

    res.render('album',{
        monAlbumVue : monAlbum
    })
};



const createAlbumForm = (req,res) => {
        res.render('newAlbum',{
            errors:req.flash('error')
        })
}

const createAlbum = async (req,res) => {

    try{
        if(!req.body.albumTitle){
            req.flash('error','Le titre doit être rentré');
            res.redirect('/albums/create');
            return;
        }
        const retour = await Album.create({
            title: req.body.albumTitle      
        })
            
        retour.save();
        res.redirect('/albums')
       
    }catch (err){
        console.log(err);
        req.flash('error','Erreur lors de la création de l\'album');
        res.redirect('/albums/create')
    }
 
}

module.exports = {
    createAlbumForm,
    album,
    createAlbum,
    albums,
 
}