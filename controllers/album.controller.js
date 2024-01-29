const Album = require('../modeles/Album');
const path = require('path');
const fs = require('fs');

const albums = async (req,res)=>{
    const albums = await Album.find();
    // console.log(albums)
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

const addImageToAlbum= async(req,res) =>{
    const idAlbum = req.params.id;
    const album = await Album.findById(idAlbum);

    const imageName = req.files.image.name;

    const folderPath = path.join(__dirname,'../public/uploads',idAlbum)
    //pour créer un dossier de manière synchrone recursive: true va s'assurer que cela crée nos repertoires
    //de façon récursive cela veut dire que si on à notre dossier public mais qu'il n'y a pas de upload 
    //à l'intèrieur mkdirSync avec recursive à true va s'assurer que toute l'arborescence des fichiers est bien crée
    fs.mkdirSync(folderPath, { recursive: true })
    
    const localPath=path.join(folderPath, imageName)
    
    //la fonction mv est asynchrone
    await req.files.image.mv(localPath)

    album.images.push(imageName);
    await album.save();

    res.redirect(`/albums/${idAlbum}`)
}


const createAlbumForm = (req,res) => {
        res.render('newAlbum',{
            errors:req.flash('error')
        })
}

const createAlbum = async (req,res) => {

    try{
        const retour = await Album.create({
            title: req.body.albumTitle      
        })

        retour.save();
        res.redirect('/albums')
       
    }catch (err){
        console.log(err);
        req.flash('error','Erreur lors de la création de l\'album');
        res.redirect('/create')
    }
 
}

module.exports = {
    createAlbumForm,
    album,
    createAlbum,
    albums,
    addImageToAlbum,
}