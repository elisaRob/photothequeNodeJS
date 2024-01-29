const express = require('express');
const router = express.Router();
const albumController = require("../controllers/album.controller")

router.get('/albums', albumController.albums);

router.get('/create', albumController.createAlbumForm);

router.post('/albums/create', albumController.createAlbum);

router.get('/albums/:id', albumController.album);

router.post('/albums/:id', albumController.addImageToAlbum);

router.get('/albums/:id/delete/:imageIndex', albumController.deleteImage);

router.get('/albums/:id/delete',albumController.deleteAlbum)

module.exports = router;