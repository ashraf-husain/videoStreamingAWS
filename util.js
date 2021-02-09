const AWS = require('aws-sdk')

module.exports = {
    /**
     * Function to validate the video files before upload
     * 
     * @param {*} req 
     * @param {*} file 
     * @param {*} cb 
     */
    validateVideos: (req, file, cb) => {
        // Accept videos only
        if (!file.mimetype.match('video\/\*/')) { // video/*
            req.fileValidationError = 'Only video files are allowed!';
            return cb(new Error('Only video files are allowed!'), false);
        }
        cb(null, true);
    },

    /**
     * This function is used as a helper to upload the given file to the AWS S3 server.
     *   
     * @param {MulterFile} file 
     * 
     * @returns {object} req | res
     */
    uploadFile: async (file) => {
        try {
            if (!file) {
                throw Error("file argument is required!")
            }
            console.log("Upload file", file)
            const s3 = new AWS.S3({
                accessKeyId: process.env.ACCESS_KEY, // set these credentials in .env file
                secretAccessKey: process.env.SECRET_KEY // set these credentials in .env file
            })

            const parameters = {
                Bucket: process.env.BUCKET_NAME, // set these credentials in .env file
                Key: file.originalname,
                Body: file.buffer
            }
            return await s3.upload(parameters).promise()
        } catch (err) {
            console.log("S3 upload error", err)
            throw Error(err.message)
        }
    }
}