const express = require('express');
const { postImage , deleteImage, updateImage,getImages} = require('../contollers/image.controller');
const router = express.Router();
const auth = require('../middleware/auth')

router.post('/',auth,postImage);
router.get('/',auth,getImages);

module.exports = router;