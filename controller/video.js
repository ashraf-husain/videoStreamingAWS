const util = require('../util')
const videoModel = require('../model/video')
const { ObjectId } = require('mongoose').Types
const fs = require('fs')
const AWS = require('aws-sdk')
const { log } = require('console')

module.exports = {
    /**
     * This function will be used to upload a video file to the AWS S3 server.
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     * @returns {Object} res
     */
    uploadToS3: async (req, res) => {
        try {
            if (!req.file) {
                throw Error("Please select a video file to upload")
            }
            const s3Resp = await util.uploadFile(req.file)
            const { _id } = await videoModel.create({
                filePath: s3Resp.Location,
                key: s3Resp.Key
            })
            return res.status(200).json({
                status: true,
                message: "File uploaded successfully",
                id: _id, // id will be used for streamig the video from s3 server,
                s3Resp
            })
        } catch (err) {
            console.log("Upload file error", err)
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    },

    /**
     * This function will be used to stream the video by id.
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     * @returns {Buffer}
     */
    streamVideo: async (req, res) => {
        try {
            const { id } = req.params
            if (!id) {
                throw Error("Please select video to play!")
            }
            const s3 = new AWS.S3({
                accessKeyId: process.env.ACCESS_KEY, // set these credentials in .env file
                secretAccessKey: process.env.SECRET_KEY // set these credentials in .env file
            })
            const video = await videoModel.findById(ObjectId(id))
            const videoStream = s3.getObject({
                Bucket: process.env.BUCKET_NAME,
                Key: video.key
            }).createReadStream()
            videoStream.pipe(res)
        } catch (err) {
            console.log("Stream file error", err)
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }
}
