const AWS = require('aws-sdk')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const videoController = require('../controller/video')
const util = require('../util')

const router = express.Router()

const fileUpload = multer({storage: multer.memoryStorage(), fileFilter: util.validateVideos})

router.post('/upload', fileUpload.single('video'), videoController.uploadToS3)

router.get('/stream/:id', videoController.streamVideo)

module.exports = router