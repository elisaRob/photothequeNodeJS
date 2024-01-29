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
        monAlbumVue : monAlbum,
        errors : req.flash('error','Aucun fichier mis en ligne')
    })
};

const addImageToAlbum= async(req,res) =>{
    const idAlbum = req.params.id;
    const album = await Album.findById(idAlbum);

    if(!req?.files?.image){
        req.flash('error','Aucun fichier mis en ligne')
        res.redirect(`/albums/${idAlbum}`);
        return;
    }

    if(req.files.image.mimetype != 'image/jpeg' && req.files.image.mimetype != 'image/png'){
        req.flash('error','Fichiers JPG et PNG accepté')
        res.redirect(`albums/${idAlbum}`);
        return;
    }

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

const deleteImage = async (req,res) => {
    const recuperationId = req.params.id;
    const recuperationAupresDeLaBaseDeDonnee = await Album.findById(recuperationId);

    const image = recuperationAupresDeLaBaseDeDonnee.images[req.params.imageIndex];
    if(!image){
        res.redirect(`albums/${recuperationId}`);
        return;
    }
    recuperationAupresDeLaBaseDeDonnee.images.splice(req.params.imageIndex,1);
    await recuperationAupresDeLaBaseDeDonnee.save();

    const imagePath = path.join(__dirname,`../public/uploads/${recuperationId}/${image}`);
    fs.unlinkSync(imagePath);

    res.redirect(`/albums/${recuperationId}`)
}

const deleteAlbum = async (req, res) => {
    const recuperationId = req.params.id;
    await Album.findByIdAndDelete(recuperationId);

    const albumPath = path.join(__dirname, `../public/uploads/${recuperationId}`);

    // Check if directory exists before attempting to delete
    if (fs.existsSync(albumPath)) {
        fs.rmdirSync(albumPath, { recursive: true });
    } else {
        console.log("Directory does not exist:", albumPath);
    }

    res.redirect(`/albums`);
}


module.exports = {
    createAlbumForm,
    album,
    createAlbum,
    albums,
    addImageToAlbum,
    deleteImage,
    deleteAlbum
}